import { useState, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import './Timeline.css';

interface TimelineProps {
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function Timeline({ currentTime, onTimeChange, isPlaying, onPlayPause }: TimelineProps) {
  const [timelineProgress, setTimelineProgress] = useState(50);

  // Generate timeline dates
  const timelineDates = useMemo(() => [
    { date: '18 Jan', fullDate: '2024-01-18' },
    { date: '20 May', fullDate: '2024-05-20' },
    { date: '22 May', fullDate: '2024-05-22' },
    { date: '01 Nov', fullDate: '2024-11-01' },
    { date: '15 Dec', fullDate: '2024-12-15' }
  ], []);

  // Generate time-series data points
  const timeSeriesData = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      value: 20 + Math.sin(i * 0.2) * 10 + Math.random() * 5,
      position: (i / 49) * 100
    }));
  }, []);

  // Generate observation markers
  const observationMarkers = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      position: 10 + i * 16,
      value: Math.floor(Math.random() * 50) + 20,
      type: i % 2 === 0 ? 'normal' : 'anomaly'
    }));
  }, []);

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = Number(e.target.value);
    setTimelineProgress(progress);
    
    // Calculate new date based on progress
    const daysToAdd = Math.floor((progress / 100) * 365);
    const newDate = new Date(currentTime.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    onTimeChange(newDate);
  };

  const handleSkip = (direction: 'back' | 'forward') => {
    const days = direction === 'back' ? -7 : 7;
    const newDate = new Date(currentTime.getTime() + days * 24 * 60 * 60 * 1000);
    onTimeChange(newDate);
  };

  return (
    <div className="timeline-container glass-panel">
      <div className="timeline-controls">
        <button className="timeline-btn" onClick={() => handleSkip('back')} title="Skip back">
          <SkipBack />
        </button>
        <button 
          className={`timeline-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button className="timeline-btn" onClick={() => handleSkip('forward')} title="Skip forward">
          <SkipForward />
        </button>
      </div>

      <div className="timeline-track">
        {/* Time-series graph */}
        <div className="time-series-graph">
          <svg className="graph-svg" viewBox="0 0 400 60" preserveAspectRatio="none">
            <path
              d={timeSeriesData.map((d, i) => {
                const x = (d.position / 100) * 400;
                const y = 60 - ((d.value - 10) / 25) * 60;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="rgba(0, 212, 255, 0.5)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Observation markers */}
        <div className="observation-markers">
          {observationMarkers.map((marker, i) => (
            <div
              key={i}
              className={`observation-marker ${marker.type}`}
              style={{ left: `${marker.position}%` }}
              title={`Observation: ${marker.value}`}
            >
              <span className="marker-value">{marker.value}</span>
            </div>
          ))}
        </div>

        {/* Timeline slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={timelineProgress}
          onChange={handleTimelineChange}
          className="timeline-slider"
        />

        {/* Date markers */}
        <div className="timeline-dates">
          {timelineDates.map((date, i) => (
            <div 
              key={i} 
              className="timeline-date"
              style={{ left: `${(i / (timelineDates.length - 1)) * 100}%` }}
            >
              {date.date}
            </div>
          ))}
        </div>

        {/* Current position marker */}
        <div 
          className="timeline-marker"
          style={{ left: `${timelineProgress}%` }}
        />
      </div>

      <div className="timeline-info">
        <span className="timeline-label">Current Time:</span>
        <span className="timeline-value">
          {currentTime.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
}