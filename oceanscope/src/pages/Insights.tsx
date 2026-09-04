import { useState } from 'react';
import { mockInsights } from '../data/mockData';
import { Lightbulb, AlertTriangle, MapPin, TrendingUp, Clock, Filter, CheckCircle } from 'lucide-react';
import type { InsightSeverity } from '../types/oceanData';
import './Insights.css';

export default function Insights() {
  const [selectedSeverity, setSelectedSeverity] = useState<InsightSeverity | 'all'>('all');
  const [selectedParameter, setSelectedParameter] = useState<string>('all');

  const parameters = ['all', ...Array.from(new Set(mockInsights.map(i => i.parameter)))];
  const severities: (InsightSeverity | 'all')[] = ['all', 'low', 'medium', 'high', 'critical'];

  const filteredInsights = mockInsights.filter(insight => {
    const matchesSeverity = selectedSeverity === 'all' || insight.severity === selectedSeverity;
    const matchesParameter = selectedParameter === 'all' || insight.parameter === selectedParameter;
    return matchesSeverity && matchesParameter;
  });

  const getSeverityColor = (severity: InsightSeverity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#fbbf24';
      case 'low': return '#2dd4bf';
      default: return '#7a9cae';
    }
  };

  const getSeverityIcon = (severity: InsightSeverity) => {
    return <AlertTriangle style={{ color: getSeverityColor(severity) }} />;
  };

  const getSeverityLabel = (severity: InsightSeverity) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const severityCount = mockInsights.reduce((acc, insight) => {
    acc[insight.severity] = (acc[insight.severity] || 0) + 1;
    return acc;
  }, {} as Record<InsightSeverity, number>);

  return (
    <div className="insights-page">
      <div className="insights-header">
        <div className="header-content">
          <div className="header-title">
            <Lightbulb className="header-icon" />
            <h1>Scientific Insights</h1>
          </div>
          <p className="header-subtitle">
            AI-powered analysis and anomaly detection in oceanographic data
          </p>
        </div>
      </div>

      <div className="insights-content">
        {/* Statistics Overview */}
        <div className="insights-stats">
          <div className="stat-card total">
            <div className="stat-icon">
              <Lightbulb />
            </div>
            <div className="stat-content">
              <div className="stat-value">{mockInsights.length}</div>
              <div className="stat-label">Total Insights</div>
            </div>
          </div>
          
          <div className="stat-card critical">
            <div className="stat-icon">
              <AlertTriangle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{severityCount.critical || 0}</div>
              <div className="stat-label">Critical</div>
            </div>
          </div>
          
          <div className="stat-card high">
            <div className="stat-icon">
              <AlertTriangle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{severityCount.high || 0}</div>
              <div className="stat-label">High</div>
            </div>
          </div>
          
          <div className="stat-card medium">
            <div className="stat-icon">
              <AlertTriangle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{severityCount.medium || 0}</div>
              <div className="stat-label">Medium</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="insights-filters">
          <div className="filter-group">
            <Filter className="filter-icon" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as InsightSeverity | 'all')}
              className="filter-select"
            >
              {severities.map(severity => (
                <option key={severity} value={severity}>
                  {severity === 'all' ? 'All Severities' : getSeverityLabel(severity as InsightSeverity)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <TrendingUp className="filter-icon" />
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="filter-select"
            >
              {parameters.map(param => (
                <option key={param} value={param}>
                  {param === 'all' ? 'All Parameters' : param.charAt(0).toUpperCase() + param.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="insights-grid">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="insight-card">
              <div className="card-header">
                <div className="severity-badge" style={{ backgroundColor: getSeverityColor(insight.severity) }}>
                  {getSeverityIcon(insight.severity)}
                  <span>{getSeverityLabel(insight.severity)}</span>
                </div>
                <div className="timestamp">
                  <Clock className="timestamp-icon" />
                  {formatDate(insight.timestamp)}
                </div>
              </div>

              <h3 className="insight-title">{insight.title}</h3>
              <p className="insight-description">{insight.explanation}</p>

              <div className="insight-details">
                <div className="detail-row">
                  <MapPin className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{insight.location.region}</span>
                    <span className="detail-coordinates">
                      {insight.location.latitude.toFixed(4)}°, {insight.location.longitude.toFixed(4)}°
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <TrendingUp className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Parameter</span>
                    <span className="detail-value">
                      {insight.parameter.charAt(0).toUpperCase() + insight.parameter.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <CheckCircle className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Observed Value</span>
                    <span className="detail-value" style={{ color: getSeverityColor(insight.severity) }}>
                      {insight.observedValue}
                    </span>
                    <span className="detail-range">
                      Expected: {insight.expectedRange.min} - {insight.expectedRange.max}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button className="action-btn">
                  View Details
                </button>
                <button className="action-btn secondary">
                  Investigate
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="empty-state">
            <Lightbulb className="empty-icon" />
            <h3>No insights found</h3>
            <p>Try adjusting your filters to see more insights</p>
          </div>
        )}
      </div>
    </div>
  );
}