package domain

type ModelStage string

const (
	ModelStageStaging    ModelStage = "STAGING"
	ModelStageProduction ModelStage = "PRODUCTION"
	ModelStageArchived   ModelStage = "ARCHIVED"
	ModelStageFailed     ModelStage = "FAILED"
)

type Model struct {
	ID                  string             `json:"id"`
	ModelID             string             `json:"modelId"`
	Task                string             `json:"task"`
	Version             string             `json:"version"`
	Architecture        string             `json:"architecture"`
	Stage               ModelStage         `json:"stage"`
	ArtifactProvider    string             `json:"artifactProvider"`
	ArtifactReference   *string            `json:"artifactReference"`
	SHA256              string             `json:"sha256"`
	InputChannels       int                `json:"inputChannels"`
	InputShape          []int              `json:"inputShape"`
	DecisionThreshold   float64            `json:"decisionThreshold"`
	TrainingDatasetIDs  []string           `json:"trainingDatasetIds"`
	Metrics             map[string]float64 `json:"metrics"`
	PreprocessingConfig map[string]any     `json:"preprocessingConfig"`
}

type Dataset struct {
	ID                string `json:"id"`
	DatasetID         string `json:"datasetId"`
	Name              string `json:"name"`
	Version           string `json:"version"`
	Source            string `json:"source"`
	SourceURL         string `json:"sourceUrl"`
	Task              string `json:"task"`
	Description       string `json:"description"`
	TrainCount        int    `json:"trainCount"`
	ValidationCount   int    `json:"validationCount"`
	TestCount         int    `json:"testCount"`
	ManifestReference string `json:"manifestReference"`
	SHA256            string `json:"sha256"`
	Status            string `json:"status"`
}
