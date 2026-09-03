package domain

import "time"

type AssetType string
type StorageProvider string

const (
	AssetTypeSentinelSAR  AssetType = "SENTINEL_SAR"
	AssetTypeCMEMSCurrent AssetType = "CMEMS_CURRENT"
	AssetTypeERA5Wind     AssetType = "ERA5_WIND"
	AssetTypeECMWFWind    AssetType = "ECMWF_WIND"
	AssetTypeAIS          AssetType = "AIS"
	AssetTypeOther        AssetType = "OTHER"
)

const (
	StorageProviderNone       StorageProvider = "NONE"
	StorageProviderLocal      StorageProvider = "LOCAL"
	StorageProviderMinIO      StorageProvider = "MINIO"
	StorageProviderS3         StorageProvider = "S3"
	StorageProviderConvexFile StorageProvider = "CONVEX_FILE"
)

type DataAsset struct {
	ID              string          `json:"id"`
	IncidentID      string          `json:"incidentId"`
	AssetType       AssetType       `json:"assetType"`
	Provider        string          `json:"provider"`
	DatasetID       string          `json:"datasetId"`
	SourceReference string          `json:"sourceReference"`
	StorageProvider StorageProvider `json:"storageProvider"`
	StorageKey      *string         `json:"storageKey"`
	SHA256          string          `json:"sha256"`
	FileSize        *int64          `json:"fileSize"`
	OriginalName    *string         `json:"originalName"`
	StartTime       time.Time       `json:"startTime"`
	EndTime         time.Time       `json:"endTime"`
	BBox            *BBox           `json:"bbox"`
	Variables       []string        `json:"variables"`
	IngestionStatus string          `json:"ingestionStatus"`
	Metadata        map[string]any  `json:"metadata"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
}

type ReadinessStatus string

const (
	ReadinessStatusReady    ReadinessStatus = "READY"
	ReadinessStatusMissing  ReadinessStatus = "MISSING"
	ReadinessStatusNotReady ReadinessStatus = "NOT_READY"
)

type ReadinessResponse struct {
	IncidentID string                        `json:"incidentId"`
	Overall    ReadinessStatus               `json:"overall"`
	Assets     map[AssetType]ReadinessStatus `json:"assets"`
	Issues     []string                      `json:"issues"`
}
