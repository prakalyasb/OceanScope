import type { OceanParameter, VisualizationMode } from '../../types/oceanData';
import { parameterMetadata } from '../../data/mockData';
import { Play, Pause, RotateCcw, Layers, Activity, ChevronDown } from 'lucide-react';
import './OceanControls.css';

interface OceanControlsProps {
  parameter: OceanParameter;
  depth: number;
  time: Date;
  visualizationMode: VisualizationMode;
  showObservationPoints: boolean;
  isPlaying: boolean;
  showArgo: boolean;
  showGliders: boolean;
  onParameterChange: (param: OceanParameter) => void;
  onDepthChange: (depth: number) => void;
  onTimeChange: (time: Date) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onToggleObservationPoints: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleArgo: () => void;
  onToggleGliders: () => void;
}

const parameters: OceanParameter[] = ['temperature', 'salinity', 'chlorophyll', 'currentSpeed', 'waveHeight', 'dissolvedOxygen'];

export default function OceanControls({
  parameter,
  depth,
  time,
  visualizationMode,
  showObservationPoints,
  isPlaying,
  showArgo,
  showGliders,
  onParameterChange,
  onDepthChange,
  onTimeChange,
  onVisualizationModeChange,
  onToggleObservationPoints,
  onPlayPause,
  onReset,
  onToggleArgo,
  onToggleGliders
}: OceanControlsProps) {
  // Suppress unused parameter warnings
  void visualizationMode;
  void onVisualizationModeChange;

  const getGradientColors = () => {
    switch (parameter) {
      case 'temperature':
        return ['#0066cc', '#00d4ff', '#2dd4bf', '#fbbf24', '#ff6b6b'];
      case 'salinity':
        return ['#1e3a5f', '#00d4ff', '#2dd4bf', '#4ade80', '#a3e635'];
      case 'chlorophyll':
        return ['#134e4a', '#0d9488', '#14b8a6', '#2dd4bf', '#00d4ff'];
      case 'currentSpeed':
        return ['#1e1b4b', '#4c1d95', '#7c3aed', '#a78bfa', '#c4b5fd'];
      case 'waveHeight':
        return ['#7c2d12', '#ea580c', '#f97316', '#fbbf24', '#fef08a'];
      case 'dissolvedOxygen':
        return ['#3f6212', '#65a30d', '#84cc16', '#a3e635', '#bef264'];
      default:
        return ['#0066cc', '#00d4ff', '#2dd4bf', '#fbbf24', '#ff6b6b'];
    }
  };

  const gradientColors = getGradientColors();
  const range = parameterMetadata[parameter].range;

  return (
    <div className="ocean-controls glass-panel">
      {/* Variable Selector */}
      <div className="control-section">
        <div className="control-label">Variable</div>
        <div className="custom-select">
          <select
            value={parameter}
            onChange={(e) => onParameterChange(e.target.value as OceanParameter)}
            className="select-input"
          >
            {parameters.map((param) => (
              <option key={param} value={param}>
                {parameterMetadata[param].name}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" />
        </div>
      </div>

      {/* Depth Slider (Vertical) */}
      <div className="control-section depth-section">
        <div className="control-label">Depth Slider</div>
        <div className="depth-slider-container">
          <div className="depth-value">{depth}m</div>
          <input
            type="range"
            min="0"
            max="3000"
            value={depth}
            onChange={(e) => onDepthChange(Number(e.target.value))}
            className="depth-slider vertical"
          />
          <div className="depth-labels">
            <span>0m</span>
            <span>3000m</span>
          </div>
        </div>
      </div>

      {/* Time Control */}
      <div className="control-section">
        <div className="control-label">Time</div>
        <div className="time-control">
          <input
            type="datetime-local"
            value={time.toISOString().slice(0, 16)}
            onChange={(e) => onTimeChange(new Date(e.target.value))}
            className="time-input"
          />
          <button
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>

      {/* Toggle Switches */}
      <div className="control-section">
        <div className="control-label">Data Sources</div>
        <div className="toggle-group">
          <button
            className={`toggle-switch ${showObservationPoints ? 'active' : ''}`}
            onClick={onToggleObservationPoints}
          >
            <Activity />
            <span>Model / Observation</span>
          </button>
          <button
            className={`toggle-switch ${showArgo ? 'active' : ''}`}
            onClick={onToggleArgo}
          >
            <Layers />
            <span>Argo Floats</span>
          </button>
          <button
            className={`toggle-switch ${showGliders ? 'active' : ''}`}
            onClick={onToggleGliders}
          >
            <Layers />
            <span>Gliders</span>
          </button>
        </div>
      </div>

      {/* Color Scale */}
      <div className="control-section">
        <div className="control-label">Color Scale</div>
        <div className="color-scale">
          <div 
            className="color-gradient" 
            style={{
              background: `linear-gradient(90deg, ${gradientColors.join(', ')})`
            }}
          />
          <div className="color-labels">
            <span>{range.min}</span>
            <span>{range.max}</span>
          </div>
          <div className="color-parameter">{parameterMetadata[parameter].name}</div>
        </div>
      </div>

      {/* Reset */}
      <div className="control-section">
        <button className="reset-btn" onClick={onReset}>
          <RotateCcw />
          Reset View
        </button>
      </div>
    </div>
  );
}