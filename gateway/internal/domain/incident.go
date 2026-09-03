package domain

import "time"

type IncidentStatus string

const (
	IncidentStatusDraft                     IncidentStatus = "DRAFT"
	IncidentStatusAwaitingData              IncidentStatus = "AWAITING_DATA"
	IncidentStatusDataReady                 IncidentStatus = "DATA_READY"
	IncidentStatusDetectionPending          IncidentStatus = "DETECTION_PENDING"
	IncidentStatusDetectionRunning          IncidentStatus = "DETECTION_RUNNING"
	IncidentStatusDetectionComplete         IncidentStatus = "DETECTION_COMPLETE"
	IncidentStatusHindcastPending           IncidentStatus = "HINDCAST_PENDING"
	IncidentStatusHindcastRunning           IncidentStatus = "HINDCAST_RUNNING"
	IncidentStatusHindcastComplete          IncidentStatus = "HINDCAST_COMPLETE"
	IncidentStatusAISReconstructionPending  IncidentStatus = "AIS_RECONSTRUCTION_PENDING"
	IncidentStatusAISReconstructionComplete IncidentStatus = "AIS_RECONSTRUCTION_COMPLETE"
	IncidentStatusAttributionPending        IncidentStatus = "ATTRIBUTION_PENDING"
	IncidentStatusAttributionRunning        IncidentStatus = "ATTRIBUTION_RUNNING"
	IncidentStatusAttributionComplete       IncidentStatus = "ATTRIBUTION_COMPLETE"
	IncidentStatusForecastPending           IncidentStatus = "FORECAST_PENDING"
	IncidentStatusForecastRunning           IncidentStatus = "FORECAST_RUNNING"
	IncidentStatusForecastComplete          IncidentStatus = "FORECAST_COMPLETE"
	IncidentStatusReportReady               IncidentStatus = "REPORT_READY"
	IncidentStatusFailed                    IncidentStatus = "FAILED"
)

type Geometry struct {
	Type        string        `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"` // simplified
}

type Point struct {
	Type        string    `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}

type BBox struct {
	West  float64 `json:"west"`
	South float64 `json:"south"`
	East  float64 `json:"east"`
	North float64 `json:"north"`
}

type Incident struct {
	ID            string         `json:"id"`
	IncidentCode  string         `json:"incidentCode"`
	Name          string         `json:"name"`
	Description   string         `json:"description"`
	Status        IncidentStatus `json:"status"`
	AOIGeoJSON    *Geometry      `json:"aoiGeoJSON"`
	BBox          *BBox          `json:"bbox"`
	DetectionTime time.Time      `json:"detectionTime"`
	HindcastHours int            `json:"hindcastHours"`
	ForecastHours int            `json:"forecastHours"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
}
