package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port                 string
	IntelligenceURL      string
	RequestTimeout       time.Duration
	ReadHeaderTimeout    time.Duration
	ReadTimeout          time.Duration
	IdleTimeout          time.Duration
	MaxRequestBodyBytes  int64
	MaxConcurrentAnalyze int
	RetryCount           int
	RetryBackoff         time.Duration
}

func Load() (Config, error) {
	cfg := Config{
		Port:                 getenv("PORT", "8080"),
		IntelligenceURL:      getenv("INTELLIGENCE_URL", "http://127.0.0.1:8000"),
		RequestTimeout:       durationSeconds("REQUEST_TIMEOUT_SECONDS", 120),
		ReadHeaderTimeout:    durationSeconds("READ_HEADER_TIMEOUT_SECONDS", 5),
		ReadTimeout:          durationSeconds("READ_TIMEOUT_SECONDS", 30),
		IdleTimeout:          durationSeconds("IDLE_TIMEOUT_SECONDS", 60),
		MaxRequestBodyBytes:  int64Env("MAX_REQUEST_BODY_BYTES", 64<<20),
		MaxConcurrentAnalyze: intEnv("MAX_CONCURRENT_ANALYSES", 4),
		RetryCount:           intEnv("INTELLIGENCE_RETRY_COUNT", 1),
		RetryBackoff:         durationMillis("INTELLIGENCE_RETRY_BACKOFF_MS", 250),
	}
	if cfg.MaxConcurrentAnalyze <= 0 {
		return Config{}, fmt.Errorf("MAX_CONCURRENT_ANALYSES must be positive")
	}
	if cfg.MaxRequestBodyBytes <= 0 {
		return Config{}, fmt.Errorf("MAX_REQUEST_BODY_BYTES must be positive")
	}
	return cfg, nil
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func intEnv(key string, fallback int) int {
	value, err := strconv.Atoi(getenv(key, strconv.Itoa(fallback)))
	if err != nil {
		return fallback
	}
	return value
}

func int64Env(key string, fallback int64) int64 {
	value, err := strconv.ParseInt(getenv(key, strconv.FormatInt(fallback, 10)), 10, 64)
	if err != nil {
		return fallback
	}
	return value
}

func durationSeconds(key string, fallback int) time.Duration {
	return time.Duration(intEnv(key, fallback)) * time.Second
}

func durationMillis(key string, fallback int) time.Duration {
	return time.Duration(intEnv(key, fallback)) * time.Millisecond
}
