import React from 'react';
import type { IncidentCase } from '../types';
import { Activity, ArrowLeft, ChevronDown, FileText, Plus, Radar } from 'lucide-react';
import { NautraceLogo } from './NautraceLogo';

export type ActiveView = 'home' | 'console' | 'about';

interface HeaderProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  currentCase: IncidentCase;
  allCases: IncidentCase[];
  onSelectCase: (c: IncidentCase) => void;
  onOpenReport: () => void;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  onRunAnalysis: () => void;
  onOpenNewCaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentCase,
  allCases,
  onSelectCase,
  onOpenReport,
  isAnalyzing,
  hasAnalysis,
  onRunAnalysis,
  onOpenNewCaseModal,
}) => {
  return (
    <header className="header-container cyber-header">
      <div className="cyber-header-scanline"></div>

      <div className="header-left">
        <button
          onClick={() => onNavigate('home')}
          className="cyber-nav-back-btn"
          title="Back to landing"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>HOME</span>
        </button>

        <div
          onClick={() => onNavigate('home')}
          className="cyber-brand-wrap"
          style={{ cursor: 'pointer' }}
          title="NAUTRACE"
        >
          <NautraceLogo size="sm" variant="light" showSubtitle={false} />
        </div>

        <div className="cyber-case-selector">
          <div className="case-tag-indicator">
            <span className="case-tag-label">CASE</span>
          </div>
          <div className="case-select-wrapper">
            <select
              className="cyber-case-select"
              value={currentCase.id}
              onChange={(e) => {
                const found = allCases.find((c) => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
            >
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 cyber-select-arrow" />
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="console-flow-hint">
          {isAnalyzing
            ? 'Running hindcast + attribution…'
            : hasAnalysis
              ? 'Results from intelligence service'
              : 'Select a case → Run Analysis → review ranked vessels'}
        </div>
      </div>

      <div className="header-right">
        <button
          className="cyber-btn-secondary"
          onClick={onOpenNewCaseModal}
          title="Add a new incident input"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Case</span>
        </button>

        <button
          className={isAnalyzing ? 'cyber-btn-primary analyzing' : 'cyber-btn-primary'}
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          title="Run hindcast and vessel attribution"
        >
          <div className="btn-glow-layer"></div>
          {isAnalyzing ? (
            <>
              <Radar className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>{hasAnalysis ? 'Re-run Analysis' : 'Run Analysis'}</span>
            </>
          )}
        </button>

        <button
          className="cyber-btn-secondary"
          onClick={onOpenReport}
          disabled={!hasAnalysis}
          title={hasAnalysis ? 'Generate evidence brief' : 'Run analysis first'}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Report</span>
        </button>
      </div>
    </header>
  );
};
