import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CASES } from "./data/cases";
import type { IncidentCase, CandidateScore } from "./types";
import { AnalysisError, runAnalysis } from "./api/nautrace";
import { hasAnalysisResults, toInputCase } from "./lib/caseInput";
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

const SEED_CASES = CASES.map(toInputCase);

export const AppContent: React.FC = () => {
  const getInitialView = (): ActiveView => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      if (view === "console" || view === "about") return view;
      if (window.location.hash === "#console") return "console";
    }
    return "home";
  };

  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    if (typeof window !== "undefined") {
      const url = view === "home" ? window.location.pathname : "?view=" + view;
      window.history.replaceState(null, "", url);
    }
  };

  const [customCases, setCustomCases] = useState<IncidentCase[]>([]);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  /** Backend results keyed by case id — seeds stay input-only until Run Analysis. */
  const [resultsById, setResultsById] = useState<Record<string, IncidentCase>>({});

  const seedCases = useMemo(() => SEED_CASES, []);
  const allCases = useMemo(() => [...customCases, ...seedCases], [customCases, seedCases]);

  const resolveCase = useCallback(
    (c: IncidentCase) => resultsById[c.id] ?? c,
    [resultsById],
  );

  const [currentCase, setCurrentCase] = useState<IncidentCase>(() => SEED_CASES[0]);
  const [currentTimeStr, setCurrentTimeStr] = useState(SEED_CASES[0].detectionTime);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [explainedCandidate, setExplainedCandidate] = useState<CandidateScore | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [layerVisibility, setLayerVisibility] = useState({
    sar: false,
    slick: true,
    origin50: true,
    origin90: true,
    aisTracks: true,
    hindcastParticles: true,
  });

  const handleToggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const analysisAbortRef = useRef<AbortController | null>(null);
  useEffect(() => () => analysisAbortRef.current?.abort(), []);

  const applyCaseSelection = useCallback((c: IncidentCase) => {
    setCurrentCase(c);
    setSelectedVesselId(null);
    setExplainedCandidate(null);
    if (c.tracks.length > 0) {
      const mid = c.tracks[0].points[Math.floor(c.tracks[0].points.length / 2)];
      setCurrentTimeStr(mid?.timestamp ?? c.detectionTime);
    } else {
      setCurrentTimeStr(c.detectionTime);
    }
    if (hasAnalysisResults(c) && c.decision?.topCandidateVesselId) {
      setSelectedVesselId(c.decision.topCandidateVesselId);
    }
  }, []);

  const runAnalysisFor = useCallback(async (target: IncidentCase) => {
    analysisAbortRef.current?.abort();
    const controller = new AbortController();
    analysisAbortRef.current = controller;

    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const analysed = await runAnalysis(toInputCase(target), controller.signal);
      setResultsById((prev) => ({ ...prev, [analysed.id]: analysed }));
      setCustomCases((prev) =>
        prev.map((c) => (c.id === analysed.id ? toInputCase(analysed) : c)),
      );
      setCurrentCase(analysed);
      setLayerVisibility((prev) => ({
        ...prev,
        hindcastParticles: true,
        origin50: true,
        origin90: true,
      }));
      if (analysed.decision?.topCandidateVesselId) {
        setSelectedVesselId(analysed.decision.topCandidateVesselId);
      } else if (analysed.candidates[0]) {
        setSelectedVesselId(analysed.candidates[0].id);
      }
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
    const input = toInputCase(newCase);
    setCustomCases((prev) => [input, ...prev]);
    applyCaseSelection(input);
    void runAnalysisFor(input);
  };

  const handleSelectCase = (c: IncidentCase) => {
    analysisAbortRef.current?.abort();
    setIsAnalyzing(false);
    setAnalysisError(null);
    applyCaseSelection(resolveCase(c));
  };

  const analysed = hasAnalysisResults(currentCase);

  return (
    <div
      className={
        activeView === "home"
          ? "nautrace-app-root nautrace-app-root--landing"
          : "nautrace-app-root"
      }
    >
      {activeView === "console" && (
        <Header
          currentView={activeView}
          onNavigate={setActiveView}
          currentCase={currentCase}
          allCases={allCases.map(resolveCase)}
          onSelectCase={handleSelectCase}
          onOpenReport={() => setIsReportOpen(true)}
          isAnalyzing={isAnalyzing}
          hasAnalysis={analysed}
          onRunAnalysis={handleRunAnalysis}
          onOpenNewCaseModal={() => setIsNewCaseOpen(true)}
        />
      )}

      {activeView === "home" && (
        <HomePage
          onLaunchConsole={() => setActiveView("console")}
          onOpenAbout={() => setActiveView("about")}
        />
      )}

      {activeView === "about" && (
        <AboutPage
          onBackToHome={() => setActiveView("home")}
          onLaunchConsole={() => setActiveView("console")}
        />
      )}

      {activeView === "console" && analysisError && (
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

      {activeView === "console" && (
        <main className="main-workspace-layout">
          <CaseDataPanel
            incident={currentCase}
            layerVisibility={layerVisibility}
            onToggleLayer={handleToggleLayer}
            isAnalyzing={isAnalyzing}
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
              startTimeStr={
                currentCase.tracks[0]?.points[0]?.timestamp || currentCase.detectionTime
              }
              endTimeStr={currentCase.detectionTime}
            />
          </section>

          <SuspectsPanel
            incident={currentCase}
            selectedVesselId={selectedVesselId}
            onSelectVessel={setSelectedVesselId}
            onExplainVessel={setExplainedCandidate}
            onGenerateAiReport={() => setIsReportOpen(true)}
            isAnalyzing={isAnalyzing}
            onRunAnalysis={handleRunAnalysis}
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
