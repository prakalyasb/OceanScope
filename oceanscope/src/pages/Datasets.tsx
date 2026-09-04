import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockDatasets } from '../data/mockData';
import { Database, Search, Filter, Calendar, MapPin, Waves, ArrowRight, CheckCircle } from 'lucide-react';
import './Datasets.css';

export default function Datasets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedParameter, setSelectedParameter] = useState('all');

  const regions = ['all', ...Array.from(new Set(mockDatasets.map(d => d.region)))];
  const parameters = ['all', ...Array.from(new Set(mockDatasets.map(d => d.parameter)))];

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || dataset.region === selectedRegion;
    const matchesParameter = selectedParameter === 'all' || dataset.parameter === selectedParameter;
    
    return matchesSearch && matchesRegion && matchesParameter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#2dd4bf';
      case 'processing': return '#fbbf24';
      case 'error': return '#ef4444';
      default: return '#7a9cae';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="datasets-page">
      <div className="datasets-header">
        <div className="header-content">
          <div className="header-title">
            <Database className="header-icon" />
            <h1>Datasets</h1>
          </div>
          <p className="header-subtitle">
            Browse and access oceanographic datasets from multiple sources
          </p>
        </div>
      </div>

      <div className="datasets-content">
        {/* Search and Filters */}
        <div className="datasets-toolbar">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Regions</option>
                {regions.slice(1).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <Waves className="filter-icon" />
              <select
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Parameters</option>
                {parameters.slice(1).map(param => (
                  <option key={param} value={param}>
                    {param.charAt(0).toUpperCase() + param.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dataset Cards */}
        <div className="datasets-grid">
          {filteredDatasets.map((dataset) => (
            <div key={dataset.id} className="dataset-card">
              <div className="card-header">
                <div className="dataset-icon">
                  <Database />
                </div>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(dataset.status) }}
                >
                  <CheckCircle className="status-icon" />
                  {dataset.status}
                </div>
              </div>

              <h3 className="dataset-name">{dataset.name}</h3>
              <p className="dataset-description">{dataset.description}</p>

              <div className="dataset-meta">
                <div className="meta-item">
                  <Waves className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Parameter</span>
                    <span className="meta-value">
                      {dataset.parameter.charAt(0).toUpperCase() + dataset.parameter.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="meta-item">
                  <MapPin className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Region</span>
                    <span className="meta-value">{dataset.region}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Calendar className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Date Range</span>
                    <span className="meta-value">
                      {formatDate(dataset.dateRange.start)} - {formatDate(dataset.dateRange.end)}
                    </span>
                  </div>
                </div>

                <div className="meta-item">
                  <Waves className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Depth</span>
                    <span className="meta-value">
                      {dataset.depth.min}m - {dataset.depth.max}m
                    </span>
                  </div>
                </div>

                <div className="meta-item">
                  <Database className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Source</span>
                    <span className="meta-value">{dataset.source}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Database className="meta-icon" />
                  <div className="meta-content">
                    <span className="meta-label">Points</span>
                    <span className="meta-value">{dataset.observationPoints}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="file-info">
                  <span className="file-type">{dataset.fileType}</span>
                  <span className="file-size">{formatFileSize(dataset.fileSize)}</span>
                </div>
                <Link 
                  to="/explorer" 
                  className="explore-dataset-btn"
                  state={{ datasetId: dataset.id }}
                >
                  <ArrowRight />
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="empty-state">
            <Database className="empty-icon" />
            <h3>No datasets found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}