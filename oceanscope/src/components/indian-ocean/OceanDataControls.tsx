import { useState } from 'react';
import { Layers, Sliders, Thermometer, Droplets, Waves, Activity, RotateCcw, Maximize2, Mountain, Grid } from 'lucide-react';
import './OceanDataControls.css';

interface OceanDataControlsProps {
  selectedVariable: string;
  onVariableChange: (variable: string) => void;
  layerOpacity: number;
  onOpacityChange: (opacity: number) => void;
  showLayer: boolean;
  onLayerToggle: (show: boolean) => void;
  onResetCamera: () => void;
  onFullscreen: () => void;
  depth?: number;
  onDepthChange?: (depth: number) => void;
  verticalExaggeration?: number;
  onVerticalExaggerationChange?: (value: number) => void;
  showCurrents?: boolean;
  onToggleCurrents?: (show: boolean) => void;
  showMarkers?: boolean;
  onToggleMarkers?: (show: boolean) => void;
  showGrid?: boolean;
  onToggleGrid?: (show: boolean) => void;
  showModelObservation?: boolean;
  onToggleModelObservation?: (show: boolean) => void;
  showArgoFloats?: boolean;
  onToggleArgoFloats?: (show: boolean) => void;
  showGliders?: boolean;
  onToggleGliders?: (show: boolean) => void;
}

const VARIABLES = [
  { id: 'sst', name: 'Sea Surface Temperature', icon: Thermometer, unit: '°C' },
  { id: 'salinity', name: 'Salinity', icon: Droplets, unit: 'PSU' },
  { id: 'currents', name: 'Ocean Currents', icon: Waves, unit: 'm/s' },
  { id: 'waves', name: 'Wave Height', icon: Activity, unit: 'm' },
  { id: 'chlorophyll', name: 'Chlorophyll', icon: Layers, unit: 'mg/m³' },
  { id: 'sealevel', name: 'Sea Level', icon: Activity, unit: 'm' },
  { id: 'bathymetry', name: 'Bathymetry', icon: Layers, unit: 'm' }
];

export default function OceanDataControls({
  selectedVariable,
  onVariableChange,
  layerOpacity,
  onOpacityChange,
  showLayer,
  onLayerToggle,
  onResetCamera,
  onFullscreen,
  depth = 100,
  onDepthChange,
  verticalExaggeration = 5,
  onVerticalExaggerationChange,
  showCurrents = false,
  onToggleCurrents,
  showMarkers = true,
  onToggleMarkers,
  showGrid = true,
  onToggleGrid,
  showModelObservation = true,
  onToggleModelObservation,
  showArgoFloats = true,
  onToggleArgoFloats,
  showGliders = false,
  onToggleGliders
}: OceanDataControlsProps) {
  const [expanded, setExpanded] = useState(true);

  const selectedVar = VARIABLES.find(v => v.id === selectedVariable) || VARIABLES[0];
  const Icon = selectedVar.icon;

  return (
    <div className="ocean-data-controls">
      <div className="controls-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-title">
          <Layers className="header-icon" />
          <span>Data Controls</span>
        </div>
        <div className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</div>
      </div>

      {expanded && (
        <div className="controls-content">
          {/* Variable Selector */}
          <div className="control-section">
            <label className="control-label">Dataset Variable</label>
            <select
              value={selectedVariable}
              onChange={(e) => onVariableChange(e.target.value)}
              className="control-select"
            >
              {VARIABLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layer Visibility */}
          <div className="control-section">
            <label className="control-label">
              <Layers className="label-icon" />
              Layer Visibility
            </label>
            <button
              className={`toggle-btn ${showLayer ? 'active' : ''}`}
              onClick={() => onLayerToggle(!showLayer)}
            >
              {showLayer ? 'Visible' : 'Hidden'}
            </button>
          </div>

          {/* Depth Slider */}
          {onDepthChange && (
            <div className="control-section">
              <label className="control-label">
                <Mountain className="label-icon" />
                Depth
              </label>
              <div className="opacity-control">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={depth}
                  onChange={(e) => onDepthChange(Number(e.target.value))}
                  className="opacity-slider"
                />
                <span className="opacity-value">{depth}m</span>
              </div>
            </div>
          )}

          {/* Vertical Exaggeration */}
          {onVerticalExaggerationChange && (
            <div className="control-section">
              <label className="control-label">
                <Mountain className="label-icon" />
                Vertical Exaggeration
              </label>
              <div className="opacity-control">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={verticalExaggeration}
                  onChange={(e) => onVerticalExaggerationChange(Number(e.target.value))}
                  className="opacity-slider"
                />
                <span className="opacity-value">{verticalExaggeration}x</span>
              </div>
            </div>
          )}

          {/* Current Vectors */}
          {onToggleCurrents && (
            <div className="control-section">
              <label className="control-label">
                <Waves className="label-icon" />
                Current Vectors
              </label>
              <button
                className={`toggle-btn ${showCurrents ? 'active' : ''}`}
                onClick={() => onToggleCurrents(!showCurrents)}
              >
                {showCurrents ? 'Visible' : 'Hidden'}
              </button>
            </div>
          )}

          {/* Observation Markers */}
          {onToggleMarkers && (
            <div className="control-section">
              <label className="control-label">
                <Activity className="label-icon" />
                Observation Markers
              </label>
              <button
                className={`toggle-btn ${showMarkers ? 'active' : ''}`}
                onClick={() => onToggleMarkers(!showMarkers)}
              >
                {showMarkers ? 'Visible' : 'Hidden'}
              </button>
            </div>
          )}

          {/* Grid Lines */}
          {onToggleGrid && (
            <div className="control-section">
              <label className="control-label">
                <Grid className="label-icon" />
                Grid Lines
              </label>
              <button
                className={`toggle-btn ${showGrid ? 'active' : ''}`}
                onClick={() => onToggleGrid(!showGrid)}
              >
                {showGrid ? 'Visible' : 'Hidden'}
              </button>
            </div>
          )}

          {/* Model / Observation */}
          {onToggleModelObservation && (
            <div className="control-section">
              <label className="control-label">
                <Activity className="label-icon" />
                Model / Observation
              </label>
              <button
                className={`toggle-btn ${showModelObservation ? 'active' : ''}`}
                onClick={() => onToggleModelObservation(!showModelObservation)}
              >
                {showModelObservation ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* Argo Floats */}
          {onToggleArgoFloats && (
            <div className="control-section">
              <label className="control-label">
                <Activity className="label-icon" />
                Argo Floats
              </label>
              <button
                className={`toggle-btn ${showArgoFloats ? 'active' : ''}`}
                onClick={() => onToggleArgoFloats(!showArgoFloats)}
              >
                {showArgoFloats ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* Gliders */}
          {onToggleGliders && (
            <div className="control-section">
              <label className="control-label">
                <Activity className="label-icon" />
                Gliders
              </label>
              <button
                className={`toggle-btn ${showGliders ? 'active' : ''}`}
                onClick={() => onToggleGliders(!showGliders)}
              >
                {showGliders ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* Opacity Control */}
          <div className="control-section">
            <label className="control-label">
              <Sliders className="label-icon" />
              Layer Opacity
            </label>
            <div className="opacity-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
                className="opacity-slider"
              />
              <span className="opacity-value">{Math.round(layerOpacity * 100)}%</span>
            </div>
          </div>

          {/* Current Variable Info */}
          <div className="control-section">
            <div className="variable-info">
              <Icon className="variable-info-icon" />
              <div className="variable-info-text">
                <div className="variable-info-name">{selectedVar.name}</div>
                <div className="variable-info-unit">Unit: {selectedVar.unit}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="control-section actions">
            <button className="action-btn" onClick={onResetCamera}>
              <RotateCcw className="btn-icon" />
              Reset Camera
            </button>
            <button className="action-btn" onClick={onFullscreen}>
              <Maximize2 className="btn-icon" />
              Fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
