import { useState } from 'react';
import type { OceanParameter } from '../../types/oceanData';
import { parameterMetadata } from '../../data/mockData';
import { Play, Pause, RotateCcw, Layers, Activity, ChevronDown, Mountain, Eye, EyeOff } from 'lucide-react';
import ColorbarEditor from '../ui/ColorbarEditor';
import type { ColorbarConfig } from '../ui/ColorbarEditor';
import './AdvancedExplorerControls.css';

interface AdvancedExplorerControlsProps {
  parameter: OceanParameter;
  depth: number;
  time: Date;
  isPlaying: boolean;
  showArgo: boolean;
  showGliders: boolean;
  showCurrents: boolean;
  showCTD: boolean;
  showBGC: boolean;
  verticalExaggeration: number;
  colorbarConfig: ColorbarConfig;
  onParameterChange: (param: OceanParameter) => void;
  onDepthChange: (depth: number) => void;
  onTimeChange: (time: Date) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleArgo: () => void;
  onToggleGliders: () => void;
  onToggleCurrents: () => void;
  onToggleCTD: () => void;
  onToggleBGC: () => void;
  onVerticalExaggerationChange: (value: number) => void;
  onColorbarConfigChange: (config: ColorbarConfig) => void;
}

const parameters: OceanParameter[] = ['temperature', 'salinity', 'chlorophyll', 'currentSpeed', 'waveHeight', 'dissolvedOxygen'];

export default function AdvancedExplorerControls({
  parameter,
  depth,
  time,
  isPlaying,
  showArgo,
  showGliders,
  showCurrents,
  showCTD,
  showBGC,
  verticalExaggeration,
  colorbarConfig,
  onParameterChange,
  onDepthChange,
  onTimeChange,
  onPlayPause,
  onReset,
  onToggleArgo,
  onToggleGliders,
  onToggleCurrents,
  onToggleCTD,
  onToggleBGC,
  onVerticalExaggerationChange,
  onColorbarConfigChange
}: AdvancedExplorerControlsProps) {
  const [showColorbarEditor, setShowColorbarEditor] = useState(false);
  
  return (
    <div className="advanced-explorer-controls glass-panel">
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
        <div className="control-label">Depth</div>
        <div className="depth-slider-container">
          <div className="depth-value">{depth}m</div>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
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

      {/* Vertical Exaggeration */}
      <div className="control-section">
        <div className="control-label">
          <Mountain className="label-icon" />
          Vertical Exaggeration
        </div>
        <div className="exaggeration-control">
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={verticalExaggeration}
            onChange={(e) => onVerticalExaggerationChange(Number(e.target.value))}
            className="exaggeration-slider"
          />
          <span className="exaggeration-value">{verticalExaggeration}x</span>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="control-section">
        <div className="control-label">
          <Layers className="label-icon" />
          Data Layers
        </div>
        <div className="layer-controls">
          <button
            className={`layer-toggle ${showArgo ? 'active' : ''}`}
            onClick={onToggleArgo}
          >
            <Activity />
            <span>Argo Floats</span>
            {showArgo ? <Eye /> : <EyeOff />}
          </button>
          <button
            className={`layer-toggle ${showGliders ? 'active' : ''}`}
            onClick={onToggleGliders}
          >
            <Activity />
            <span>Gliders</span>
            {showGliders ? <Eye /> : <EyeOff />}
          </button>
          <button
            className={`layer-toggle ${showCurrents ? 'active' : ''}`}
            onClick={onToggleCurrents}
          >
            <Activity />
            <span>Currents</span>
            {showCurrents ? <Eye /> : <EyeOff />}
          </button>
          <button
            className={`layer-toggle ${showCTD ? 'active' : ''}`}
            onClick={onToggleCTD}
          >
            <Activity />
            <span>CTD</span>
            {showCTD ? <Eye /> : <EyeOff />}
          </button>
          <button
            className={`layer-toggle ${showBGC ? 'active' : ''}`}
            onClick={onToggleBGC}
          >
            <Activity />
            <span>BGC</span>
            {showBGC ? <Eye /> : <EyeOff />}
          </button>
        </div>
      </div>

      {/* Colorbar Toggle */}
      <div className="control-section">
        <button
          className="expandable-toggle"
          onClick={() => setShowColorbarEditor(!showColorbarEditor)}
        >
          <Layers />
          <span>Colorbar Editor</span>
          <ChevronDown className={`toggle-icon ${showColorbarEditor ? 'open' : ''}`} />
        </button>
        
        {showColorbarEditor && (
          <ColorbarEditor
            config={colorbarConfig}
            onChange={onColorbarConfigChange}
            availableColorMaps={parameters}
          />
        )}
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