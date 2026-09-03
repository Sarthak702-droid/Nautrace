package httpapi

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"time"

	"nautrace/gateway/internal/intelligence"
	"nautrace/gateway/internal/service"
	"nautrace/gateway/internal/middleware"
)

type Server struct {
	logger    *slog.Logger
	intel     *intelligence.Client
	srv       *service.Service
	semaphore chan struct{}
	maxBody   int64
}

func New(logger *slog.Logger, intel *intelligence.Client, srv *service.Service, maxConcurrent int, maxBody int64) *Server {
	return &Server{
		logger:    logger,
		intel:     intel,
		srv:       srv,
		semaphore: make(chan struct{}, maxConcurrent),
		maxBody:   maxBody,
	}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", s.healthz)
	mux.HandleFunc("GET /readyz", s.readyz)
	mux.HandleFunc("POST /api/v1/analyze", s.analyze)
	mux.HandleFunc("POST /api/v1/incidents", s.createIncident)
	mux.HandleFunc("GET /api/v1/incidents", s.listIncidents)
	mux.HandleFunc("GET /api/v1/incidents/{id}", s.getIncident)
	mux.HandleFunc("POST /api/v1/incidents/{id}/assets", s.registerAsset)
	mux.HandleFunc("GET /api/v1/incidents/{id}/assets", s.listIncidentAssets)
	mux.HandleFunc("GET /api/v1/incidents/{id}/readiness", s.getReadiness)
	mux.HandleFunc("POST /api/v1/incidents/{id}/detect", s.createJobHandler("DETECTION"))
	mux.HandleFunc("POST /api/v1/incidents/{id}/hindcast", s.createJobHandler("HINDCAST"))
	mux.HandleFunc("POST /api/v1/incidents/{id}/ais/reconstruct", s.createJobHandler("AIS_RECONSTRUCTION"))
	mux.HandleFunc("POST /api/v1/incidents/{id}/attribute", s.createJobHandler("ATTRIBUTION"))
	mux.HandleFunc("POST /api/v1/incidents/{id}/forecast", s.createJobHandler("FORECAST"))
	mux.HandleFunc("POST /api/v1/incidents/{id}/report", s.createJobHandler("REPORT"))
	mux.HandleFunc("GET /api/v1/jobs/{jobId}", s.getJob)
	mux.HandleFunc("GET /api/v1/incidents/{id}/jobs", s.listJobs)
	mux.HandleFunc("GET /api/v1/incidents/{id}/investigation", s.getInvestigation)


	var h http.Handler = mux
	h = middleware.JSONOnly(h)
	h = middleware.LimitBody(s.maxBody, h)
	h = middleware.SecurityHeaders(h)
	h = middleware.RequestID(h)
	h = middleware.Logging(s.logger, h)
	h = middleware.Recover(s.logger, h)
	return h
}

func (s *Server) healthz(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"status": "ok", "service": "nautrace-gateway"})
}

func (s *Server) readyz(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()
	if err := s.intel.Ready(ctx); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]any{
			"status":     "not_ready",
			"dependency": "intelligence",
			"message":    err.Error(),
		})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"status": "ready"})
}

func (s *Server) acquire() bool {
	select {
	case s.semaphore <- struct{}{}:
		return true
	default:
		return false
	}
}

func (s *Server) release() {
	<-s.semaphore
}

func (s *Server) analyze(w http.ResponseWriter, r *http.Request) {
	if !s.acquire() {
		w.Header().Set("Retry-After", "2")
		writeJSON(w, http.StatusServiceUnavailable, map[string]any{
			"error":   "analysis_capacity_exhausted",
			"message": "all analysis workers are busy; retry the same request",
		})
		return
	}
	defer s.release()

	requestID := r.Header.Get("X-Request-ID")
	payload, err := io.ReadAll(r.Body)
	if err != nil {
		var maxErr *http.MaxBytesError
		if errors.As(err, &maxErr) {
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]any{"error": "request_too_large"})
			return
		}
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "request_read_failed", "message": err.Error()})
		return
	}
	if len(payload) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "empty_request"})
		return
	}
	if !json.Valid(payload) {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid_json"})
		return
	}

	digest := sha256.Sum256(payload)
	requestHash := hex.EncodeToString(digest[:])
	started := time.Now()
	body, status, err := s.intel.Analyze(r.Context(), requestID, payload)
	if err != nil {
		s.logger.Error("intelligence_request_failed", "error", err, "request_id", requestID)
		writeJSON(w, http.StatusBadGateway, map[string]any{
			"request_id":     requestID,
			"request_sha256": requestHash,
			"error":          "intelligence_unavailable",
		})
		return
	}
	if status < 200 || status >= 300 {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Request-SHA256", requestHash)
		w.WriteHeader(status)
		_, _ = w.Write(body)
		return
	}

	var analysis any
	if err := json.Unmarshal(body, &analysis); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]any{"error": "invalid_intelligence_response"})
		return
	}
	w.Header().Set("X-Request-SHA256", requestHash)
	writeJSON(w, http.StatusOK, map[string]any{
		"request_id":     requestID,
		"request_sha256": requestHash,
		"elapsed_ms":     time.Since(started).Milliseconds(),
		"analysis":       analysis,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
