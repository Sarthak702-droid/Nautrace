package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"nautrace/gateway/internal/config"
	"nautrace/gateway/internal/httpapi"
	"nautrace/gateway/internal/intelligence"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	cfg, err := config.Load()
	if err != nil {
		logger.Error("invalid_configuration", "error", err)
		os.Exit(2)
	}

	intel := intelligence.New(cfg.IntelligenceURL, cfg.RequestTimeout, cfg.RetryCount, cfg.RetryBackoff)
	api := httpapi.New(logger, intel, cfg.MaxConcurrentAnalyze, cfg.MaxRequestBodyBytes)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           api.Handler(),
		ReadHeaderTimeout: cfg.ReadHeaderTimeout,
		ReadTimeout:       cfg.ReadTimeout,
		WriteTimeout:      cfg.RequestTimeout + 10*time.Second,
		IdleTimeout:       cfg.IdleTimeout,
	}

	go func() {
		logger.Info("gateway_started", "addr", server.Addr, "intelligence_url", cfg.IntelligenceURL)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("gateway_failed", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Error("gateway_shutdown_failed", "error", err)
	}
	logger.Info("gateway_stopped")
}
