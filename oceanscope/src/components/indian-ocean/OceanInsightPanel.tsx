import { X } from 'lucide-react';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceArea
} from 'recharts';
import type { ObservationData, DepthProfilePoint } from '../../services/OceanDataService';
import './OceanInsightPanel.css';

interface OceanInsightPanelProps {
  observation: ObservationData;
  onClose: () => void;
}

// Default reference profile points matching reference image
const DEFAULT_PROFILE_POINTS: DepthProfilePoint[] = [
  { depth: 0, model: 30.5, observed: 30.8 },
  { depth: 30, model: 30.3, observed: 30.6 },
  { depth: 60, model: 29.8, observed: 30.2 },
  { depth: 90, model: 29.2, observed: 29.8 },
  { depth: 110, model: 28.5, observed: 29.5 },
  { depth: 130, model: 27.8, observed: 29.3, isAnomaly: true },
  { depth: 150, model: 27.4, observed: 29.1, isAnomaly: true },
  { depth: 170, model: 27.1, observed: 28.6, isAnomaly: true },
  { depth: 190, model: 26.9, observed: 27.6 },
  { depth: 220, model: 26.6, observed: 26.8 },
  { depth: 250, model: 26.3, observed: 26.4 }
];

export default function OceanInsightPanel({ observation, onClose }: OceanInsightPanelProps) {
  const profileData = observation.profile && observation.profile.length > 0
    ? observation.profile
    : DEFAULT_PROFILE_POINTS;

  const modelTemp = observation.modelTemperature !== undefined 
    ? `${observation.modelTemperature.toFixed(1)}°C` 
    : '27.4°C';

  const obsTemp = observation.observedTemperature !== undefined 
    ? `${observation.observedTemperature.toFixed(1)}°C` 
    : `${(observation.variables.temperature || 29.1).toFixed(1)}°C`;

  const diffVal = observation.difference !== undefined 
    ? (observation.difference > 0 ? `+${observation.difference.toFixed(1)}°C` : `${observation.difference.toFixed(1)}°C`)
    : '+1.7°C';

  const status = observation.status || 'ANOMALY DETECTED';

  const isArgo = observation.platformType === 'argo';

  return (
    <div className="reference-insight-card">
      {/* 1. Header */}
      <div className="card-header">
        <span className="card-title">Ocean Insight</span>
        <button className="card-close-btn" onClick={onClose} title="Close Panel">
          <X size={16} />
        </button>
      </div>

      {/* 2. Selected Platform Identifier */}
      <div className="platform-id-row">
        <span className={isArgo ? 'platform-diamond-badge' : 'platform-triangle-badge'}>
          {isArgo ? '◆' : '▲'}
        </span>
        <span className="platform-id-text">{observation.platformId}</span>
      </div>

      {/* 3. Numerical Metrics Rows */}
      <div className="metrics-list">
        <div className="metric-row">
          <span className="metric-label">Model Temperature:</span>
          <span className="metric-value">{modelTemp}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Observed Temperature:</span>
          <span className="metric-value">{obsTemp}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Difference:</span>
          <span className="metric-value highlight-difference">{diffVal}</span>
        </div>
        <div className="metric-row status-row">
          <span className="metric-label">Status:</span>
          <span className={`status-badge-framed ${status.includes('ANOMALY') ? 'anomaly' : ''}`}>
            {status}
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Depth:</span>
          <span className="metric-value">{observation.depth} m</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Timestamp:</span>
          <span className="metric-value timestamp-val">
            {observation.timestamp.toISOString().replace('T', ' ').slice(0, 16)} UTC
          </span>
        </div>
      </div>

      {/* 4. Temperature vs Depth Profile Chart */}
      <div className="profile-chart-section">
        <div className="chart-header-label">
          <span>Temperature (°C)</span>
        </div>

        <div className="recharts-wrapper-custom">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart
              data={profileData}
              layout="vertical"
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.12)" />
              
              {/* X-Axis: Temperature (°C) on top */}
              <XAxis 
                type="number"
                dataKey="observed"
                domain={[26, 32]}
                orientation="top"
                ticks={[27, 29, 30, 32]}
                stroke="#7a9cae"
                tick={{ fill: '#b8d4e0', fontSize: 11 }}
              />

              {/* Y-Axis: Depth (m), 0 at top, 250 at bottom */}
              <YAxis 
                type="number"
                dataKey="depth"
                reversed={true}
                domain={[0, 250]}
                ticks={[0, 50, 100, 150, 200, 250]}
                stroke="#7a9cae"
                tick={{ fill: '#b8d4e0', fontSize: 11 }}
                label={{ 
                  value: 'Depth (m)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 15,
                  fill: '#7a9cae', 
                  fontSize: 11 
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 22, 40, 0.95)',
                  border: '1px solid rgba(0, 212, 255, 0.4)',
                  borderRadius: '6px',
                  color: '#e8f4f8',
                  fontSize: 11
                }}
                formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}°C`, name === 'model' ? 'Model' : 'Observed']}
                labelFormatter={(depthVal) => `Depth: ${depthVal}m`}
              />

              {/* Shaded Red Anomaly Zone Band between 110m and 180m depth */}
              <ReferenceArea
                y1={110}
                y2={180}
                stroke="#ff4d4f"
                strokeOpacity={0.6}
                fill="#ff4d4f"
                fillOpacity={0.18}
              />

              {/* Dashed Blue Line: Model */}
              <Line
                type="monotone"
                dataKey="model"
                name="model"
                stroke="#00d4ff"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* Solid Red Line: Observed */}
              <Line
                type="monotone"
                dataKey="observed"
                name="observed"
                stroke="#ff4d4f"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#ff4d4f' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Anomaly Callout Overlay Tag */}
          <div className="anomaly-overlay-callout">
            <span>Model vs observation anomaly</span>
          </div>
        </div>
      </div>
    </div>
  );
}