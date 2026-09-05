import { useEffect, useRef, useState } from 'react';
import { Globe, MapPin, ChevronDown } from 'lucide-react';
import { OCEAN_BASINS } from '../../data/oceanBasins';
import './LocationOverview.css';

interface LocationOverviewProps {
  currentRegion: string;
  onSelectRegion: (regionKey: string) => void;
}

export default function LocationOverview({
  currentRegion,
  onSelectRegion
}: LocationOverviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeBasin = OCEAN_BASINS[currentRegion] || OCEAN_BASINS.bay_of_bengal;

  // Draw complete high-fidelity 2D world projection minimap with all continents
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Deep space/ocean background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, w, h);

    // Coordinate conversion: Lon (-180 to 180) -> x (0 to w), Lat (-90 to 90) -> y (h to 0)
    const lonToX = (lon: number) => ((lon + 180) / 360) * w;
    const latToY = (lat: number) => ((90 - lat) / 180) * h;

    // Lat/Lon subtle grid lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 0.5;

    // Equator
    const eqY = latToY(0);
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(w, eqY);
    ctx.stroke();

    // Tropics
    const tropicNY = latToY(23.5);
    const tropicSY = latToY(-23.5);
    ctx.beginPath();
    ctx.moveTo(0, tropicNY);
    ctx.lineTo(w, tropicNY);
    ctx.moveTo(0, tropicSY);
    ctx.lineTo(w, tropicSY);
    ctx.stroke();

    // Prime Meridian
    const pmX = lonToX(0);
    ctx.beginPath();
    ctx.moveTo(pmX, 0);
    ctx.lineTo(pmX, h);
    ctx.stroke();

    ctx.fillStyle = '#1e3a5f';
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 0.8;

    // 1. North America
    ctx.beginPath();
    ctx.moveTo(lonToX(-165), latToY(65)); // Alaska
    ctx.lineTo(lonToX(-140), latToY(70));
    ctx.lineTo(lonToX(-90), latToY(72));  // Canada north
    ctx.lineTo(lonToX(-60), latToY(60));  // Labrador
    ctx.lineTo(lonToX(-65), latToY(45));  // New England
    ctx.lineTo(lonToX(-80), latToY(25));  // Florida
    ctx.lineTo(lonToX(-90), latToY(30));  // Gulf
    ctx.lineTo(lonToX(-97), latToY(20));  // Mexico
    ctx.lineTo(lonToX(-85), latToY(10));  // Central America
    ctx.lineTo(lonToX(-105), latToY(20));
    ctx.lineTo(lonToX(-120), latToY(35)); // California
    ctx.lineTo(lonToX(-130), latToY(50)); // Pacific NW
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. South America
    ctx.beginPath();
    ctx.moveTo(lonToX(-78), latToY(10));  // Panama border
    ctx.lineTo(lonToX(-60), latToY(10));  // Venezuela
    ctx.lineTo(lonToX(-35), latToY(-5));  // Brazil bulge
    ctx.lineTo(lonToX(-40), latToY(-22)); // Rio
    ctx.lineTo(lonToX(-60), latToY(-38)); // Argentina
    ctx.lineTo(lonToX(-70), latToY(-54)); // Cape Horn
    ctx.lineTo(lonToX(-75), latToY(-42)); // Chile
    ctx.lineTo(lonToX(-80), latToY(-10)); // Peru
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Africa
    ctx.beginPath();
    ctx.moveTo(lonToX(-17), latToY(30));
    ctx.lineTo(lonToX(32), latToY(31));
    ctx.lineTo(lonToX(50), latToY(12));
    ctx.lineTo(lonToX(42), latToY(-10));
    ctx.lineTo(lonToX(28), latToY(-34));
    ctx.lineTo(lonToX(18), latToY(-34));
    ctx.lineTo(lonToX(10), latToY(0));
    ctx.lineTo(lonToX(-15), latToY(15));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Eurasia & India
    ctx.beginPath();
    ctx.moveTo(lonToX(-10), latToY(36));  // Spain
    ctx.lineTo(lonToX(10), latToY(55));   // Northern Europe
    ctx.lineTo(lonToX(30), latToY(70));   // Scandinavia
    ctx.lineTo(lonToX(80), latToY(72));   // Siberia
    ctx.lineTo(lonToX(150), latToY(68));
    ctx.lineTo(lonToX(170), latToY(65));  // Bering
    ctx.lineTo(lonToX(140), latToY(45));  // Sea of Japan
    ctx.lineTo(lonToX(120), latToY(30));  // China
    ctx.lineTo(lonToX(105), latToY(10));  // SE Asia
    ctx.lineTo(lonToX(92), latToY(20));   // Bay of Bengal coast
    // India sub-continent
    ctx.lineTo(lonToX(82), latToY(25));
    ctx.lineTo(lonToX(78), latToY(8));    // Kanyakumari
    ctx.lineTo(lonToX(72), latToY(20));   // Arabian Sea coast
    ctx.lineTo(lonToX(58), latToY(25));   // Oman/Persian Gulf
    ctx.lineTo(lonToX(35), latToY(32));   // Mediterranean Levant
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Australia
    ctx.beginPath();
    ctx.moveTo(lonToX(115), latToY(-20));
    ctx.lineTo(lonToX(145), latToY(-12));
    ctx.lineTo(lonToX(152), latToY(-32));
    ctx.lineTo(lonToX(142), latToY(-38));
    ctx.lineTo(lonToX(115), latToY(-34));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 6. Antarctica (Southern strip)
    ctx.beginPath();
    ctx.moveTo(lonToX(-180), latToY(-70));
    ctx.lineTo(lonToX(180), latToY(-70));
    ctx.lineTo(lonToX(180), latToY(-90));
    ctx.lineTo(lonToX(-180), latToY(-90));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Highlighted Active Bounding Box on Minimap
    const bbox = activeBasin.bbox;
    const x1 = lonToX(bbox[0]);
    const x2 = lonToX(bbox[1]);
    const y1 = latToY(bbox[3]); // maxLat (higher up)
    const y2 = latToY(bbox[2]); // minLat

    const boxW = Math.max(8, x2 - x1);
    const boxH = Math.max(6, y2 - y1);

    // Glowing target box
    ctx.fillStyle = 'rgba(0, 212, 255, 0.28)';
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
  }, [currentRegion, activeBasin]);

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
          <span className="location-name">{activeBasin.name}</span>
          <span className="ocean-category-badge">{activeBasin.oceanCategory}</span>
        </div>
        <div className="location-coords">{activeBasin.coordsLabel}</div>
        
        {/* Quick Region Switcher & Dropdown */}
        <div className="location-quick-links">
          {['bay_of_bengal', 'arabian_sea', 'north_atlantic', 'north_pacific'].map((key) => (
            <button
              key={key}
              className={`quick-loc-btn ${currentRegion === key ? 'active' : ''}`}
              onClick={() => onSelectRegion(key)}
            >
              {OCEAN_BASINS[key]?.shortName || key}
            </button>
          ))}

          {/* All Oceans Dropdown Menu */}
          <div className="all-oceans-dropdown-wrapper">
            <button 
              className={`quick-loc-btn dropdown-trigger ${!['bay_of_bengal', 'arabian_sea', 'north_atlantic', 'north_pacific'].includes(currentRegion) ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>All Oceans</span>
              <ChevronDown size={11} />
            </button>

            {isDropdownOpen && (
              <div className="all-oceans-menu">
                {Object.entries(OCEAN_BASINS).map(([key, basin]) => (
                  <button
                    key={key}
                    className={`ocean-menu-item ${currentRegion === key ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectRegion(key);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="item-name">{basin.name}</span>
                    <span className="item-cat">{basin.oceanCategory}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
