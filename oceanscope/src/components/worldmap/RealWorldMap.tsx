import { useEffect, useRef } from 'react';
import L from 'leaflet';
import './RealWorldMap.css';

export interface OceanRegion {
  id: string;
  name: string;
  bounds: L.LatLngBounds;
}

const OCEAN_REGIONS: OceanRegion[] = [
  {
    id: 'indian',
    name: 'Indian Ocean',
    bounds: L.latLngBounds([[-20, 40], [25, 100]])
  },
  {
    id: 'arabian',
    name: 'Arabian Sea',
    bounds: L.latLngBounds([[5, 55], [25, 75]])
  },
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    bounds: L.latLngBounds([[5, 80], [22, 95]])
  }
];

interface RealWorldMapProps {
  onRegionSelect: (region: OceanRegion) => void;
  selectedRegion?: OceanRegion;
}

export default function RealWorldMap({ onRegionSelect, selectedRegion }: RealWorldMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const regionRectanglesRef = useRef<L.Rectangle[]>([]);
  const regionLabelsRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize Leaflet map
      const map = L.map('world-map', {
        center: [12, 78],
        zoom: 4,
        minZoom: 3,
        maxZoom: 8,
        worldCopyJump: false
      });

      // Add satellite tiles (Esri World Imagery - no API key required)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 18
      }).addTo(map);
      
      // Add transparent labels on top
      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by Stamen Design, CC BY 3.0',
        subdomains: 'abcd',
        maxZoom: 18,
        opacity: 0.7
      }).addTo(map);

      // Add ocean region rectangles with labels
      OCEAN_REGIONS.forEach((region) => {
        const rectangle = L.rectangle(region.bounds, {
          color: '#00d4ff',
          weight: 2,
          fillColor: 'rgba(0, 212, 255, 0.1)',
          fillOpacity: 0.3
        }).addTo(map);

        // Add label at center of bounds
        const center = region.bounds.getCenter();
        const textElement = document.createElement('div');
        textElement.className = 'ocean-label';
        textElement.innerHTML = `<div class="label-text">${region.name}</div>`;
        textElement.style.zIndex = '1000';
        const icon = L.divIcon({
          className: 'ocean-label-container',
          html: textElement,
          iconSize: [150, 30],
          iconAnchor: [75, 15]
        });
        const marker = L.marker(center, { icon, interactive: false }).addTo(map);
        regionLabelsRef.current.push(marker);

        rectangle.on('click', () => {
          onRegionSelect(region);
        });

        rectangle.on('mouseover', () => {
          rectangle.setStyle({
            fillColor: 'rgba(0, 212, 255, 0.3)',
            weight: 3
          });
        });

        rectangle.on('mouseout', () => {
          rectangle.setStyle({
            fillColor: 'rgba(0, 212, 255, 0.1)',
            weight: 2
          });
        });

        regionRectanglesRef.current.push(rectangle);
      });

      mapRef.current = map;
    }

    return () => {
  const map = mapRef.current;

  if (map) {
    regionRectanglesRef.current.forEach(rect => map.removeLayer(rect));
    regionLabelsRef.current.forEach(marker => map.removeLayer(marker));
    map.remove();
    mapRef.current = null;
  }
};
  }, []);

  // Update selected region styling
  useEffect(() => {
    regionRectanglesRef.current.forEach((rectangle, index) => {
      const region = OCEAN_REGIONS[index];
      if (selectedRegion && region.id === selectedRegion.id) {
        rectangle.setStyle({
          fillColor: 'rgba(0, 212, 255, 0.4)',
          weight: 4,
          color: '#00d4ff'
        });
      } else {
        rectangle.setStyle({
          fillColor: 'rgba(0, 212, 255, 0.1)',
          weight: 2,
          color: '#00d4ff'
        });
      }
    });
  }, [selectedRegion, onRegionSelect]);

  return (
    <div className="real-world-map">
      <div className="map-header">
        <div className="map-title">India Ocean Explorer</div>
        <div className="map-subtitle">Click on an ocean region to explore in 3D</div>
      </div>
      <div id="world-map" className="map-container"></div>
      
      {selectedRegion && (
        <div className="selected-region-info">
          <div className="selected-title">Selected Region</div>
          <div className="selected-name">{selectedRegion.name}</div>
          <button 
            className="back-btn"
            onClick={() => window.location.reload()}
          >
            ← Back to Map
          </button>
        </div>
      )}
    </div>
  );
}
