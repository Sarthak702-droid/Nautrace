package domain

import "time"

type AuditEventType string

const (
	AuditEventIncidentCreated       AuditEventType = "INCIDENT_CREATED"
	AuditEventAssetRegistered       AuditEventType = "ASSET_REGISTERED"
	AuditEventDataReady             AuditEventType = "DATA_READY"
	AuditEventJobCreated            AuditEventType = "JOB_CREATED"
	AuditEventJobStarted            AuditEventType = "JOB_STARTED"
	AuditEventJobCompleted          AuditEventType = "JOB_COMPLETED"
	AuditEventJobFailed             AuditEventType = "JOB_FAILED"
	AuditEventDetectionPersisted    AuditEventType = "DETECTION_PERSISTED"
	AuditEventHindcastPersisted     AuditEventType = "HINDCAST_PERSISTED"
	AuditEventAttributionPersisted  AuditEventType = "ATTRIBUTION_PERSISTED"
	AuditEventUnknownSourceSelected AuditEventType = "UNKNOWN_SOURCE_SELECTED"
	AuditEventModelRegistered       AuditEventType = "MODEL_REGISTERED"
	AuditEventModelPromoted         AuditEventType = "MODEL_PROMOTED"
)

type AuditEvent struct {
	ID         string         `json:"id"`
	IncidentID string         `json:"incidentId"`
	JobID      *string        `json:"jobId"`
	EventType  AuditEventType `json:"eventType"`
	CreatedAt  time.Time      `json:"createdAt"`
	Details    map[string]any `json:"details"`
}
