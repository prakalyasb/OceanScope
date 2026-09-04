import type { OceanParameter, OceanMeasurement } from '../../types/oceanData';
import { parameterMetadata } from '../../data/mockData';
import { Activity, MapPin, Clock, AlertTriangle, Thermometer, Waves } from 'lucide-react';
import './DataPanel.css';

interface DataPanelProps {
  parameter: OceanParameter;
  measurements: OceanMeasurement[];
  selectedPoint?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export default function DataPanel({ parameter, measurements, selectedPoint }: DataPanelProps) {
  const latestMeasurement = measurements[measurements.length - 1];
  
  // Simulate model vs observation data
  const modelValue = (latestMeasurement?.value || 0) + (Math.random() - 0.5) * 2.5;
  const observedValue = latestMeasurement?.value || 0;
  const difference = observedValue - modelValue;
  const isAnomaly = Math.abs(difference) > 1.5;

  const stats = {
    model: modelValue.toFixed(1),
    observed: observedValue.toFixed(1),
    difference: (difference > 0 ? '+' : '') + difference.toFixed(1),
    unit: parameterMetadata[parameter].unit
  };

  // Generate temperature profile data
  const profileData = measurements.slice(0, 12).map((m) => ({
    depth: m.depth,
    model: m.value + (Math.random() - 0.5) * 2,
    observed: m.value
  }));

  const maxDepth = Math.max(...profileData.map(d => d.depth));
  const maxTemp = Math.max(...profileData.map(d => Math.max(d.model, d.observed)));
  const minTemp = Math.min(...profileData.map(d => Math.min(d.model, d.observed)));
  const tempRange = maxTemp - minTemp || 1;

  // Anomaly depth range
  const anomalyDepth = profileData.find(d => Math.abs(d.model - d.observed) > 1.5);

  return (
    <div className="data-panel glass-panel">
      <div className="panel-header">
        <div className="panel-title">Ocean Insight</div>
        {selectedPoint && (
          <div className="point-identifier">
            <Activity className="point-icon" />
            <span>{selectedPoint.name}</span>
          </div>
        )}
      </div>

      {/* Model vs Observation */}
      <div className="comparison-section">
        <div className="comparison-row">
          <span className="comparison-label">Model {parameterMetadata[parameter].name}:</span>
          <span className="comparison-value model">{stats.model} {stats.unit}</span>
        </div>
        <div className="comparison-row">
          <span className="comparison-label">Observed {parameterMetadata[parameter].name}:</span>
          <span className="comparison-value observed">{stats.observed} {stats.unit}</span>
        </div>
        <div className="comparison-row">
          <span className="comparison-label">Difference:</span>
          <span className={`comparison-value ${Math.abs(difference) > 1.5 ? 'anomaly' : 'normal'}`}>
            {stats.difference} {stats.unit}
          </span>
        </div>
      </div>

      {/* Anomaly Alert */}
      {isAnomaly && (
        <div className="anomaly-alert">
          <AlertTriangle className="anomaly-icon" />
          <span className="anomaly-text">ANOMALY DETECTED</span>
        </div>
      )}

      {/* Metadata */}
      <div className="info-section">
        <div className="info-row">
          <Waves className="info-icon" />
          <div className="info-content">
            <span className="info-label">Depth</span>
            <span className="info-value">{latestMeasurement?.depth || 0}m</span>
          </div>
        </div>
        <div className="info-row">
          <Clock className="info-icon" />
          <div className="info-content">
            <span className="info-label">Timestamp</span>
            <span className="info-value">
              {latestMeasurement?.timestamp.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) || 'N/A'}
            </span>
          </div>
        </div>
        {selectedPoint && (
          <>
            <div className="info-row">
              <MapPin className="info-icon" />
              <div className="info-content">
                <span className="info-label">Latitude</span>
                <span className="info-value">{selectedPoint.latitude.toFixed(4)}°</span>
              </div>
            </div>
            <div className="info-row">
              <MapPin className="info-icon" />
              <div className="info-content">
                <span className="info-label">Longitude</span>
                <span className="info-value">{selectedPoint.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Depth Profile Graph */}
      <div className="profile-section">
        <div className="profile-header">
          <Thermometer className="profile-icon" />
          <span className="profile-title">
            {parameterMetadata[parameter].name} Profile
          </span>
        </div>
        <div className="profile-graph">
          <div className="graph-axes">
            {/* Y-axis (Depth) */}
            <div className="y-axis">
              <span className="axis-label">{maxDepth}m</span>
              <span className="axis-label">0m</span>
            </div>
            
            {/* Graph area */}
            <div className="graph-area">
              {/* Anomaly highlight area */}
              {anomalyDepth && (
                <div 
                  className="anomaly-area"
                  style={{
                    top: `${((maxDepth - anomalyDepth.depth) / maxDepth) * 100}%`,
                    height: '15%'
                  }}
                />
              )}
              
              {/* SVG graph */}
              <svg className="graph-lines" viewBox="0 0 200 150" preserveAspectRatio="none">
                {/* Model line (dashed) */}
                <path
                  d={profileData.map((d, i) => {
                    const x = ((d.model - minTemp) / tempRange) * 180 + 10;
                    const y = ((maxDepth - d.depth) / maxDepth) * 130 + 10;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                {/* Observed line (solid) */}
                <path
                  d={profileData.map((d, i) => {
                    const x = ((d.observed - minTemp) / tempRange) * 180 + 10;
                    const y = ((maxDepth - d.depth) / maxDepth) * 130 + 10;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                />
              </svg>
              
              {/* Legend */}
              <div className="graph-legend">
                <div className="legend-item">
                  <div className="legend-line model" />
                  <span>Model</span>
                </div>
                <div className="legend-item">
                  <div className="legend-line observed" />
                  <span>Observed</span>
                </div>
              </div>
            </div>
            
            {/* X-axis (Temperature) */}
            <div className="x-axis">
              <span className="axis-label">{minTemp.toFixed(1)}°</span>
              <span className="axis-label">{maxTemp.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality */}
      <div className="quality-section">
        <div className="quality-header">
          <Activity className="quality-icon" />
          <span className="quality-label">Data Quality</span>
        </div>
        <div className="quality-indicator">
          <div 
            className="quality-bar" 
            style={{ 
              width: `${(latestMeasurement?.quality || 0.85) * 100}%`,
              backgroundColor: (latestMeasurement?.quality || 0.85) > 0.8 ? '#2dd4bf' : '#fbbf24'
            }}
          />
          <span className="quality-score">
            {(latestMeasurement?.quality || 0.85) > 0.8 ? 'Excellent' : 'Good'}
          </span>
        </div>
      </div>
    </div>
  );
}