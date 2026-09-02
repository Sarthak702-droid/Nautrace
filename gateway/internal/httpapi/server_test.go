package httpapi

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"nautrace/gateway/internal/intelligence"
)

func TestHealthz(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"status":"ready"}`)
	}))
	defer backend.Close()

	client := intelligence.New(backend.URL, 2*time.Second, 0, 0)
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	server := New(logger, client, 1, 1<<20)
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	resp := httptest.NewRecorder()
	server.Handler().ServeHTTP(resp, req)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.Code)
	}
}

func TestAnalyzeRejectsInvalidJSON(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = io.WriteString(w, `{}`)
	}))
	defer backend.Close()

	client := intelligence.New(backend.URL, 2*time.Second, 0, 0)
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	server := New(logger, client, 1, 1<<20)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/analyze", strings.NewReader("{"))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	server.Handler().ServeHTTP(resp, req)
	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestClientReady(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/readyz" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	defer backend.Close()
	client := intelligence.New(backend.URL, time.Second, 0, 0)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	if err := client.Ready(ctx); err != nil {
		t.Fatalf("expected ready: %v", err)
	}
}
