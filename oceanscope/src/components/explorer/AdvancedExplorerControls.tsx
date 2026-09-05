import type { OceanParameter } from '../../types/oceanData';
import { Play, Pause, ChevronDown } from 'lucide-react';
import './AdvancedExplorerControls.css';

interface AdvancedExplorerControlsProps {
  parameter: OceanParameter;
  depth: number;
  time: Date;
  isPlaying: boolean;
  showArgo: boolean;
  showGliders: boolean;
  showCurrents?: boolean;
  showModelObservation?: boolean;
  verticalExaggeration?: number;
  onParameterChange: (param: OceanParameter) => void;
  onDepthChange: (depth: number) => void;
  onTimeChange?: (time: Date) => void;
  onPlayPause: () => void;
  onToggleArgo: () => void;
  onToggleGliders: () => void;
  onToggleCurrents?: () => void;
  onToggleModelObservation?: () => void;
  onVerticalExaggerationChange?: (val: number) => void;
}


const PARAMETER_CONFIG: Record<OceanParameter, {
  name: string;
  unit: string;
  min: string;
  mid1: string;
  mid2: string;
  max: string;
  gradient: string;
}> = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    min: '2°C',
    mid1: '12°C',
    mid2: '28°C',
    max: '32°C',
    gradient: 'linear-gradient(90deg, #0050b3 0%, #13c2c2 30%, #fa8c16 75%, #f5222d 100%)'
  },
  salinity: {
    name: 'Salinity',
    unit: 'PSU',
    min: '30 PSU',
    mid1: '33 PSU',
    mid2: '35 PSU',
    max: '37 PSU',
    gradient: 'linear-gradient(90deg, #135200 0%, #52c41a 30%, #13c2c2 65%, #003a8c 100%)'
  },
  chlorophyll: {
    name: 'Chlorophyll',
    unit: 'mg/m³',
    min: '0.1',
    mid1: '0.8',
    mid2: '2.5',
    max: '8.0',
    gradient: 'linear-gradient(90deg, #002329 0%, #08979c 35%, #52c41a 70%, #d4b106 100%)'
  },
  currentSpeed: {
    name: 'Current Velocity',
    unit: 'm/s',
    min: '0.0',
    mid1: '0.5',
    mid2: '1.2',
    max: '2.5',
    gradient: 'linear-gradient(90deg, #120338 0%, #722ed1 40%, #fa8c16 80%, #f5222d 100%)'
  },
  waveHeight: {
    name: 'Wave Height',
    unit: 'm',
    min: '0.5m',
    mid1: '1.5m',
    mid2: '3.0m',
    max: '6.0m',
    gradient: 'linear-gradient(90deg, #061178 0%, #2f54eb 45%, #faad14 85%, #d4380d 100%)'
  },
  dissolvedOxygen: {
    name: 'Dissolved Oxygen',
    unit: 'ml/L',
    min: '1.5',
    mid1: '3.5',
    mid2: '5.0',
    max: '7.5',
    gradient: 'linear-gradient(90deg, #5c0011 0%, #d4380d 30%, #13c2c2 70%, #0050b3 100%)'
  }
};

const DAY_TICKS = ['25', '27', '30', 'Day', '1', '12', '13'];

export default function AdvancedExplorerControls({
  parameter,
  depth,
  isPlaying,
  showArgo,
  showGliders,
  showModelObservation = true,
  onParameterChange,
  onDepthChange,
  onPlayPause,
  onToggleArgo,
  onToggleGliders,
  onToggleModelObservation
}: AdvancedExplorerControlsProps) {
  const currentParam = PARAMETER_CONFIG[parameter] || PARAMETER_CONFIG.temperature;

  // Percentage for depth slider position (0 to 3000m)
  const depthPercentage = Math.min(100, Math.max(0, (depth / 3000) * 100));

  return (
    <div className="reference-controls-panel">
      {/* 1. Variable Selector Dropdown */}
      <div className="param-dropdown-container">
        <div className="variable-selector-wrapper">
          <select
            value={parameter}
            onChange={(e) => onParameterChange(e.target.value as OceanParameter)}
            className="variable-select"
          >
            {Object.keys(PARAMETER_CONFIG).map((pKey) => (
              <option key={pKey} value={pKey}>
                Variable: {PARAMETER_CONFIG[pKey as OceanParameter].name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="dropdown-arrow-icon" />
        </div>
      </div>

      {/* 2. Depth Slider Section */}
      <div className="depth-slider-block">
        <div className="control-block-title">Depth Slider</div>
        <div className="depth-vertical-track-wrapper">
          <div className="depth-track-labels">
            <div className="depth-tick-row">
              <span className="tick-val">0m</span>
              <span className="tick-dash">—</span>
            </div>
            <div className="depth-tick-row">
              <span className="tick-val">1000m</span>
              <span className="tick-dash">—</span>
            </div>
            <div className="depth-tick-row">
              <span className="tick-val">2000m</span>
              <span className="tick-dash">—</span>
            </div>
            <div className="depth-tick-row">
              <span className="tick-val">3000m</span>
              <span className="tick-dash">—</span>
            </div>
          </div>

          <div className="vertical-slider-bar-container">
            <div className="vertical-bar-background" />
            <div 
              className="vertical-bar-filled" 
              style={{ height: `${depthPercentage}%` }} 
            />
            <div 
              className="vertical-slider-thumb-pill"
              style={{ top: `${depthPercentage}%` }}
            >
              <div className="thumb-circle" />
              <span className="thumb-label">Depth Slider ({depth}m)</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={depth}
              onChange={(e) => onDepthChange(Number(e.target.value))}
              className="invisible-vertical-slider"
            />
          </div>
        </div>
      </div>

      {/* 3. Time Slider Section */}
      <div className="time-slider-block">
        <div className="time-slider-header">
          <span className="control-block-title">Time Slider</span>
          <button 
            className="time-play-pause-btn"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>

        <div className="time-track-container">
          <input
            type="range"
            min="0"
            max="6"
            defaultValue="2"
            className="horizontal-time-slider"
          />
          <div className="time-day-ticks">
            {DAY_TICKS.map((tick, i) => (
              <span key={i} className={`day-tick ${i === 3 ? 'day-label' : ''}`}>
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Toggles Section */}
      <div className="toggles-block">
        {/* Model / Observation */}
        <div className="toggle-row">
          <span className="toggle-title">Model / Observation</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={showModelObservation}
              onChange={onToggleModelObservation}
            />
            <span className="slider round" />
          </label>
        </div>

        {/* Argo Floats */}
        <div className="toggle-row">
          <div className="toggle-label-with-icon">
            <span className="argo-diamond-icon">◆</span>
            <span className="toggle-title">Argo Floats</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={showArgo}
              onChange={onToggleArgo}
            />
            <span className="slider round" />
          </label>
        </div>

        {/* Gliders */}
        <div className="toggle-row">
          <div className="toggle-label-with-icon">
            <span className="glider-triangle-icon">▲</span>
            <span className="toggle-title">Gliders</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={showGliders}
              onChange={onToggleGliders}
            />
            <span className="slider round" />
          </label>
        </div>
      </div>

      {/* 5. Color Scale Controls */}
      <div className="color-scale-block">
        <div className="control-block-title">Color Scale Controls</div>
        <div 
          className="color-gradient-bar"
          style={{ background: currentParam.gradient }}
        />
        <div className="scale-limits-row">
          <span>{currentParam.min}</span>
          <span>{currentParam.mid1}</span>
          <span>{currentParam.mid2}</span>
          <span>{currentParam.max}</span>
        </div>
        <div className="color-param-title">{currentParam.name}</div>
      </div>
    </div>
  );
}