import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import './Timeline.css';

interface TimelineProps {
  dates: Date[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onPlayPause?: () => void;
  isPlaying?: boolean;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

export default function Timeline({
  dates,
  currentIndex,
  onIndexChange,
  onPlayPause,
  isPlaying = false,
  playbackSpeed = 1,
  onSpeedChange
}: TimelineProps) {
  const [speed, setSpeed] = useState(playbackSpeed);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (onSpeedChange) onSpeedChange(newSpeed);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const progress = ((currentIndex + 1) / dates.length) * 100;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="timeline-title">
          <Clock className="timeline-icon" />
          <span>Timeline</span>
        </div>
        <div className="current-date">
          {formatDate(dates[currentIndex])}
        </div>
      </div>

      <div className="timeline-controls">
        <button
          className="timeline-btn"
          onClick={() => onIndexChange(0)}
          title="Go to start"
        >
          <SkipBack />
        </button>

        <button
          className="timeline-btn play-btn"
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <button
          className="timeline-btn"
          onClick={() => onIndexChange(dates.length - 1)}
          title="Go to end"
        >
          <SkipForward />
        </button>

        <div className="speed-control">
          <span className="speed-label">Speed:</span>
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => handleSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-slider-container">
        <input
          type="range"
          min="0"
          max={dates.length - 1}
          value={currentIndex}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="timeline-slider"
        />
        <div className="timeline-progress" style={{ width: `${progress}%` }} />
      </div>

      <div className="timeline-dates">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`timeline-date ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onIndexChange(index)}
          >
            {formatDate(date)}
          </div>
        ))}
      </div>
    </div>
  );
}