package main

import (
	"log/slog"
	"net/http"
	"os"

	"nautrace/gateway/internal/config"
	"nautrace/gateway/internal/httpapi"
	"nautrace/gateway/internal/intelligence"
	"nautrace/gateway/internal/repository/convex"
	"nautrace/gateway/internal/service"
	"nautrace/gateway/internal/domain"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load()
	if err != nil {
		logger.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	intelClient := intelligence.New(cfg.IntelligenceURL, cfg.RequestTimeout, cfg.RetryCount, cfg.RetryBackoff)

	convexClient := convex.NewConvexClient(cfg.ConvexURL, cfg.ConvexAuthToken)
	srv := service.NewService(
		convexClient,
		convexClient,
		convexClient,
		convexClient,
		convexClient,
		convexClient,
		convexClient,
		convexClient,
		[]domain.AssetType{domain.AssetTypeSentinelSAR, domain.AssetTypeCMEMSCurrent, domain.AssetTypeERA5Wind, domain.AssetTypeAIS},
	)

	server := httpapi.New(logger, intelClient, srv, cfg.MaxConcurrentAnalyze, cfg.MaxRequestBodyBytes)

	logger.Info("starting server", "port", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, server.Handler()); err != nil {
		logger.Error("server failed", "error", err)
		os.Exit(1)
	}
}
