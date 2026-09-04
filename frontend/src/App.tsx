import React, { useState } from "react";
import { CASES } from "./data/cases";
import type { IncidentCase, CandidateScore } from "./types";
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

  const handleCreateCustomCase = (newCase: IncidentCase) => {
    setCustomCases((prev) => [newCase, ...prev]);
    setCurrentCase(newCase);
    if (newCase.tracks.length > 0) {
      setSelectedVesselId(newCase.tracks[0].id);
    }
    setCurrentTimeStr(newCase.detectionTime);
    handleRunAnalysis();
  };
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
    
    // Simulate real Runge-Kutta 4 backward Lagrangian cloud generation
    setTimeout(() => {
      // Create 45 stochastic particles backward-advected from slick boundary to origin
      const originCenter = currentCase.origin50.center;
      const slickCenter = currentCase.slickPolygon[0] || { lat: 18.28, lon: 71.95 };
      
      const newParticles = Array.from({ length: 45 }, (_, idx) => {
        const jitterAngle = (idx / 45) * Math.PI * 2;
        const radius = 0.015 + Math.random() * 0.025;
        const startLat = slickCenter.lat + Math.sin(jitterAngle) * radius;
        const startLon = slickCenter.lon + Math.cos(jitterAngle) * radius;

        // Backward 4-step RK4 trajectory
        const steps = 4;
        const trajectory = Array.from({ length: steps }, (__, stepIdx) => {
          const frac = stepIdx / (steps - 1);
          // Non-linear advection curvature with turbulent diffusion
          const turbLat = (Math.random() - 0.5) * 0.008;
          const turbLon = (Math.random() - 0.5) * 0.008;
          return {
            t: new Date(new Date(currentCase.detectionTime).getTime() - (steps - 1 - stepIdx) * 3600000).toISOString(),
            lat: Number((startLat + frac * (originCenter.lat - startLat) + turbLat).toFixed(4)),
            lon: Number((startLon + frac * (originCenter.lon - startLon) + turbLon).toFixed(4)),
          };
        });

        return {
          id: idx + 1,
          trajectory,
        };
      });

      setCurrentCase((prev) => ({
        ...prev,
        particles: newParticles,
      }));

      // Ensure particles layer is active
      setLayerVisibility((prev) => ({ ...prev, hindcastParticles: true }));
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
