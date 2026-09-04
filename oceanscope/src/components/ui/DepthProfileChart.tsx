import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Thermometer, Activity } from 'lucide-react';
import './DepthProfileChart.css';

export interface ProfileDataPoint {
  depth: number;
  model: number;
  observed: number;
  timestamp: Date;
}

interface DepthProfileChartProps {
  data: ProfileDataPoint[];
  variable: string;
  unit: string;
  title?: string;
  showAnomaly?: boolean;
  anomalyThreshold?: number;
}

export default function DepthProfileChart({
  data,
  variable,
  unit,
  title,
  showAnomaly = true,
  anomalyThreshold = 1.5
}: DepthProfileChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      depth: point.depth,
      model: point.model,
      observed: point.observed,
      difference: Math.abs(point.observed - point.model),
      timestamp: point.timestamp
    })).sort((a, b) => b.depth - a.depth); // Sort by depth descending
  }, [data]);
  
  const anomalyData = useMemo(() => {
    return chartData.filter(point => point.difference > anomalyThreshold);
  }, [chartData, anomalyThreshold]);
  
  const maxDepth = Math.max(...chartData.map(d => d.depth));
  const minDepth = Math.min(...chartData.map(d => d.depth));
  const maxValue = Math.max(...chartData.map(d => Math.max(d.model, d.observed)));
  const minValue = Math.min(...chartData.map(d => Math.min(d.model, d.observed)));
  
  return (
    <div className="depth-profile-chart">
      <div className="chart-header">
        <div className="chart-title">
          <Thermometer className="chart-icon" />
          <span>{title || `${variable} Profile`}</span>
        </div>
        {showAnomaly && anomalyData.length > 0 && (
          <div className="anomaly-badge">
            <Activity className="anomaly-icon" />
            <span>{anomalyData.length} Anomalies</span>
          </div>
        )}
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
            
            <XAxis
              dataKey="depth"
              type="number"
              scale="linear"
              domain={[minDepth, maxDepth]}
              reversed
              label={{
                value: 'Depth (m)',
                position: 'insideBottom',
                offset: -10,
                style: { fill: '#7a9cae', fontSize: 12 }
              }}
              style={{ fill: '#7a9cae', fontSize: 11 }}
            />
            
            <YAxis
              label={{
                value: `${variable} (${unit})`,
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#7a9cae', fontSize: 12 }
              }}
              domain={[minValue - 1, maxValue + 1]}
              style={{ fill: '#7a9cae', fontSize: 11 }}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 39, 68, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '0.5rem',
                color: '#e8f4f8'
              }}
              formatter={(value: any, name: any) => {
                if (value === undefined) return ['', ''];
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                return [
                  `${numValue.toFixed(2)} ${unit}`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ];
              }}
              labelFormatter={(label: any) => {
                if (typeof label !== 'number') return '';
                const point = chartData.find(d => d.depth === label);
                return `Depth: ${label}m${point ? ` (${point.timestamp.toLocaleTimeString()})` : ''}`;
              }}
            />
            
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ color: '#7a9cae', fontSize: 12 }}
            />
            
            {/* Anomaly highlight areas */}
            {showAnomaly && anomalyData.map((point, i) => (
              <Area
                key={i}
                data={chartData.filter(d => Math.abs(d.depth - point.depth) < 50)}
                dataKey="observed"
                fill="rgba(251, 191, 36, 0.15)"
                stroke="none"
                isAnimationActive={false}
              />
            ))}
            
            {/* Model line (dashed) */}
            <Line
              type="monotone"
              dataKey="model"
              stroke="#ff6b6b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Model"
              isAnimationActive={false}
            />
            
            {/* Observed line (solid) */}
            <Line
              type="monotone"
              dataKey="observed"
              stroke="#00d4ff"
              strokeWidth={2}
              dot={{ fill: '#00d4ff', r: 3 }}
              activeDot={{ r: 5, fill: '#00d4ff' }}
              name="Observed"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Timestamp information */}
      <div className="chart-footer">
        <div className="timestamp-info">
          <span className="timestamp-label">Latest Measurement:</span>
          <span className="timestamp-value">
            {data[data.length - 1]?.timestamp.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            }) || 'N/A'}
          </span>
        </div>
        
        {showAnomaly && anomalyData.length > 0 && (
          <div className="anomaly-info">
            <span className="anomaly-label">Max Difference:</span>
            <span className="anomaly-value">
              {Math.max(...anomalyData.map(d => d.difference)).toFixed(2)} {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}