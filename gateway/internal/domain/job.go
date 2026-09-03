package domain

import "time"

type JobStatus string

const (
	JobStatusQueued    JobStatus = "QUEUED"
	JobStatusRunning   JobStatus = "RUNNING"
	JobStatusCompleted JobStatus = "COMPLETED"
	JobStatusFailed    JobStatus = "FAILED"
	JobStatusCancelled JobStatus = "CANCELLED"
)

type JobType string

const (
	JobTypeDetection         JobType = "DETECTION"
	JobTypeHindcast          JobType = "HINDCAST"
	JobTypeAISReconstruction JobType = "AIS_RECONSTRUCTION"
	JobTypeAttribution       JobType = "ATTRIBUTION"
	JobTypeForecast          JobType = "FORECAST"
	JobTypeReport            JobType = "REPORT"
)

type AnalysisJob struct {
	ID               string     `json:"id"`
	IncidentID       string     `json:"incidentId"`
	JobType          JobType    `json:"jobType"`
	RequestID        string     `json:"requestId"`
	IdempotencyKey   string     `json:"idempotencyKey"`
	Status           JobStatus  `json:"status"`
	Progress         float64    `json:"progress"`
	Stage            string     `json:"stage"`
	AlgorithmVersion *string    `json:"algorithmVersion"`
	ModelVersion     *string    `json:"modelVersion"`
	InputHash        *string    `json:"inputHash"`
	OutputHash       *string    `json:"outputHash"`
	AttemptCount     int        `json:"attemptCount"`
	ErrorCode        *string    `json:"errorCode"`
	ErrorMessage     *string    `json:"errorMessage"`
	CreatedAt        time.Time  `json:"createdAt"`
	StartedAt        *time.Time `json:"startedAt"`
	CompletedAt      *time.Time `json:"completedAt"`
}
