import React, { useMemo } from 'react';
import { Play, Pause } from 'lucide-react';
import './Timeline.css';

interface TimelineProps {
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSelectPin?: (pinId: string) => void;
}

interface TimelinePin {
  id: string;
  label: string;
  position: number; // 0 to 100%
  color: string;
  hasAiTag?: boolean;
}

const TIMELINE_TICKS = [
  '18 Jan', '20 May', '22 May', '24 May', '16 May', '18 May', 
  '20 May', '01 May', '02 Day', '03 Day', '04 Day', '08 Day', 
  '15 May', '25 May', '03 Nov'
];

const MILESTONE_PINS: TimelinePin[] = [
  { id: 'pin-1', label: 'Argo 0045', position: 31, color: '#00d4ff' },
  { id: 'pin-2', label: 'AI Anomaly', position: 41, color: '#ff6b4a', hasAiTag: true },
  { id: 'pin-3', label: 'Altimetry', position: 65, color: '#7a9cae' },
  { id: 'pin-4', label: 'Upwelling', position: 74, color: '#ff6b4a' }
];

export default function Timeline({
  onTimeChange,
  isPlaying,
  onPlayPause,
  onSelectPin
}: TimelineProps) {
  const [progress, setProgress] = React.useState(31);

  // Generate smooth waveform path
  const waveformPath = useMemo(() => {
    const points = [];
    const totalPoints = 120;
    for (let i = 0; i <= totalPoints; i++) {
      const x = (i / totalPoints) * 1000;
      // Anomaly spike around x = 410 (41%)
      const anomalyFactor = Math.exp(-Math.pow((i - 49) / 7, 2)) * 14;
      const baseWave = Math.sin(i * 0.18) * 6 + Math.cos(i * 0.35) * 4;
      const y = 24 - baseWave - anomalyFactor;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const dateOffsetDays = Math.round((val / 100) * 180);
    const newDate = new Date('2024-05-01');
    newDate.setDate(newDate.getDate() + dateOffsetDays);
    onTimeChange(newDate);
  };

  const handlePinClick = (pin: TimelinePin) => {
    setProgress(pin.position);
    if (onSelectPin) {
      onSelectPin(pin.id);
    }
  };

  return (
    <div className="reference-timeline-bar">
      {/* 1. Play / Pause Button */}
      <button 
        className="timeline-play-btn" 
        onClick={onPlayPause}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" />}
      </button>

      {/* 2. Scrubbable Track & Waveform */}
      <div className="timeline-track-wrapper">
        {/* Waveform SVG */}
        <div className="waveform-svg-container">
          <svg viewBox="0 0 1000 48" preserveAspectRatio="none" className="waveform-svg">
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d={waveformPath} fill="none" stroke="#00d4ff" strokeWidth="2" />
          </svg>
        </div>

        {/* Milestone Event Pins */}
        <div className="timeline-pins-layer">
          {MILESTONE_PINS.map((pin) => (
            <div
              key={pin.id}
              className="milestone-pin-marker"
              style={{ left: `${pin.position}%` }}
              onClick={() => handlePinClick(pin)}
              title={pin.label}
            >
              <div 
                className="pin-head" 
                style={{ backgroundColor: pin.color, borderColor: pin.color }}
              >
                {pin.hasAiTag && <span className="ai-tag-inside">AI</span>}
              </div>
              <div className="pin-stem" style={{ backgroundColor: pin.color }} />
            </div>
          ))}
        </div>

        {/* Active Progress Needle */}
        <div 
          className="timeline-cursor-needle"
          style={{ left: `${progress}%` }}
        />

        {/* Hidden Range Input for Scrubbing */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={progress}
          onChange={handleSliderChange}
          className="timeline-scrub-input"
        />

        {/* Baseline Axis with Tick Marks */}
        <div className="timeline-axis-line" />

        {/* Date Labels along the bottom */}
        <div className="timeline-dates-row">
          {TIMELINE_TICKS.map((tick, i) => (
            <span key={i} className="timeline-date-item">
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}