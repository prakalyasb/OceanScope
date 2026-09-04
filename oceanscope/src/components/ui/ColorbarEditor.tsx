import { useState } from 'react';
import { Sliders, Palette, Minus, Plus, RotateCcw } from 'lucide-react';
import './ColorbarEditor.css';

export interface ColorbarConfig {
  colorMap: string;
  min: number;
  max: number;
  scale: 'linear' | 'log';
  opacity: number;
  palette: string[];
}

interface ColorbarEditorProps {
  config: ColorbarConfig;
  onChange: (config: ColorbarConfig) => void;
  availableColorMaps: string[];
}

const DEFAULT_PALETTES: Record<string, string[]> = {
  temperature: ['#0066cc', '#00d4ff', '#2dd4bf', '#fbbf24', '#ff6b6b'],
  salinity: ['#1e3a5f', '#00d4ff', '#2dd4bf', '#4ade80', '#a3e635'],
  chlorophyll: ['#134e4a', '#0d9488', '#14b8a6', '#2dd4bf', '#00d4ff'],
  currentSpeed: ['#1e1b4b', '#4c1d95', '#7c3aed', '#a78bfa', '#c4b5fd'],
  waveHeight: ['#7c2d12', '#ea580c', '#f97316', '#fbbf24', '#fef08a'],
  dissolvedOxygen: ['#3f6212', '#65a30d', '#84cc16', '#a3e635', '#bef264']
};

export default function ColorbarEditor({ config, onChange, availableColorMaps }: ColorbarEditorProps) {
  const [customMin, setCustomMin] = useState(config.min);
  const [customMax, setCustomMax] = useState(config.max);
  const [customOpacity, setCustomOpacity] = useState(config.opacity);
  
  const handleColorMapChange = (colorMap: string) => {
    const newPalette = DEFAULT_PALETTES[colorMap] || config.palette;
    onChange({
      ...config,
      colorMap,
      palette: newPalette
    });
  };
  
  const handleRangeChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setCustomMin(value);
      onChange({ ...config, min: value });
    } else {
      setCustomMax(value);
      onChange({ ...config, max: value });
    }
  };
  
  const handleOpacityChange = (value: number) => {
    setCustomOpacity(value);
    onChange({ ...config, opacity: value });
  };
  
  const handleReset = () => {
    const defaultPalette = DEFAULT_PALETTES[config.colorMap] || config.palette;
    onChange({
      ...config,
      min: 0,
      max: 100,
      scale: 'linear',
      opacity: 0.8,
      palette: defaultPalette
    });
    setCustomMin(0);
    setCustomMax(100);
    setCustomOpacity(0.8);
  };
  
  const currentPalette = DEFAULT_PALETTES[config.colorMap] || config.palette;
  
  return (
    <div className="colorbar-editor">
      <div className="editor-header">
        <div className="editor-title">
          <Palette className="editor-icon" />
          <span>Colorbar Editor</span>
        </div>
        <button className="reset-btn" onClick={handleReset} title="Reset to defaults">
          <RotateCcw />
        </button>
      </div>
      
      {/* Color Map Selector */}
      <div className="editor-section">
        <label className="editor-label">Color Map</label>
        <select
          value={config.colorMap}
          onChange={(e) => handleColorMapChange(e.target.value)}
          className="editor-select"
        >
          {availableColorMaps.map((map) => (
            <option key={map} value={map}>
              {map.charAt(0).toUpperCase() + map.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Color Palette Preview */}
      <div className="editor-section">
        <label className="editor-label">Palette Preview</label>
        <div className="palette-preview">
          {currentPalette.map((color, i) => (
            <div
              key={i}
              className="palette-color"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      {/* Range Controls */}
      <div className="editor-section">
        <label className="editor-label">Value Range</label>
        <div className="range-controls">
          <div className="range-input">
            <span className="range-label">Min</span>
            <div className="range-value-control">
              <input
                type="number"
                value={customMin}
                onChange={(e) => handleRangeChange('min', Number(e.target.value))}
                className="range-number"
                step="0.1"
              />
              <button
                className="range-adjust"
                onClick={() => handleRangeChange('min', customMin - 1)}
              >
                <Minus />
              </button>
              <button
                className="range-adjust"
                onClick={() => handleRangeChange('min', customMin + 1)}
              >
                <Plus />
              </button>
            </div>
          </div>
          
          <div className="range-input">
            <span className="range-label">Max</span>
            <div className="range-value-control">
              <input
                type="number"
                value={customMax}
                onChange={(e) => handleRangeChange('max', Number(e.target.value))}
                className="range-number"
                step="0.1"
              />
              <button
                className="range-adjust"
                onClick={() => handleRangeChange('max', customMax - 1)}
              >
                <Minus />
              </button>
              <button
                className="range-adjust"
                onClick={() => handleRangeChange('max', customMax + 1)}
              >
                <Plus />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scale Toggle */}
      <div className="editor-section">
        <label className="editor-label">Scale Type</label>
        <div className="scale-toggle">
          <button
            className={`scale-btn ${config.scale === 'linear' ? 'active' : ''}`}
            onClick={() => onChange({ ...config, scale: 'linear' })}
          >
            Linear
          </button>
          <button
            className={`scale-btn ${config.scale === 'log' ? 'active' : ''}`}
            onClick={() => onChange({ ...config, scale: 'log' })}
          >
            Logarithmic
          </button>
        </div>
      </div>
      
      {/* Opacity Control */}
      <div className="editor-section">
        <label className="editor-label">
          <Sliders className="editor-icon" />
          Layer Opacity
        </label>
        <div className="opacity-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={customOpacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="opacity-slider"
          />
          <span className="opacity-value">{Math.round(customOpacity * 100)}%</span>
        </div>
      </div>
      
      {/* Gradient Preview */}
      <div className="editor-section">
        <label className="editor-label">Gradient Preview</label>
        <div className="gradient-preview">
          <div
            className="gradient-bar"
            style={{
              background: `linear-gradient(90deg, ${currentPalette.join(', ')})`,
              opacity: customOpacity
            }}
          />
          <div className="gradient-labels">
            <span>{customMin.toFixed(1)}</span>
            <span>{customMax.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}