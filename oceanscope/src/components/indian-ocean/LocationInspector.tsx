import { MapPin, Thermometer, Activity } from 'lucide-react';
import './LocationInspector.css';

interface LocationInspectorProps {
  location?: {
    latitude: number;
    longitude: number;
  };
  variable?: string;
  value?: number;
  unit?: string;
  onClose?: () => void;
}

export default function LocationInspector({
  location,
  variable = 'Sea Surface Temperature',
  value,
  unit = '°C',
  onClose
}: LocationInspectorProps) {
  if (!location) return null;

  return (
    <div className="location-inspector">
      <div className="inspector-header">
        <div className="inspector-title">
          <MapPin className="inspector-icon" />
          <span>Location</span>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <div className="inspector-content">
        <div className="location-coords">
          <div className="coord-item">
            <span className="coord-label">Latitude</span>
            <span className="coord-value">{location.latitude.toFixed(2)}° N</span>
          </div>
          <div className="coord-item">
            <span className="coord-label">Longitude</span>
            <span className="coord-value">{location.longitude.toFixed(2)}° E</span>
          </div>
        </div>

        <div className="divider" />

        <div className="variable-section">
          <div className="variable-header">
            <Activity className="variable-icon" />
            <span className="variable-label">Variable</span>
          </div>
          <div className="variable-name">{variable}</div>
        </div>

        <div className="divider" />

        <div className="value-section">
          <div className="value-header">
            <Thermometer className="value-icon" />
            <span className="value-label">Value</span>
          </div>
          <div className="value-display">
            {value !== undefined ? value.toFixed(2) : 'Demo value'}
            <span className="value-unit">{unit}</span>
          </div>
          <div className="value-note">
            {value !== undefined ? 'Actual dataset value' : 'Demo mock data'}
          </div>
        </div>
      </div>
    </div>
  );
}
