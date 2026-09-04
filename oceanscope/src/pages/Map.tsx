import { useState } from 'react';
import { mockObservationPoints } from '../data/mockData';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Modal from '../components/ui/Modal';
import './Map.css';

export default function Map() {
  const [selectedPoint, setSelectedPoint] = useState<typeof mockObservationPoints[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handlePointClick = (point: typeof mockObservationPoints[0]) => {
    setSelectedPoint(point);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="header-content">
          <div className="header-title">
            <Navigation className="header-icon" />
            <h1>Geographic View</h1>
          </div>
          <p className="header-subtitle">
            Interactive map of observation points across Indian Ocean regions
          </p>
        </div>
        
        <div className="map-controls">
          <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button className="control-btn" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn />
          </button>
          <button className="control-btn" onClick={handleRotate} title="Rotate">
            <RotateCcw />
          </button>
          <button className="control-btn" onClick={handleReset} title="Reset View">
            <Layers />
          </button>
        </div>
      </div>

      <div className="map-container">
        <div 
          className="map-viewport"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Simplified geographic representation */}
          <svg viewBox="0 0 800 600" className="map-svg">
            {/* Background ocean */}
            <rect width="800" height="600" fill="#0a1628" />
            
            {/* Grid lines */}
            <g stroke="rgba(0, 212, 255, 0.1)" strokeWidth="0.5">
              {Array.from({ length: 12 }, (_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
              {Array.from({ length: 16 }, (_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
              ))}
            </g>

            {/* Simplified land masses */}
            <g fill="#1a3a5c" stroke="#0e4c66" strokeWidth="1">
              {/* India */}
              <path d="M 350 200 L 400 180 L 450 200 L 480 250 L 450 300 L 400 320 L 350 300 L 320 250 Z" />
              
              {/* Arabian Peninsula */}
              <path d="M 200 150 L 250 130 L 300 150 L 320 200 L 300 250 L 250 270 L 200 250 L 180 200 Z" />
              
              {/* Southeast Asia */}
              <path d="M 500 300 L 550 280 L 600 300 L 620 350 L 600 400 L 550 420 L 500 400 L 480 350 Z" />
              
              {/* East Africa */}
              <path d="M 100 300 L 150 280 L 200 300 L 220 350 L 200 400 L 150 420 L 100 400 L 80 350 Z" />
            </g>

            {/* Region labels */}
            <g fill="#00d4ff" fontSize="12" fontWeight="600" opacity="0.7">
              <text x="400" y="250" textAnchor="middle">India</text>
              <text x="250" y="200" textAnchor="middle">Arabian Sea</text>
              <text x="550" y="350" textAnchor="middle">Bay of Bengal</text>
              <text x="650" y="450" textAnchor="middle">Indian Ocean</text>
            </g>

            {/* Observation points */}
            {mockObservationPoints.map((point) => {
              const x = ((point.longitude + 180) / 360) * 800;
              const y = ((90 - point.latitude) / 180) * 600;
              
              return (
                <g key={point.id} onClick={() => handlePointClick(point)} style={{ cursor: 'pointer' }}>
                  {/* Outer glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="rgba(0, 212, 255, 0.2)"
                    opacity={selectedPoint?.id === point.id ? 1 : 0.5}
                  />
                  {/* Inner circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={selectedPoint?.id === point.id ? '#2dd4bf' : '#00d4ff'}
                    stroke="#0a1628"
                    strokeWidth="2"
                  />
                  {/* Pulse effect for active point */}
                  {selectedPoint?.id === point.id && (
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#2dd4bf"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values="6;18;6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.5;0;0.5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <h3 className="legend-title">Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-marker active" />
              <span>Active Station</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker inactive" />
              <span>Observation Point</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker region" />
              <span>Land Mass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Point Details Modal */}
      {selectedPoint && (
        <Modal
          isOpen={!!selectedPoint}
          onClose={() => setSelectedPoint(null)}
          title={selectedPoint.name}
          size="md"
        >
          <div className="point-details">
            <div className="detail-section">
              <h4 className="detail-section-title">Location</h4>
              <div className="detail-row">
                <span className="detail-label">Latitude:</span>
                <span className="detail-value">{selectedPoint.latitude.toFixed(4)}°</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Longitude:</span>
                <span className="detail-value">{selectedPoint.longitude.toFixed(4)}°</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Region:</span>
                <span className="detail-value">{selectedPoint.region}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Depth:</span>
                <span className="detail-value">{selectedPoint.depth}m</span>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Status</h4>
              <div className="status-badge active">
                <MapPin className="status-icon" />
                {selectedPoint.active ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Available Parameters</h4>
              <div className="parameters-list">
                {Object.keys(selectedPoint.measurements).map((param) => (
                  <div key={param} className="parameter-tag">
                    {param.charAt(0).toUpperCase() + param.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="explore-btn"
              onClick={() => {
                setSelectedPoint(null);
                window.location.href = '/explorer';
              }}
            >
              <Navigation />
              Explore in 3D View
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}