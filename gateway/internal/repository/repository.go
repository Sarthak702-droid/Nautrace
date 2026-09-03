package repository

import (
	"context"
	"nautrace/gateway/internal/domain"
)

type IncidentRepository interface {
	CreateIncident(ctx context.Context, incident *domain.Incident) error
	GetIncident(ctx context.Context, id string) (*domain.Incident, error)
	ListIncidents(ctx context.Context) ([]*domain.Incident, error)
	UpdateIncidentStatus(ctx context.Context, id string, status domain.IncidentStatus) error
}

type AssetRepository interface {
	RegisterAsset(ctx context.Context, asset *domain.DataAsset) error
	ListIncidentAssets(ctx context.Context, incidentId string) ([]*domain.DataAsset, error)
	FindAssetByHash(ctx context.Context, hash string) (*domain.DataAsset, error)
}

type JobRepository interface {
	CreateJob(ctx context.Context, job *domain.AnalysisJob) error
	GetJob(ctx context.Context, id string) (*domain.AnalysisJob, error)
	ListJobs(ctx context.Context, incidentId string) ([]*domain.AnalysisJob, error)
	TransitionJob(ctx context.Context, id string, status domain.JobStatus) error
}

type AnalysisRepository interface {
	SaveDetection(ctx context.Context, det *domain.Detection) error
	SaveHindcast(ctx context.Context, run *domain.HindcastRun, origin *domain.OriginHypotheses) error
	SaveOrigin(ctx context.Context, origin *domain.OriginHypotheses) error
	SaveAISReconstruction(ctx context.Context, recon *domain.AISReconstruction) error
	SaveAttribution(ctx context.Context, run *domain.AttributionRun) error
	SaveCandidates(ctx context.Context, candidates []*domain.VesselCandidate) error
	SaveForecast(ctx context.Context, forecast *domain.ForecastRun) error
	GetInvestigationAggregate(ctx context.Context, incidentId string) (map[string]any, error)
}

type ModelRepository interface {
	RegisterModel(ctx context.Context, model *domain.Model) error
	GetProductionModel(ctx context.Context, task string) (*domain.Model, error)
	PromoteModel(ctx context.Context, modelId string) error
}

type DatasetRepository interface {
	RegisterDataset(ctx context.Context, dataset *domain.Dataset) error
	GetDataset(ctx context.Context, id string) (*domain.Dataset, error)
}

type ReportRepository interface {
	SaveReport(ctx context.Context, report *domain.Report) error
	GetReport(ctx context.Context, id string) (*domain.Report, error)
}

type AuditRepository interface {
	WriteAuditEvent(ctx context.Context, event *domain.AuditEvent) error
}
