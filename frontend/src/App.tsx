import React, { useState } from "react";
import { CASES } from "./data/cases";
import type { IncidentCase, CandidateScore } from "./types";
import { Header } from "./components/Header";
import { CaseDataPanel } from "./components/CaseDataPanel";
import { ForensicMap } from "./components/ForensicMap";
import { TimelineScrubber } from "./components/TimelineScrubber";
import { SuspectsPanel } from "./components/SuspectsPanel";
import { ExplainabilityModal } from "./components/ExplainabilityModal";
import { AIForensicReportModal } from "./components/AIForensicReportModal";
import { NautraceConvexProvider } from "./convex/convexClient";

export const AppContent: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<IncidentCase>(CASES[0]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("2026-08-14T03:30:00Z");
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>("vessel-a");
  const [explainedCandidate, setExplainedCandidate] = useState<CandidateScore | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [layerVisibility, setLayerVisibility] = useState({
    sar: true,
    slick: true,
    origin50: true,
    origin90: true,
    aisTracks: true,
    hindcastParticles: true,
  });

  const handleToggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleSelectCase = (c: IncidentCase) => {
    setCurrentCase(c);
    if (c.tracks.length > 0) {
      setSelectedVesselId(c.tracks[0].id);
      setCurrentTimeStr(c.tracks[0].points[Math.floor(c.tracks[0].points.length / 2)].timestamp);
    } else {
      setSelectedVesselId(null);
      setCurrentTimeStr(c.detectionTime);
    }
  };

  return (
    <div className="nautrace-app-root">
      <Header
        currentCase={currentCase}
        allCases={CASES}
        onSelectCase={handleSelectCase}
        onOpenReport={() => setIsReportOpen(true)}
        isAnalyzing={isAnalyzing}
        onRunAnalysis={handleRunAnalysis}
      />

      <main className="main-workspace-layout">
        <CaseDataPanel
          incident={currentCase}
          layerVisibility={layerVisibility}
          onToggleLayer={handleToggleLayer}
        />

        <section className="center-map-workspace">
          <ForensicMap
            incident={currentCase}
            currentTimeStr={currentTimeStr}
            layerVisibility={layerVisibility}
            selectedVesselId={selectedVesselId}
            onSelectVessel={setSelectedVesselId}
          />

          <TimelineScrubber
            currentTimeStr={currentTimeStr}
            onTimeChange={setCurrentTimeStr}
            startTimeStr={currentCase.tracks[0]?.points[0]?.timestamp || "2026-08-14T02:00:00Z"}
            endTimeStr={currentCase.detectionTime}
          />
        </section>

        <SuspectsPanel
          incident={currentCase}
          selectedVesselId={selectedVesselId}
          onSelectVessel={setSelectedVesselId}
          onExplainVessel={setExplainedCandidate}
          onGenerateAiReport={() => setIsReportOpen(true)}
        />
      </main>

      {explainedCandidate && (
        <ExplainabilityModal
          candidate={explainedCandidate}
          onClose={() => setExplainedCandidate(null)}
        />
      )}

      {isReportOpen && (
        <AIForensicReportModal
          incident={currentCase}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <NautraceConvexProvider>
      <AppContent />
    </NautraceConvexProvider>
  );
}
