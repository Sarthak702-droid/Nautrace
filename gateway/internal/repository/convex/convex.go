package convex

import (
	"context"
	"net/http"

	"nautrace/gateway/internal/domain"
	"nautrace/gateway/internal/repository"
)

type ConvexClient struct {
	url        string
	httpClient *http.Client
	token      string
}

func NewConvexClient(url, token string) *ConvexClient {
	return &ConvexClient{
		url:        url,
		httpClient: &http.Client{},
		token:      token,
	}
}

// IncidentRepository
func (c *ConvexClient) CreateIncident(ctx context.Context, incident *domain.Incident) error {
	return nil
}

func (c *ConvexClient) GetIncident(ctx context.Context, id string) (*domain.Incident, error) {
	return nil, nil
}

func (c *ConvexClient) ListIncidents(ctx context.Context) ([]*domain.Incident, error) {
	return nil, nil
}

func (c *ConvexClient) UpdateIncidentStatus(ctx context.Context, id string, status domain.IncidentStatus) error {
	return nil
}

// AssetRepository
func (c *ConvexClient) RegisterAsset(ctx context.Context, asset *domain.DataAsset) error {
	return nil
}

func (c *ConvexClient) ListIncidentAssets(ctx context.Context, incidentId string) ([]*domain.DataAsset, error) {
	return nil, nil
}

func (c *ConvexClient) FindAssetByHash(ctx context.Context, hash string) (*domain.DataAsset, error) {
	return nil, nil
}

// JobRepository
func (c *ConvexClient) CreateJob(ctx context.Context, job *domain.AnalysisJob) error {
	return nil
}

func (c *ConvexClient) GetJob(ctx context.Context, id string) (*domain.AnalysisJob, error) {
	return nil, nil
}

func (c *ConvexClient) ListJobs(ctx context.Context, incidentId string) ([]*domain.AnalysisJob, error) {
	return nil, nil
}

func (c *ConvexClient) TransitionJob(ctx context.Context, id string, status domain.JobStatus) error {
	return nil
}

// AnalysisRepository
func (c *ConvexClient) SaveDetection(ctx context.Context, det *domain.Detection) error {
	return nil
}

func (c *ConvexClient) SaveHindcast(ctx context.Context, run *domain.HindcastRun, origin *domain.OriginHypotheses) error {
	return nil
}

func (c *ConvexClient) SaveOrigin(ctx context.Context, origin *domain.OriginHypotheses) error {
	return nil
}

func (c *ConvexClient) SaveAISReconstruction(ctx context.Context, recon *domain.AISReconstruction) error {
	return nil
}

func (c *ConvexClient) SaveAttribution(ctx context.Context, run *domain.AttributionRun) error {
	return nil
}

func (c *ConvexClient) SaveCandidates(ctx context.Context, candidates []*domain.VesselCandidate) error {
	return nil
}

func (c *ConvexClient) SaveForecast(ctx context.Context, forecast *domain.ForecastRun) error {
	return nil
}

func (c *ConvexClient) GetInvestigationAggregate(ctx context.Context, incidentId string) (map[string]any, error) {
	return nil, nil
}

// ModelRepository
func (c *ConvexClient) RegisterModel(ctx context.Context, model *domain.Model) error {
	return nil
}

func (c *ConvexClient) GetProductionModel(ctx context.Context, task string) (*domain.Model, error) {
	return nil, nil
}

func (c *ConvexClient) PromoteModel(ctx context.Context, modelId string) error {
	return nil
}

// DatasetRepository
func (c *ConvexClient) RegisterDataset(ctx context.Context, dataset *domain.Dataset) error {
	return nil
}

func (c *ConvexClient) GetDataset(ctx context.Context, id string) (*domain.Dataset, error) {
	return nil, nil
}

// ReportRepository
func (c *ConvexClient) SaveReport(ctx context.Context, report *domain.Report) error {
	return nil
}

func (c *ConvexClient) GetReport(ctx context.Context, id string) (*domain.Report, error) {
	return nil, nil
}

// AuditRepository
func (c *ConvexClient) WriteAuditEvent(ctx context.Context, event *domain.AuditEvent) error {
	return nil
}

// compile time checks
var _ repository.IncidentRepository = (*ConvexClient)(nil)
var _ repository.AssetRepository = (*ConvexClient)(nil)
var _ repository.JobRepository = (*ConvexClient)(nil)
var _ repository.AnalysisRepository = (*ConvexClient)(nil)
var _ repository.ModelRepository = (*ConvexClient)(nil)
var _ repository.DatasetRepository = (*ConvexClient)(nil)
var _ repository.ReportRepository = (*ConvexClient)(nil)
var _ repository.AuditRepository = (*ConvexClient)(nil)
