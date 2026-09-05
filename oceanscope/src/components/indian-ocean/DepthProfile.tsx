import { useState } from 'react';
import { X, Thermometer, Droplets, Activity, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ObservationData } from '../../services/OceanDataService';
import './DepthProfile.css';

interface DepthProfileProps {
  observation: ObservationData;
  onClose: () => void;
}

export default function DepthProfile({ observation, onClose }: DepthProfileProps) {
  const [selectedVariable, setSelectedVariable] = useState<'temperature' | 'salinity' | 'oxygen' | 'chlorophyll'>('temperature');

  // Generate demo profile data (in real implementation, this would come from the backend)
  const generateProfileData = (variable: string) => {
    const depths = [0, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
    return depths.map((depth) => {
      let value: number;
      switch (variable) {
        case 'temperature':
          value = 28 - (depth / 1000) * 15 + Math.random() * 2;
          break;
        case 'salinity':
          value = 34 + (depth / 1000) * 1 + Math.random() * 0.5;
          break;
        case 'oxygen':
          value = 6 - (depth / 1000) * 4 + Math.random() * 0.5;
          break;
        case 'chlorophyll':
          value = 1.5 - (depth / 1000) * 1 + Math.random() * 0.3;
          break;
        default:
          value = 0;
      }
      return { depth, value };
    });
  };

  const profileData = generateProfileData(selectedVariable);

  const getVariableUnit = () => {
    switch (selectedVariable) {
      case 'temperature':
        return '°C';
      case 'salinity':
        return 'PSU';
      case 'oxygen':
        return 'ml/L';
      case 'chlorophyll':
        return 'mg/m³';
      default:
        return '';
    }
  };

  const getVariableColor = () => {
    switch (selectedVariable) {
      case 'temperature':
        return '#00d4ff';
      case 'salinity':
        return '#2dd4bf';
      case 'oxygen':
        return '#a855f7';
      case 'chlorophyll':
        return '#22c55e';
      default:
        return '#00d4ff';
    }
  };

  const variables = [
    { id: 'temperature', name: 'Temperature', icon: Thermometer, available: true },
    { id: 'salinity', name: 'Salinity', icon: Droplets, available: true },
    { id: 'oxygen', name: 'Oxygen', icon: Activity, available: observation.variables.oxygen !== undefined },
    { id: 'chlorophyll', name: 'Chlorophyll', icon: Leaf, available: observation.variables.chlorophyll !== undefined }
  ];

  return (
    <div className="depth-profile">
      <div className="profile-header">
        <div className="profile-title">
          <span className="platform-type">{observation.platformType.toUpperCase()}</span>
          <span className="platform-id">{observation.platformId}</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Location</span>
          <span className="info-value">
            {observation.latitude.toFixed(2)}°N, {observation.longitude.toFixed(2)}°E
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Timestamp</span>
          <span className="info-value">
            {observation.timestamp.toLocaleDateString()}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Current Depth</span>
          <span className="info-value">{observation.depth}m</span>
        </div>
      </div>

      <div className="variable-selector">
        {variables.map((v) => (
          <button
            key={v.id}
            className={`variable-btn ${selectedVariable === v.id ? 'active' : ''} ${!v.available ? 'disabled' : ''}`}
            onClick={() => v.available && setSelectedVariable(v.id as any)}
            disabled={!v.available}
          >
            <v.icon className="variable-icon" />
            <span>{v.name}</span>
          </button>
        ))}
      </div>

      <div className="profile-chart">
        <div className="chart-header">
          <span className="chart-title">{selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1)} Profile</span>
          <span className="chart-unit">Unit: {getVariableUnit()}</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={profileData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
            <XAxis
              dataKey="depth"
              reversed
              label={{ value: 'Depth (m)', position: 'insideBottom', offset: -5, fill: '#7a9cae', fontSize: 12 }}
              stroke="#7a9cae"
            />
            <YAxis
              label={{ value: getVariableUnit(), angle: -90, position: 'insideLeft', fill: '#7a9cae', fontSize: 12 }}
              stroke="#7a9cae"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 39, 68, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                color: '#e8f4f8'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={getVariableColor()}
              strokeWidth={2}
              dot={{ fill: getVariableColor(), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="demo-notice">
        DEMO DATA - Not actual observations
      </div>
    </div>
  );
}