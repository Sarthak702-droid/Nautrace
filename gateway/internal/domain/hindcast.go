package domain

import "time"

type HindcastRun struct {
	ID                  string    `json:"id"`
	IncidentID          string    `json:"incidentId"`
	JobID               string    `json:"jobId"`
	DetectionID         string    `json:"detectionId"`
	Engine              string    `json:"engine"`
	EngineVersion       string    `json:"engineVersion"`
	EnsembleSize        int       `json:"ensembleSize"`
	AlgorithmVersion    string    `json:"algorithmVersion"`
	ConfigHash          string    `json:"configHash"`
	RandomSeed          int       `json:"randomSeed"`
	SuccessfulMembers   int       `json:"successfulMembers"`
	FailedMembers       int       `json:"failedMembers"`
	ParticleArtifactRef *string   `json:"particleArtifactRef"`
	CreatedAt           time.Time `json:"createdAt"`
}

type OriginHypotheses struct {
	ID                 string    `json:"id"`
	HindcastRunID      string    `json:"hindcastRunId"`
	ReleaseTimeP05     time.Time `json:"releaseTimeP05"`
	ReleaseTimeMedian  time.Time `json:"releaseTimeMedian"`
	ReleaseTimeP95     time.Time `json:"releaseTimeP95"`
	Origin50GeoJSON    *Geometry `json:"origin50GeoJSON"`
	Origin90GeoJSON    *Geometry `json:"origin90GeoJSON"`
	Centroid           *Point    `json:"centroid"`
	SpatialBandwidthKm float64   `json:"spatialBandwidthKm"`
	CreatedAt          time.Time `json:"createdAt"`
}

type AISReconstruction struct {
	ID                string    `json:"id"`
	IncidentID        string    `json:"incidentId"`
	JobID             string    `json:"jobId"`
	AISAssetID        string    `json:"aisAssetId"`
	InputPointCount   int       `json:"inputPointCount"`
	KeptPointCount    int       `json:"keptPointCount"`
	RemovedPointCount int       `json:"removedPointCount"`
	VesselCount       int       `json:"vesselCount"`
	StartTime         time.Time `json:"startTime"`
	EndTime           time.Time `json:"endTime"`
	Warnings          []string  `json:"warnings"`
	ArtifactRef       *string   `json:"artifactRef"`
	CreatedAt         time.Time `json:"createdAt"`
}
