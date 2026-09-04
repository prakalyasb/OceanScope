import { useState } from 'react';
import type { OceanParameter } from '../types/oceanData';
import { parameterMetadata, generateTimeSeries } from '../data/mockData';
import { GitCompare, TrendingUp, ArrowRight, ArrowUpDown, Play, Pause } from 'lucide-react';
import './Compare.css';

export default function Compare() {
  const [comparisonMode, setComparisonMode] = useState<'parameter' | 'time' | 'depth'>('parameter');
  const [primaryParam, setPrimaryParam] = useState<OceanParameter>('temperature');
  const [secondaryParam, setSecondaryParam] = useState<OceanParameter>('salinity');
  const [isPlaying, setIsPlaying] = useState(false);

  const parameters: OceanParameter[] = ['temperature', 'salinity', 'chlorophyll', 'currentSpeed', 'waveHeight', 'dissolvedOxygen'];

  const primaryData = generateTimeSeries(primaryParam, 20);
  const secondaryData = generateTimeSeries(secondaryParam, 20);

  const primaryStats = {
    current: primaryData[primaryData.length - 1].value.toFixed(1),
    min: Math.min(...primaryData.map(d => d.value)).toFixed(1),
    max: Math.max(...primaryData.map(d => d.value)).toFixed(1),
    avg: (primaryData.reduce((sum, d) => sum + d.value, 0) / primaryData.length).toFixed(1)
  };

  const secondaryStats = {
    current: secondaryData[secondaryData.length - 1].value.toFixed(1),
    min: Math.min(...secondaryData.map(d => d.value)).toFixed(1),
    max: Math.max(...secondaryData.map(d => d.value)).toFixed(1),
    avg: (secondaryData.reduce((sum, d) => sum + d.value, 0) / secondaryData.length).toFixed(1)
  };

  const calculateDifference = () => {
    const diff = primaryData[primaryData.length - 1].value - secondaryData[secondaryData.length - 1].value;
    const percentChange = ((diff / secondaryData[secondaryData.length - 1].value) * 100).toFixed(1);
    return {
      value: diff.toFixed(1),
      percent: percentChange,
      isPositive: diff > 0
    };
  };

  const difference = calculateDifference();

  const renderChart = (data: typeof primaryData, color: string) => {
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;

    return (
      <div className="chart">
        {data.map((point, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{
              height: `${((point.value - min) / range) * 100}%`,
              backgroundColor: color
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <div className="header-content">
          <div className="header-title">
            <GitCompare className="header-icon" />
            <h1>Data Comparison</h1>
          </div>
          <p className="header-subtitle">
            Compare ocean parameters, time periods, and depth levels
          </p>
        </div>
      </div>

      <div className="compare-content">
        {/* Comparison Mode Selector */}
        <div className="mode-selector">
          <button
            className={`mode-btn ${comparisonMode === 'parameter' ? 'active' : ''}`}
            onClick={() => setComparisonMode('parameter')}
          >
            <TrendingUp />
            Parameters
          </button>
          <button
            className={`mode-btn ${comparisonMode === 'time' ? 'active' : ''}`}
            onClick={() => setComparisonMode('time')}
          >
            Play
            Time Periods
          </button>
          <button
            className={`mode-btn ${comparisonMode === 'depth' ? 'active' : ''}`}
            onClick={() => setComparisonMode('depth')}
          >
            Depth Levels
          </button>
        </div>

        {/* Parameter Comparison */}
        {comparisonMode === 'parameter' && (
          <div className="comparison-layout">
            {/* Primary Parameter */}
            <div className="comparison-panel primary">
              <div className="panel-header">
                <h3>Primary Parameter</h3>
                <select
                  value={primaryParam}
                  onChange={(e) => setPrimaryParam(e.target.value as OceanParameter)}
                  className="param-select"
                >
                  {parameters.map(param => (
                    <option key={param} value={param}>
                      {parameterMetadata[param].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="param-display">
                <div 
                  className="param-indicator"
                  style={{ backgroundColor: parameterMetadata[primaryParam].color }}
                />
                <div className="param-info">
                  <h2>{parameterMetadata[primaryParam].name}</h2>
                  <p>{parameterMetadata[primaryParam].unit}</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Current</span>
                  <span className="stat-value">{primaryStats.current}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Min</span>
                  <span className="stat-value">{primaryStats.min}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Max</span>
                  <span className="stat-value">{primaryStats.max}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Average</span>
                  <span className="stat-value">{primaryStats.avg}</span>
                </div>
              </div>

              <div className="chart-container">
                <h4>Time Series</h4>
                {renderChart(primaryData, parameterMetadata[primaryParam].color)}
              </div>
            </div>

            {/* Swap Button */}
            <button 
              className="swap-btn"
              onClick={() => {
                const temp = primaryParam;
                setPrimaryParam(secondaryParam);
                setSecondaryParam(temp);
              }}
            >
              <ArrowUpDown />
            </button>

            {/* Secondary Parameter */}
            <div className="comparison-panel secondary">
              <div className="panel-header">
                <h3>Secondary Parameter</h3>
                <select
                  value={secondaryParam}
                  onChange={(e) => setSecondaryParam(e.target.value as OceanParameter)}
                  className="param-select"
                >
                  {parameters.map(param => (
                    <option key={param} value={param}>
                      {parameterMetadata[param].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="param-display">
                <div 
                  className="param-indicator"
                  style={{ backgroundColor: parameterMetadata[secondaryParam].color }}
                />
                <div className="param-info">
                  <h2>{parameterMetadata[secondaryParam].name}</h2>
                  <p>{parameterMetadata[secondaryParam].unit}</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Current</span>
                  <span className="stat-value">{secondaryStats.current}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Min</span>
                  <span className="stat-value">{secondaryStats.min}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Max</span>
                  <span className="stat-value">{secondaryStats.max}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Average</span>
                  <span className="stat-value">{secondaryStats.avg}</span>
                </div>
              </div>

              <div className="chart-container">
                <h4>Time Series</h4>
                {renderChart(secondaryData, parameterMetadata[secondaryParam].color)}
              </div>
            </div>
          </div>
        )}

        {/* Difference Analysis */}
        <div className="difference-panel">
          <h3>Difference Analysis</h3>
          <div className="difference-content">
            <div className="difference-metric">
              <span className="metric-label">Value Difference</span>
              <span className={`metric-value ${difference.isPositive ? 'positive' : 'negative'}`}>
                {difference.isPositive ? '+' : ''}{difference.value}
              </span>
            </div>
            <div className="difference-metric">
              <span className="metric-label">Percentage Change</span>
              <span className={`metric-value ${difference.isPositive ? 'positive' : 'negative'}`}>
                {difference.isPositive ? '+' : ''}{difference.percent}%
              </span>
            </div>
            <div className="difference-metric">
              <span className="metric-label">Correlation</span>
              <span className="metric-value neutral">
                {Math.abs(Math.random() * 0.8 + 0.2).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Controls */}
        <div className="comparison-controls">
          <button 
            className={`control-btn ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? 'Pause Animation' : 'Play Animation'}
          </button>
          <button className="control-btn">
            <ArrowRight />
            View in Explorer
          </button>
        </div>
      </div>
    </div>
  );
}