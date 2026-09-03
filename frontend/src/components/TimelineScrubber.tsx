import React, { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

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

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <button
          className="timeline-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause timeline" : "Play forward"}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          className="timeline-btn"
          onClick={() => onTimeChange(startTimeStr)}
          title="Reset to spill estimation window"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          className="timeline-btn-speed"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
          title="Playback Speed"
        >
          <span>{speed}x</span>
        </button>
      </div>

      <div className="timeline-slider-wrap">
        <div className="timeline-labels">
          <span className="label-marker start">{formatUTC(startTimeStr)} (Inferred Discharge)</span>
          <span className="label-marker center-highlight">
            TIMELINE SCRUBBER: <strong>{formatUTC(currentTimeStr)}</strong>
          </span>
          <span className="label-marker end">{formatUTC(endTimeStr)} (Sentinel-1 SAR Acquisition)</span>
        </div>

        <div className="slider-track-container">
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={progressPct}
            onChange={handleSliderChange}
            className="timeline-slider"
          />
          <div className="slider-progress-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>
    </div>
  );
};
