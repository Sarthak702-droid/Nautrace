package domain

type Classification string

const (
	ClassificationProbableOil Classification = "PROBABLE_OIL"
	ClassificationUncertain   Classification = "UNCERTAIN"
	ClassificationNoOil       Classification = "NO_OIL"
)

type Detection struct {
	ID                   string         `json:"id"`
	IncidentID           string         `json:"incidentId"`
	JobID                string         `json:"jobId"`
	SARAssetID           string         `json:"sarAssetId"`
	ModelID              string         `json:"modelId"`
	ModelVersion         string         `json:"modelVersion"`
	OilProbability       float64        `json:"oilProbability"`
	Classification       Classification `json:"classification"`
	LookAlikeRisk        float64        `json:"lookAlikeRisk"`
	SpillPolygon         *Geometry      `json:"spillPolygon"`
	Centroid             *Point         `json:"centroid"`
	AreaKm2              float64        `json:"areaKm2"`
	PerimeterKm          float64        `json:"perimeterKm"`
	ProbabilityRasterRef *string        `json:"probabilityRasterRef"`
	MaskRef              *string        `json:"maskRef"`
}
