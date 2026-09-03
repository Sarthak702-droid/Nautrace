package domain

import "time"

type ForecastRun struct {
	ID               string    `json:"id"`
	IncidentID       string    `json:"incidentId"`
	JobID            string    `json:"jobId"`
	Engine           string    `json:"engine"`
	AlgorithmVersion string    `json:"algorithmVersion"`
	ConfigHash       string    `json:"configHash"`
	ForecastHours    int       `json:"forecastHours"`
	Status           string    `json:"status"`
	ForecastSummary  string    `json:"forecastSummary"`
	ArtifactRef      *string   `json:"artifactRef"`
	CreatedAt        time.Time `json:"createdAt"`
}

type Report struct {
	ID                string    `json:"id"`
	IncidentID        string    `json:"incidentId"`
	JobID             string    `json:"jobId"`
	ReportType        string    `json:"reportType"`
	Status            string    `json:"status"`
	ArtifactReference *string   `json:"artifactReference"`
	SHA256            *string   `json:"sha256"`
	GeneratedAt       time.Time `json:"generatedAt"`
}
