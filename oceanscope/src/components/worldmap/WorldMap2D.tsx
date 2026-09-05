import { useState } from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import './WorldMap2D.css';

export interface OceanRegion {
  id: string;
  name: string;
  path: string;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

const OCEAN_REGIONS: OceanRegion[] = [
  {
    id: 'pacific',
    name: 'Pacific Ocean',
    path: 'M 20 120 L 180 80 L 350 100 L 350 380 L 180 420 L 20 380 Z',
    bounds: { minLat: -60, maxLat: 60, minLon: -180, maxLon: -60 }
  },
  {
    id: 'atlantic',
    name: 'Atlantic Ocean',
    path: 'M 360 120 L 450 80 L 520 120 L 520 380 L 450 420 L 360 380 Z',
    bounds: { minLat: -60, maxLat: 60, minLon: -60, maxLon: 20 }
  },
  {
    id: 'indian',
    name: 'Indian Ocean',
    path: 'M 540 180 L 680 140 L 780 180 L 780 380 L 680 420 L 540 380 Z',
    bounds: { minLat: -60, maxLat: 30, minLon: 20, maxLon: 120 }
  },
  {
    id: 'arctic',
    name: 'Arctic Ocean',
    path: 'M 100 30 L 400 10 L 700 30 L 700 70 L 400 90 L 100 70 Z',
    bounds: { minLat: 60, maxLat: 90, minLon: -180, maxLon: 180 }
  },
  {
    id: 'southern',
    name: 'Southern Ocean',
    path: 'M 100 430 L 400 410 L 700 430 L 700 490 L 400 510 L 100 490 Z',
    bounds: { minLat: -90, maxLat: -60, minLon: -180, maxLon: 180 }
  }
];

interface WorldMap2DProps {
  onRegionSelect: (region: OceanRegion) => void;
  selectedRegion?: OceanRegion;
}

export default function WorldMap2D({ onRegionSelect, selectedRegion }: WorldMap2DProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="world-map-2d">
      <div className="map-header">
        <div className="map-title">
          <Globe className="map-icon" />
          <span>Global Ocean Explorer</span>
        </div>
        <div className="map-subtitle">Select an ocean region to explore</div>
      </div>

      <div className="map-container">
        <svg viewBox="0 0 800 520" className="world-svg">
          {/* Ocean background */}
          <rect x="0" y="0" width="800" height="520" fill="#0a1628" />
          
          {/* World continents - simplified but recognizable */}
          <g className="world-continents" fill="#1a3a5c" opacity="0.4">
            {/* North America */}
            <path d="M 80 80 L 200 60 L 280 80 L 260 180 L 180 200 L 80 160 Z" />
            {/* South America */}
            <path d="M 220 260 L 280 240 L 300 320 L 260 400 L 200 360 Z" />
            {/* Europe */}
            <path d="M 380 80 L 450 70 L 500 100 L 480 150 L 400 140 Z" />
            {/* Africa */}
            <path d="M 400 160 L 480 150 L 520 200 L 500 350 L 440 380 L 400 250 Z" />
            {/* Asia */}
            <path d="M 520 80 L 680 60 L 750 100 L 720 200 L 600 220 L 520 180 Z" />
            {/* Australia */}
            <path d="M 650 300 L 720 280 L 750 320 L 700 380 L 630 350 Z" />
            {/* Antarctica */}
            <path d="M 100 450 L 300 430 L 500 450 L 700 430 L 650 480 L 150 480 Z" />
          </g>

          {/* Ocean regions */}
          {OCEAN_REGIONS.map((region) => (
            <g key={region.id}>
              <path
                d={region.path}
                className={`ocean-region ${hoveredRegion === region.id ? 'hovered' : ''} ${selectedRegion?.id === region.id ? 'selected' : ''}`}
                onClick={() => onRegionSelect(region)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text
                x={400}
                y={250}
                className="region-label"
                style={{ opacity: hoveredRegion === region.id || selectedRegion?.id === region.id ? 1 : 0 }}
              >
                {region.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Region info panel */}
        {hoveredRegion && (
          <div className="region-info">
            <div className="region-name">
              {OCEAN_REGIONS.find(r => r.id === hoveredRegion)?.name}
            </div>
            <div className="region-coords">
              Lat: {OCEAN_REGIONS.find(r => r.id === hoveredRegion)?.bounds.minLat}° to {OCEAN_REGIONS.find(r => r.id === hoveredRegion)?.bounds.maxLat}°
            </div>
            <div className="region-action">Click to explore</div>
          </div>
        )}
      </div>

      {/* Selected region info */}
      {selectedRegion && (
        <div className="selected-region-panel">
          <div className="selected-title">Selected Region</div>
          <div className="selected-name">{selectedRegion.name}</div>
          <button 
            className="back-btn"
            onClick={() => window.location.reload()}
          >
            <ArrowLeft />
            <span>Back to Map</span>
          </button>
        </div>
      )}
    </div>
  );
}