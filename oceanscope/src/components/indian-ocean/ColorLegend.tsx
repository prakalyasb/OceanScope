import { useState } from 'react';
import { Palette, Minus, Plus } from 'lucide-react';
import './ColorLegend.css';

interface ColorLegendProps {
  variable: string;
  minValue: number;
  maxValue: number;
  colors: string[];
  onMinChange?: (value: number) => void;
  onMaxChange?: (value: number) => void;
}

export default function ColorLegend({
  variable,
  minValue,
  maxValue,
  colors,
  onMinChange,
  onMaxChange
}: ColorLegendProps) {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);

  const handleMinChange = (value: number) => {
    setMin(value);
    if (onMinChange) onMinChange(value);
  };

  const handleMaxChange = (value: number) => {
    setMax(value);
    if (onMaxChange) onMaxChange(value);
  };

  return (
    <div className="color-legend">
      <div className="legend-header">
        <Palette className="legend-icon" />
        <span className="legend-title">Color Scale</span>
      </div>

      <div className="legend-gradient">
        <div
          className="gradient-bar"
          style={{
            background: `linear-gradient(90deg, ${colors.join(', ')})`
          }}
        />
      </div>

      <div className="legend-controls">
        <div className="range-control">
          <span className="range-label">Min</span>
          <div className="range-input-group">
            <button
              className="range-btn"
              onClick={() => handleMinChange(min - 1)}
            >
              <Minus />
            </button>
            <input
              type="number"
              value={min}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="range-input"
              step="0.1"
            />
            <button
              className="range-btn"
              onClick={() => handleMinChange(min + 1)}
            >
              <Plus />
            </button>
          </div>
        </div>

        <div className="range-control">
          <span className="range-label">Max</span>
          <div className="range-input-group">
            <button
              className="range-btn"
              onClick={() => handleMaxChange(max - 1)}
            >
              <Minus />
            </button>
            <input
              type="number"
              value={max}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="range-input"
              step="0.1"
            />
            <button
              className="range-btn"
              onClick={() => handleMaxChange(max + 1)}
            >
              <Plus />
            </button>
          </div>
        </div>
      </div>

      <div className="legend-variable">
        <span className="variable-label">Variable</span>
        <span className="variable-name">{variable}</span>
      </div>
    </div>
  );
}
