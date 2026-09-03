package domain

import "time"

type ResultType string

const (
	ResultTypeKnownVessel   ResultType = "KNOWN_VESSEL"
	ResultTypeUnknownNonAIS ResultType = "UNKNOWN_NON_AIS"
)

type AttributionRun struct {
	ID                    string     `json:"id"`
	IncidentID            string     `json:"incidentId"`
	JobID                 string     `json:"jobId"`
	HindcastRunID         string     `json:"hindcastRunId"`
	AISReconstructionID   string     `json:"aisReconstructionId"`
	AlgorithmVersion      string     `json:"algorithmVersion"`
	ConfigHash            string     `json:"configHash"`
	ResultType            ResultType `json:"resultType"`
	UnknownP05            float64    `json:"unknownP05"`
	UnknownMedian         float64    `json:"unknownMedian"`
	UnknownP95            float64    `json:"unknownP95"`
	ValidEnsembleFraction float64    `json:"validEnsembleFraction"`
	CreatedAt             time.Time  `json:"createdAt"`
}

type ScoreBreakdown struct {
	Spatial    float64 `json:"spatial"`
	Temporal   float64 `json:"temporal"`
	Heading    float64 `json:"heading"`
	Overlap50  float64 `json:"overlap50"`
	Overlap90  float64 `json:"overlap90"`
	Behaviour  float64 `json:"behaviour"`
	Continuity float64 `json:"continuity"`
	Quality    float64 `json:"quality"`
	GapPenalty float64 `json:"gapPenalty"`
}

type VesselCandidate struct {
	ID                      string         `json:"id"`
	AttributionRunID        string         `json:"attributionRunId"`
	MMSI                    string         `json:"MMSI"`
	VesselName              string         `json:"vesselName"`
	VesselType              string         `json:"vesselType"`
	Rank                    int            `json:"rank"`
	CompatibilityP05        float64        `json:"compatibilityP05"`
	CompatibilityMedian     float64        `json:"compatibilityMedian"`
	CompatibilityP95        float64        `json:"compatibilityP95"`
	RankStability           float64        `json:"rankStability"`
	MinimumOriginDistanceKm float64        `json:"minimumOriginDistanceKm"`
	ScoreBreakdown          ScoreBreakdown `json:"scoreBreakdown"`
	Explanations            []string       `json:"explanations"`
}
