import { X, Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ObservationData } from '../../services/OceanDataService';
import './OceanInsightPanel.css';

interface OceanInsightPanelProps {
  observation: ObservationData;
  onClose: () => void;
}

export default function OceanInsightPanel({ observation, onClose }: OceanInsightPanelProps) {
  // Generate demo profile data comparing model vs observation
  const generateProfileData = () => {
    const depths = [0, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
    return depths.map((depth) => ({
      depth,
      model: 28 - (depth / 1000) * 15 + Math.random() * 2,
      observed: 28 - (depth / 1000) * 15 + Math.random() * 2 - 0.5
    }));
  };

  const profileData = generateProfileData();

  return (
    <div className="ocean-insight-panel">
      <div className="insight-header">
        <div className="insight-title">
          <Activity className="insight-icon" />
          <span>OCEAN INSIGHT</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="insight-content">
        {/* Platform Information */}
        <div className="platform-section">
          <div className="section-title">PLATFORM</div>
          <div className="platform-info">
            <div className="info-row">
              <span className="label">ID</span>
              <span className="value">{observation.platformId}</span>
            </div>
            <div className="info-row">
              <span className="label">Type</span>
              <span className="value">{observation.platformType.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="label">Location</span>
              <span className="value">
                {observation.latitude.toFixed(2)}°N, {observation.longitude.toFixed(2)}°E
              </span>
            </div>
            <div className="info-row">
              <span className="label">Depth</span>
              <span className="value">{observation.depth}m</span>
            </div>
            <div className="info-row">
              <span className="label">Timestamp</span>
              <span className="value">{observation.timestamp.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Model vs Observation */}
        <div className="comparison-section">
          <div className="section-title">MODEL VS OBSERVATION</div>
          <div className="comparison-table">
            <div className="comparison-row">
              <span className="var-name">Temperature</span>
              <span className="model-value">
                {observation.variables.temperature?.toFixed(2) || 'N/A'}°C
              </span>
              <span className="observed-value">
                {(observation.variables.temperature! - 0.5).toFixed(2)}°C
              </span>
              <span className="diff-value">-0.50°C</span>
            </div>
            <div className="comparison-row">
              <span className="var-name">Salinity</span>
              <span className="model-value">
                {observation.variables.salinity?.toFixed(2) || 'N/A'} PSU
              </span>
              <span className="observed-value">
                {(observation.variables.salinity! + 0.1).toFixed(2)} PSU
              </span>
              <span className="diff-value positive">+0.10 PSU</span>
            </div>
            <div className="comparison-row">
              <span className="var-name">Oxygen</span>
              <span className="model-value">
                {observation.variables.oxygen?.toFixed(2) || 'N/A'} ml/L
              </span>
              <span className="observed-value">
                {(observation.variables.oxygen! - 0.2).toFixed(2)} ml/L
              </span>
              <span className="diff-value">-0.20 ml/L</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="status-section">
          <div className="section-title">STATUS</div>
          <div className="status-indicator">
            <AlertCircle className="status-icon" />
            <span>MODEL DEVIATION DETECTED</span>
          </div>
        </div>

        {/* Profile Chart */}
        <div className="profile-section">
          <div className="section-title">DEPTH PROFILE</div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profileData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis
                  dataKey="depth"
                  reversed
                  label={{ value: 'Depth (m)', position: 'insideBottom', offset: -5, fill: '#7a9cae', fontSize: 11 }}
                  stroke="#7a9cae"
                />
                <YAxis
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#7a9cae', fontSize: 11 }}
                  stroke="#7a9cae"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 39, 68, 0.95)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#e8f4f8',
                    fontSize: 12
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="model"
                  name="Model"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={{ fill: '#00d4ff', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="observed"
                  name="Observed"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="demo-notice">
          DEMO DATA - Not actual observations
        </div>
      </div>
    </div>
  );
}