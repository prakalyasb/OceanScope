import { useEffect, useRef } from 'react';
import { Globe, MapPin } from 'lucide-react';
import './LocationOverview.css';

interface LocationOverviewProps {
  currentRegion: string;
  onSelectRegion: (regionKey: string) => void;
}

const REGION_BOUNDS: Record<string, {
  name: string;
  coords: string;
  bbox: [number, number, number, number]; // [minLon, maxLon, minLat, maxLat]
}> = {
  bay_of_bengal: {
    name: 'Bay of Bengal',
    coords: '6°N–20°N, 80°E–94°E',
    bbox: [80.5, 93.5, 5.8, 20.2]
  },
  arabian_sea: {
    name: 'Arabian Sea',
    coords: '8°N–25°N, 55°E–75°E',
    bbox: [55.0, 75.0, 8.0, 25.0]
  },
  equatorial_indian: {
    name: 'Equatorial Indian Ocean',
    coords: '10°S–10°N, 60°E–100°E',
    bbox: [60.0, 100.0, -10.0, 10.0]
  },
  global: {
    name: 'Global Earth',
    coords: 'Worldwide Oceans',
    bbox: [-180, 180, -70, 70]
  }
};

export default function LocationOverview({
  currentRegion,
  onSelectRegion
}: LocationOverviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeInfo = REGION_BOUNDS[currentRegion] || REGION_BOUNDS.bay_of_bengal;

  // Draw lightweight 2D world projection minimap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear background (Deep space/ocean navy)
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, w, h);

    // Coordinate conversion: Lon (-180 to 180) -> x (0 to w), Lat (-90 to 90) -> y (h to 0)
    const lonToX = (lon: number) => ((lon + 180) / 360) * w;
    const latToY = (lat: number) => ((90 - lat) / 180) * h;

    // Draw simplified continent landmasses
    ctx.fillStyle = '#1e3a5f';
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 0.8;

    // Simplified Africa
    ctx.beginPath();
    ctx.moveTo(lonToX(-17), latToY(30));
    ctx.lineTo(lonToX(32), latToY(31));
    ctx.lineTo(lonToX(50), latToY(12));
    ctx.lineTo(lonToX(42), latToY(-10));
    ctx.lineTo(lonToX(20), latToY(-34));
    ctx.lineTo(lonToX(10), latToY(0));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Simplified Eurasia / India
    ctx.beginPath();
    ctx.moveTo(lonToX(-10), latToY(36));
    ctx.lineTo(lonToX(40), latToY(60));
    ctx.lineTo(lonToX(100), latToY(65));
    ctx.lineTo(lonToX(140), latToY(50));
    ctx.lineTo(lonToX(120), latToY(25));
    ctx.lineTo(lonToX(105), latToY(10));
    ctx.lineTo(lonToX(92), latToY(20));
    // India triangle
    ctx.lineTo(lonToX(82), latToY(25));
    ctx.lineTo(lonToX(77), latToY(8));
    ctx.lineTo(lonToX(70), latToY(22));
    ctx.lineTo(lonToX(55), latToY(25));
    ctx.lineTo(lonToX(35), latToY(30));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Simplified Australia
    ctx.beginPath();
    ctx.moveTo(lonToX(115), latToY(-20));
    ctx.lineTo(lonToX(150), latToY(-15));
    ctx.lineTo(lonToX(145), latToY(-38));
    ctx.lineTo(lonToX(115), latToY(-32));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lat/Lon subtle grid lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 0.5;
    // Equator
    const eqY = latToY(0);
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(w, eqY);
    ctx.stroke();

    // Highlighted Active Bounding Box on Minimap
    const bbox = activeInfo.bbox;
    const x1 = lonToX(bbox[0]);
    const x2 = lonToX(bbox[1]);
    const y1 = latToY(bbox[3]); // maxLat (higher up)
    const y2 = latToY(bbox[2]); // minLat

    const boxW = Math.max(8, x2 - x1);
    const boxH = Math.max(6, y2 - y1);

    // Glowing target rectangle
    ctx.fillStyle = 'rgba(0, 212, 255, 0.25)';
    ctx.fillRect(x1, y1, boxW, boxH);

    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x1, y1, boxW, boxH);

    // Center focal point
    const cx = x1 + boxW / 2;
    const cy = y1 + boxH / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4d4f';
    ctx.fill();
  }, [currentRegion, activeInfo]);

  return (
    <div className="location-overview-card">
      {/* Minimap World Canvas */}
      <div className="minimap-container">
        <canvas 
          ref={canvasRef} 
          width={180} 
          height={90} 
          className="minimap-canvas"
        />
        <div className="minimap-overlay-label">
          <Globe size={11} className="globe-icon" />
          <span>GLOBAL OVERVIEW</span>
        </div>
      </div>

      {/* Location Badge & Switcher */}
      <div className="location-details">
        <div className="location-header-row">
          <MapPin size={14} className="pin-icon" />
          <span className="location-name">{activeInfo.name}</span>
        </div>
        <div className="location-coords">{activeInfo.coords}</div>
        
        {/* Quick Region Switcher Buttons */}
        <div className="location-quick-links">
          {Object.keys(REGION_BOUNDS).map((key) => (
            <button
              key={key}
              className={`quick-loc-btn ${currentRegion === key ? 'active' : ''}`}
              onClick={() => onSelectRegion(key)}
            >
              {REGION_BOUNDS[key].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
