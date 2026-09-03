"use client";

import React, { useState } from "react";
import { BiopunkSidebar, ScreenId } from "@/components/BiopunkSidebar";
import { BiopunkHeader } from "@/components/BiopunkHeader";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { IncidentListScreen } from "@/components/screens/IncidentListScreen";
import { IncidentDetailsScreen } from "@/components/screens/IncidentDetailsScreen";
import { SARDetectionScreen } from "@/components/screens/SARDetectionScreen";
import { HindcastScreen } from "@/components/screens/HindcastScreen";
import { VesselAttributionScreen } from "@/components/screens/VesselAttributionScreen";
import { ForecastScreen } from "@/components/screens/ForecastScreen";
import { ReportsScreen } from "@/components/screens/ReportsScreen";
import { AlertsScreen } from "@/components/screens/AlertsScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { NewIncidentModal } from "@/components/NewIncidentModal";
import { INCIDENTS_DATA, ALERTS_DATA, IncidentItem } from "@/components/screens/mockData";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("INC-2026-008");
  const [incidents, setIncidents] = useState<IncidentItem[]>(INCIDENTS_DATA);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState<boolean>(false);

  const handleNavigate = (screen: ScreenId, incidentId?: string) => {
    if (incidentId) {
      setSelectedIncidentId(incidentId);
    }
    setCurrentScreen(screen);
  };

  const handleCreateIncident = (newInc: IncidentItem) => {
    setIncidents((prev) => [newInc, ...prev]);
    setSelectedIncidentId(newInc.id);
    setCurrentScreen("incident-details");
  };

  const activeCount = incidents.filter((i) => i.status === "Active").length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-abyss-950 font-sans select-none">
      {/* Biopunk Left Sidebar */}
      <BiopunkSidebar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        activeIncidentsCount={activeCount}
        alertsCount={ALERTS_DATA.length}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-abyss-950/95 relative">
        {/* Top Command & Telemetry Header */}
        <BiopunkHeader
          currentScreen={currentScreen}
          onNewIncident={() => setIsNewIncidentOpen(true)}
          onOpenAlerts={() => setCurrentScreen("alerts")}
          alertsCount={ALERTS_DATA.length}
        />

        {/* Dynamic Screen Viewport with Custom Scrollbar */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden biopunk-grid relative">
          {currentScreen === "dashboard" && (
            <DashboardScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === "incident-list" && (
            <IncidentListScreen
              onSelectIncident={(id) => handleNavigate("incident-details", id)}
              onNewIncident={() => setIsNewIncidentOpen(true)}
            />
          )}

          {currentScreen === "incident-details" && (
            <IncidentDetailsScreen
              incidentId={selectedIncidentId}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === "sar-detection" && (
            <SARDetectionScreen
              onBack={() => handleNavigate("incident-details")}
              onProceedToHindcast={() => handleNavigate("hindcast")}
            />
          )}

          {currentScreen === "hindcast" && (
            <HindcastScreen
              onBack={() => handleNavigate("incident-details")}
              onProceedToVessels={() => handleNavigate("vessel-attribution")}
            />
          )}

          {currentScreen === "vessel-attribution" && (
            <VesselAttributionScreen
              onBack={() => handleNavigate("incident-details")}
              onProceedToForecast={() => handleNavigate("forecast")}
            />
          )}

          {currentScreen === "forecast" && (
            <ForecastScreen
              onBack={() => handleNavigate("incident-details")}
              onProceedToReports={() => handleNavigate("reports")}
            />
          )}

          {currentScreen === "reports" && (
            <ReportsScreen />
          )}

          {currentScreen === "alerts" && (
            <AlertsScreen
              onSelectIncident={(id) => handleNavigate("incident-details", id)}
            />
          )}

          {currentScreen === "settings" && (
            <SettingsScreen />
          )}
        </main>
      </div>

      {/* New Incident Tasking Modal */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onCreated={handleCreateIncident}
      />
    </div>
  );
}
