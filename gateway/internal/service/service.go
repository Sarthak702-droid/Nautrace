package service

import (
	"context"

	"nautrace/gateway/internal/domain"
	"nautrace/gateway/internal/repository"
)

type Service struct {
	incidents repository.IncidentRepository
	assets    repository.AssetRepository
	jobs      repository.JobRepository
	analysis  repository.AnalysisRepository
	models    repository.ModelRepository
	datasets  repository.DatasetRepository
	reports   repository.ReportRepository
	audit     repository.AuditRepository

	requiredAssets []domain.AssetType
}

func NewService(
	incidents repository.IncidentRepository,
	assets repository.AssetRepository,
	jobs repository.JobRepository,
	analysis repository.AnalysisRepository,
	models repository.ModelRepository,
	datasets repository.DatasetRepository,
	reports repository.ReportRepository,
	audit repository.AuditRepository,
	requiredAssets []domain.AssetType,
) *Service {
	return &Service{
		incidents:      incidents,
		assets:         assets,
		jobs:           jobs,
		analysis:       analysis,
		models:         models,
		datasets:       datasets,
		reports:        reports,
		audit:          audit,
		requiredAssets: requiredAssets,
	}
}

func (s *Service) EvaluateReadiness(ctx context.Context, incidentId string) (*domain.ReadinessResponse, error) {
	assets, err := s.assets.ListIncidentAssets(ctx, incidentId)
	if err != nil {
		return nil, err
	}

	hasAsset := make(map[domain.AssetType]bool)
	for _, a := range assets {
		hasAsset[a.AssetType] = true
	}

	resp := &domain.ReadinessResponse{
		IncidentID: incidentId,
		Overall:    domain.ReadinessStatusReady,
		Assets:     make(map[domain.AssetType]domain.ReadinessStatus),
		Issues:     []string{},
	}

	for _, req := range s.requiredAssets {
		if hasAsset[req] {
			resp.Assets[req] = domain.ReadinessStatusReady
		} else {
			resp.Assets[req] = domain.ReadinessStatusMissing
			resp.Overall = domain.ReadinessStatusNotReady
			resp.Issues = append(resp.Issues, "Missing asset: "+string(req))
		}
	}

	return resp, nil
}

func (s *Service) CreateIncident(ctx context.Context, inc *domain.Incident) error {
	err := s.incidents.CreateIncident(ctx, inc)
	if err != nil {
		return err
	}

	_ = s.audit.WriteAuditEvent(ctx, &domain.AuditEvent{
		IncidentID: inc.ID,
		EventType:  domain.AuditEventIncidentCreated,
	})
	return nil
}

func (s *Service) GetInvestigationAggregate(ctx context.Context, incidentId string) (map[string]any, error) {
	return s.analysis.GetInvestigationAggregate(ctx, incidentId)
}

func (s *Service) GetIncident(ctx context.Context, id string) (*domain.Incident, error) {
	return s.incidents.GetIncident(ctx, id)
}
func (s *Service) ListIncidents(ctx context.Context) ([]*domain.Incident, error) {
	return s.incidents.ListIncidents(ctx)
}
func (s *Service) RegisterAsset(ctx context.Context, asset *domain.DataAsset) error {
	err := s.assets.RegisterAsset(ctx, asset)
	if err == nil {
		_ = s.audit.WriteAuditEvent(ctx, &domain.AuditEvent{IncidentID: asset.IncidentID, EventType: domain.AuditEventAssetRegistered})
	}
	return err
}
func (s *Service) ListIncidentAssets(ctx context.Context, incidentId string) ([]*domain.DataAsset, error) {
	return s.assets.ListIncidentAssets(ctx, incidentId)
}
func (s *Service) CreateJob(ctx context.Context, job *domain.AnalysisJob) error {
	err := s.jobs.CreateJob(ctx, job)
	if err == nil {
		_ = s.audit.WriteAuditEvent(ctx, &domain.AuditEvent{IncidentID: job.IncidentID, JobID: &job.ID, EventType: domain.AuditEventJobCreated})
	}
	return err
}
func (s *Service) GetJob(ctx context.Context, id string) (*domain.AnalysisJob, error) {
	return s.jobs.GetJob(ctx, id)
}
func (s *Service) ListJobs(ctx context.Context, incidentId string) ([]*domain.AnalysisJob, error) {
	return s.jobs.ListJobs(ctx, incidentId)
}
