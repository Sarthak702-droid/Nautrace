import React, { useCallback, useEffect, useRef, useState } from "react";
import { CASES } from "./data/cases";
import type { IncidentCase, CandidateScore } from "./types";
import { AnalysisError, runAnalysis } from "./api/nautrace";
import { Header, type ActiveView } from "./components/Header";
import { CaseDataPanel } from "./components/CaseDataPanel";
import { ForensicMap } from "./components/ForensicMap";
import { TimelineScrubber } from "./components/TimelineScrubber";
import { SuspectsPanel } from "./components/SuspectsPanel";
import { ExplainabilityModal } from "./components/ExplainabilityModal";
import { AIForensicReportModal } from "./components/AIForensicReportModal";
import { NewCaseModal } from "./components/NewCaseModal";
import { NautraceConvexProvider } from "./convex/convexClient";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";

export const AppContent: React.FC = () => {
  const getInitialView = (): ActiveView => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'console' || view === 'about') return view;
      if (window.location.hash === '#console') return 'console';
    }
    return 'home';
  };

  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      const url = view === 'home' ? window.location.pathname : '?view=' + view;
      window.history.replaceState(null, '', url);
    }
  };
  const [customCases, setCustomCases] = useState<IncidentCase[]>([]);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState<boolean>(false);
  const allCases = [...customCases, ...CASES];

  const [currentCase, setCurrentCase] = useState<IncidentCase>(CASES[0]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("2026-08-14T03:30:00Z");
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>("vessel-a");
  const [explainedCandidate, setExplainedCandidate] = useState<CandidateScore | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  // A single in-flight analysis at a time; starting a new one supersedes the previous.
  const analysisAbortRef = useRef<AbortController | null>(null);

  useEffect(() => () => analysisAbortRef.current?.abort(), []);

  const runAnalysisFor = useCallback(async (target: IncidentCase) => {
    analysisAbortRef.current?.abort();
    const controller = new AbortController();
    analysisAbortRef.current = controller;

    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const analysed = await runAnalysis(target, controller.signal);
      setCurrentCase(analysed);
      setLayerVisibility((prev) => ({ ...prev, hindcastParticles: true }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setAnalysisError(
        err instanceof AnalysisError || err instanceof Error
          ? err.message
          : "Analysis failed for an unknown reason.",
      );
    } finally {
      if (analysisAbortRef.current === controller) {
        analysisAbortRef.current = null;
        setIsAnalyzing(false);
      }
    }
  }, []);

  const handleRunAnalysis = useCallback(() => {
    void runAnalysisFor(currentCase);
  }, [currentCase, runAnalysisFor]);

  const handleCreateCustomCase = (newCase: IncidentCase) => {
    setCustomCases((prev) => [newCase, ...prev]);
    setCurrentCase(newCase);
    if (newCase.tracks.length > 0) {
      setSelectedVesselId(newCase.tracks[0].id);
    }
    setCurrentTimeStr(newCase.detectionTime);
    void runAnalysisFor(newCase);
  };

  const handleSelectCase = (c: IncidentCase) => {
    analysisAbortRef.current?.abort();
    setAnalysisError(null);
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
      {/* Dark application header ONLY renders when in the Operational Console */}
      {activeView === 'console' && (
        <Header
          currentView={activeView}
          onNavigate={setActiveView}
          currentCase={currentCase}
          allCases={allCases}
          onSelectCase={handleSelectCase}
          onOpenReport={() => setIsReportOpen(true)}
          isAnalyzing={isAnalyzing}
          onRunAnalysis={handleRunAnalysis}
          onOpenNewCaseModal={() => setIsNewCaseOpen(true)}
        />
      )}

      {activeView === 'home' && (
        <HomePage 
          onLaunchConsole={() => setActiveView('console')}
          onOpenAbout={() => setActiveView('about')}
        />
      )}

      {activeView === 'about' && (
        <AboutPage 
          onBackToHome={() => setActiveView('home')}
          onLaunchConsole={() => setActiveView('console')}
        />
      )}

      {activeView === 'console' && analysisError && (
        <div className="analysis-error-banner" role="alert">
          <span className="analysis-error-label">ANALYSIS FAILED</span>
          <span className="analysis-error-text">{analysisError}</span>
          <button
            className="analysis-error-dismiss"
            onClick={() => setAnalysisError(null)}
            aria-label="Dismiss analysis error"
          >
            ×
          </button>
        </div>
      )}

      {activeView === 'console' && (
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
      )}

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

      {isNewCaseOpen && (
        <NewCaseModal
          onClose={() => setIsNewCaseOpen(false)}
          onCreateCase={handleCreateCustomCase}
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
