import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Clock, FastForward } from 'lucide-react';

interface TimelineScrubberProps {
  currentTimeStr: string;
  onTimeChange: (timeStr: string) => void;
  startTimeStr: string;
  endTimeStr: string;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentTimeStr,
  onTimeChange,
  startTimeStr,
  endTimeStr,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const startMs = new Date(startTimeStr).getTime();
  const endMs = new Date(endTimeStr).getTime();
  const currentMs = new Date(currentTimeStr).getTime();

  const progressPct = Math.max(0, Math.min(100, ((currentMs - startMs) / (endMs - startMs)) * 100));

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const stepMs = 60 * 1000 * 5 * speed; // 5 min per tick * speed
        let nextMs = currentMs + stepMs;
        if (nextMs > endMs) {
          nextMs = startMs;
        }
        onTimeChange(new Date(nextMs).toISOString());
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentMs, startMs, endMs, speed, onTimeChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value);
    const targetMs = startMs + (pct / 100) * (endMs - startMs);
    onTimeChange(new Date(targetMs).toISOString());
  };

  const formatUTC = (iso: string) => {
    const d = new Date(iso);
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')} UTC`;
  };

  // Relative hours/min from start
  const diffMin = Math.round((currentMs - startMs) / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  const relTimeStr = `+${diffHours}h ${remMin}m`;

  return (
    <div className="timeline-container cyber-timeline">
      <div className="timeline-controls cyber-timeline-ctrls">
        <button
          className={`timeline-btn cyber-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause timeline' : 'Execute playback'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400 ml-0.5" />}
        </button>

        <button
          className="timeline-btn cyber-reset-btn"
          onClick={() => onTimeChange(startTimeStr)}
          title="Reset to discharge estimation window"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
        </button>

        <button
          className="timeline-btn-speed cyber-speed-pill"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
          title="Playback Acceleration Factor"
        >
          <FastForward className="w-3 h-3 mr-1 text-cyan-400" />
          <span>{speed}x</span>
        </button>
      </div>

      <div className="timeline-slider-wrap cyber-slider-wrap">
        <div className="timeline-labels">
          <div className="label-marker start cyber-label-start">
            <span className="dot-time green"></span>
            <span>{formatUTC(startTimeStr)} [DISCHARGE WINDOW]</span>
          </div>

          <div className="label-marker center-highlight cyber-label-center">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>FORENSIC TIMELINE: <strong>{formatUTC(currentTimeStr)}</strong> ({relTimeStr})</span>
          </div>

          <div className="label-marker end cyber-label-end">
            <span>{formatUTC(endTimeStr)} [SAR PASS]</span>
            <span className="dot-time cyan"></span>
          </div>
        </div>

        <div className="slider-track-container cyber-track-container">
          {/* Milestone Waypoint Markers along the track */}
          <div className="waypoint-marker waypoint-start" style={{ left: '0%' }} title="Estimated Discharge"></div>
          <div className="waypoint-marker waypoint-cpa" style={{ left: '50%' }} title="Suspect #1 Closest Approach (CPA)"></div>
          <div className="waypoint-marker waypoint-end" style={{ left: '100%' }} title="Sentinel-1 SAR Detection"></div>

          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={progressPct}
            onChange={handleSliderChange}
            className="timeline-slider cyber-timeline-slider"
          />
          <div className="slider-progress-fill cyber-slider-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>
    </div>
  );
};
