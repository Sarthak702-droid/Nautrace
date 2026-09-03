package httpapi

import (
	"encoding/json"
	"net/http"
	"time"
	"fmt"
	"github.com/google/uuid"

	"nautrace/gateway/internal/domain"
)

func (s *Server) createIncident(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name          string           `json:"name"`
		Description   string           `json:"description"`
		AOI           *domain.Geometry `json:"aoi"`
		DetectionTime string           `json:"detectionTime"`
		HindcastHours int              `json:"hindcastHours"`
		ForecastHours int              `json:"forecastHours"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid_json"})
		return
	}
	t, _ := time.Parse(time.RFC3339, req.DetectionTime)
	inc := &domain.Incident{
		IncidentCode:  fmt.Sprintf("INC-%d", time.Now().Unix()),
		Name:          req.Name,
		Description:   req.Description,
		Status:        domain.IncidentStatusDraft,
		AOIGeoJSON:    req.AOI,
		DetectionTime: t,
		HindcastHours: req.HindcastHours,
		ForecastHours: req.ForecastHours,
	}
	if err := s.srv.CreateIncident(r.Context(), inc); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusCreated, inc)
}

func (s *Server) listIncidents(w http.ResponseWriter, r *http.Request) {
	res, err := s.srv.ListIncidents(r.Context())
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) getIncident(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	res, err := s.srv.GetIncident(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "not_found"})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) registerAsset(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req domain.DataAsset
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid_json"})
		return
	}
	req.IncidentID = id
	if err := s.srv.RegisterAsset(r.Context(), &req); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusCreated, req)
}

func (s *Server) listIncidentAssets(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	res, err := s.srv.ListIncidentAssets(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) getReadiness(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	res, err := s.srv.EvaluateReadiness(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) createJobHandler(jobType domain.JobType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		
		idempotencyKey := r.Header.Get("Idempotency-Key")
		if idempotencyKey == "" {
			idempotencyKey = uuid.NewString()
		}

		job := &domain.AnalysisJob{
			IncidentID:     id,
			JobType:        jobType,
			RequestID:      r.Header.Get("X-Request-ID"),
			IdempotencyKey: idempotencyKey,
			Status:         domain.JobStatusQueued,
		}
		
		if err := s.srv.CreateJob(r.Context(), job); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusAccepted, map[string]any{"jobId": job.ID})
	}
}

func (s *Server) getJob(w http.ResponseWriter, r *http.Request) {
	jobId := r.PathValue("jobId")
	res, err := s.srv.GetJob(r.Context(), jobId)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "not_found"})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) listJobs(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	res, err := s.srv.ListJobs(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, res)
}

func (s *Server) getInvestigation(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	res, err := s.srv.GetInvestigationAggregate(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, res)
}
