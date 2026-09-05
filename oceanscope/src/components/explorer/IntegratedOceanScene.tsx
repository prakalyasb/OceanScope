import { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Eye, 
  Layers, 
  Maximize2 
} from 'lucide-react';
import type { ObservationData } from '../../services/OceanDataService';
import { oceanDataService } from '../../services/OceanDataService';
import './IntegratedOceanScene.css';

// Ensure Cesium base URL is set
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/cesium/';
}

export interface IntegratedOceanSceneProps {
  parameter: string;
  depth: number;
  showArgo: boolean;
  showGliders: boolean;
  showCurrents: boolean;
  verticalExaggeration?: number;
  opacity?: number;
  selectedObservationId?: string;
  onSelectObservation?: (observation: ObservationData) => void;
  activeRegion?: string;
  onRegionChange?: (region: string) => void;
}

// Region camera configurations
const REGION_PRESETS: Record<string, {
  name: string;
  destination: [number, number, number]; // lon, lat, height
  heading: number;
  pitch: number;
  roll: number;
}> = {
  bay_of_bengal: {
    name: 'Bay of Bengal (Reference 3D)',
    destination: [88.5, 4.2, 1950000],
    heading: 348,
    pitch: -38,
    roll: 0
  },
  arabian_sea: {
    name: 'Arabian Sea',
    destination: [68.0, 5.0, 2200000],
    heading: 15,
    pitch: -42,
    roll: 0
  },
  equatorial_indian: {
    name: 'Equatorial Indian Ocean',
    destination: [78.0, -8.0, 3200000],
    heading: 0,
    pitch: -50,
    roll: 0
  },
  global: {
    name: 'Global View',
    destination: [80.0, 15.0, 9500000],
    heading: 0,
    pitch: -88,
    roll: 0
  }
};

/**
 * Generate high-resolution procedural texture for the cutaway depth walls
 * showing realistic thermocline / temperature stratification, depth ticks and labels
 */
function createCutawayWallTexture(parameter: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient based on parameter
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (parameter === 'temperature') {
    // Reference image thermocline:
    // Warm reddish-orange at surface (0 - 100m)
    // Sharp thermocline transition with yellow/teal bands (100m - 500m)
    // Deep dark ocean navy/indigo (500m - 3000m)
    grad.addColorStop(0.00, '#ff3b30'); // 30°C surface
    grad.addColorStop(0.04, '#ff6b4a'); // 28°C
    grad.addColorStop(0.08, '#fa8c16'); // 26°C
    grad.addColorStop(0.14, '#ffc069'); // 22°C thermocline entrance
    grad.addColorStop(0.20, '#52c41a'); // 18°C
    grad.addColorStop(0.28, '#13c2c2'); // 14°C
    grad.addColorStop(0.38, '#1890ff'); // 10°C
    grad.addColorStop(0.55, '#096dd9'); // 6°C
    grad.addColorStop(0.75, '#003a8c'); // 4°C
    grad.addColorStop(1.00, '#001529'); // 2°C deep abyssal
  } else if (parameter === 'salinity') {
    grad.addColorStop(0.00, '#a0d911');
    grad.addColorStop(0.20, '#52c41a');
    grad.addColorStop(0.40, '#13c2c2');
    grad.addColorStop(0.70, '#1890ff');
    grad.addColorStop(1.00, '#002766');
  } else {
    grad.addColorStop(0.00, '#f5222d');
    grad.addColorStop(0.25, '#fa8c16');
    grad.addColorStop(0.50, '#13c2c2');
    grad.addColorStop(0.75, '#1890ff');
    grad.addColorStop(1.00, '#001529');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle horizontal layering noise/stratification lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 10; y < canvas.height; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Major depth contour lines and labels (0, 500m, 1000m, 2000m, 3000m)
  const depthMarks = [
    { depth: '0', ratio: 0.02 },
    { depth: '500m', ratio: 0.17 },
    { depth: '1000m', ratio: 0.33 },
    { depth: '2000m', ratio: 0.67 },
    { depth: '3000m', ratio: 0.96 }
  ];

  ctx.font = 'bold 22px Inter, sans-serif';
  depthMarks.forEach(mark => {
    const y = mark.ratio * canvas.height;

    // Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick mark
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(30, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 30, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    // Text Label on left
    ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
    ctx.fillRect(35, y - 16, 110, 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(mark.depth, 42, y + 7);

    // Text Label on right
    ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
    ctx.fillRect(canvas.width - 145, y - 16, 110, 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(mark.depth, canvas.width - 135, y + 7);
  });

  // Vertical border frame on the edges
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
}

/**
 * Generate diamond icon for Argo floats
 */
function createArgoIcon(selected: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 24;
  const cy = 24;
  const size = 16;

  // Glow if selected
  if (selected) {
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 14;
  }

  // Draw diamond
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();

  ctx.fillStyle = selected ? '#ffffff' : '#00d4ff';
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = selected ? '#00d4ff' : '#0e4c66';
  ctx.stroke();

  // Inner dot
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = selected ? '#ff4d4f' : '#ffffff';
  ctx.fill();

  return canvas.toDataURL('image/png');
}

/**
 * Generate triangle icon for Gliders
 */
function createGliderIcon(selected: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 24;
  const cy = 24;
  const size = 16;

  if (selected) {
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 14;
  }

  // Draw upward triangle
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy + size * 0.8);
  ctx.lineTo(cx - size, cy + size * 0.8);
  ctx.closePath();

  ctx.fillStyle = selected ? '#ffffff' : '#f472b6';
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = selected ? '#f472b6' : '#701a75';
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export default function IntegratedOceanScene({
  parameter,
  depth,
  showArgo,
  showGliders,
  showCurrents,
  verticalExaggeration = 5,
  opacity = 0.85,
  selectedObservationId,
  onSelectObservation,
  activeRegion = 'bay_of_bengal',
  onRegionChange
}: IntegratedOceanSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entitiesRef = useRef<Cesium.Entity[]>([]);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  const onSelectRef = useRef(onSelectObservation);
  useEffect(() => {
    onSelectRef.current = onSelectObservation;
  }, [onSelectObservation]);


  // Scaled depth multiplier for visual cutaway visibility
  const visualScale = Math.max(1, verticalExaggeration) * 120;
  const maxDepthMeters = 3000 * visualScale;
  const activeDepthMeters = depth * visualScale;

  // 1. Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: Cesium.Viewer;

    try {
      viewer = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        animation: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        creditContainer: document.createElement('div'),
        scene3DOnly: true,
        skyBox: false,
        contextOptions: {
          webgl: {
            alpha: true,
            preserveDrawingBuffer: true
          }
        }
      });

      viewerRef.current = viewer;

      // Dark space background
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#060d17');
      if (viewer.scene.globe) {
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#091a2e');
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.atmosphereBrightnessShift = 0.15;
        viewer.scene.globe.depthTestAgainstTerrain = false;

        // Add high-resolution satellite imagery
        try {
          const esriSatellite = new Cesium.UrlTemplateImageryProvider({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maximumLevel: 19
          });
          viewer.imageryLayers.addImageryProvider(esriSatellite);
        } catch {
          // Automatic fallback to default base layer
        }
      }


      // Initial camera setup matching reference image
      const preset = REGION_PRESETS.bay_of_bengal;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          preset.destination[0],
          preset.destination[1],
          preset.destination[2]
        ),
        orientation: {
          heading: Cesium.Math.toRadians(preset.heading),
          pitch: Cesium.Math.toRadians(preset.pitch),
          roll: Cesium.Math.toRadians(preset.roll)
        }
      });

      // Mouse click interaction handler
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.observationData) {
          const obsData = pickedObject.id.observationData as ObservationData;
          if (onSelectRef.current) {
            onSelectRef.current(obsData);
          }

        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction((movement: any) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.observationData) {
          if (containerRef.current) {
            containerRef.current.style.cursor = 'pointer';
          }
          setHoveredEntity(pickedObject.id.name || null);
        } else {
          if (containerRef.current) {
            containerRef.current.style.cursor = 'default';
          }
          setHoveredEntity(null);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      setIsSceneReady(true);
    } catch (err) {
      console.error('Failed to initialize Cesium Viewer:', err);
    }

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // 2. Fly to active region if requested
  useEffect(() => {
    if (!viewerRef.current || !activeRegion || !REGION_PRESETS[activeRegion]) return;
    const preset = REGION_PRESETS[activeRegion];
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        preset.destination[0],
        preset.destination[1],
        preset.destination[2]
      ),
      orientation: {
        heading: Cesium.Math.toRadians(preset.heading),
        pitch: Cesium.Math.toRadians(preset.pitch),
        roll: Cesium.Math.toRadians(preset.roll)
      },
      duration: 1.8
    });
  }, [activeRegion]);

  // 3. Render the 3D Subsurface Cutaway Volume, Flow Arrows, and Platforms
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !isSceneReady) return;

    // Clean up previous entities
    entitiesRef.current.forEach(entity => viewer.entities.remove(entity));
    entitiesRef.current = [];

    const newEntities: Cesium.Entity[] = [];

    // Bay of Bengal Cutaway Bounding Coordinates
    const lonWest = 80.5;
    const lonEast = 93.5;
    const latSouth = 5.8;
    const latNorth = 20.2;

    const wallTextureUri = createCutawayWallTexture(parameter);

    // ==========================================
    // A. 3D Cutaway Vertical Depth Walls (0m to -3000m)
    // ==========================================

    // 1. South Front Wall (facing viewer)
    const southWall = viewer.entities.add({
      name: 'Cutaway South Wall',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          lonWest, latSouth,
          (lonWest + lonEast) / 2, latSouth,
          lonEast, latSouth
        ]),
        maximumHeights: [0, 0, 0],
        minimumHeights: [-maxDepthMeters, -maxDepthMeters, -maxDepthMeters],
        material: new Cesium.ImageMaterialProperty({
          image: wallTextureUri,
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(opacity)
        })
      }
    });
    newEntities.push(southWall);

    // 2. West Wall (along Sri Lanka & East Coast India)
    const westWall = viewer.entities.add({
      name: 'Cutaway West Wall',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          lonWest, latNorth,
          lonWest, (latNorth + latSouth) / 2,
          lonWest, latSouth
        ]),
        maximumHeights: [0, 0, 0],
        minimumHeights: [-maxDepthMeters, -maxDepthMeters, -maxDepthMeters],
        material: new Cesium.ImageMaterialProperty({
          image: wallTextureUri,
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(opacity)
        })
      }
    });
    newEntities.push(westWall);

    // 3. East Wall (towards Andaman & Myanmar)
    const eastWall = viewer.entities.add({
      name: 'Cutaway East Wall',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          lonEast, latSouth,
          lonEast, (latSouth + latNorth) / 2,
          lonEast, latNorth
        ]),
        maximumHeights: [0, 0, 0],
        minimumHeights: [-maxDepthMeters, -maxDepthMeters, -maxDepthMeters],
        material: new Cesium.ImageMaterialProperty({
          image: wallTextureUri,
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(opacity * 0.85)
        })
      }
    });
    newEntities.push(eastWall);

    // 4. White Wireframe / Outlines for the Cutaway Block Box
    const outlinePositions = [
      // Top boundary
      Cesium.Cartesian3.fromDegrees(lonWest, latSouth, 0),
      Cesium.Cartesian3.fromDegrees(lonEast, latSouth, 0),
      Cesium.Cartesian3.fromDegrees(lonEast, latNorth, 0),
      Cesium.Cartesian3.fromDegrees(lonWest, latNorth, 0),
      Cesium.Cartesian3.fromDegrees(lonWest, latSouth, 0),
      // Front-left vertical pillar down to bottom
      Cesium.Cartesian3.fromDegrees(lonWest, latSouth, -maxDepthMeters),
      // Bottom boundary
      Cesium.Cartesian3.fromDegrees(lonEast, latSouth, -maxDepthMeters),
      Cesium.Cartesian3.fromDegrees(lonEast, latNorth, -maxDepthMeters),
      Cesium.Cartesian3.fromDegrees(lonWest, latNorth, -maxDepthMeters),
      Cesium.Cartesian3.fromDegrees(lonWest, latSouth, -maxDepthMeters)
    ];

    const boxOutline = viewer.entities.add({
      name: 'Cutaway Box Wireframe',
      polyline: {
        positions: outlinePositions,
        width: 2.5,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.25,
          color: Cesium.Color.fromCssColorString('#00d4ff')
        })
      }
    });
    newEntities.push(boxOutline);

    // Additional vertical corner pillars
    const frontRightPillar = viewer.entities.add({
      polyline: {
        positions: [
          Cesium.Cartesian3.fromDegrees(lonEast, latSouth, 0),
          Cesium.Cartesian3.fromDegrees(lonEast, latSouth, -maxDepthMeters)
        ],
        width: 2,
        material: Cesium.Color.fromCssColorString('#00d4ff')
      }
    });
    newEntities.push(frontRightPillar);

    const backRightPillar = viewer.entities.add({
      polyline: {
        positions: [
          Cesium.Cartesian3.fromDegrees(lonEast, latNorth, 0),
          Cesium.Cartesian3.fromDegrees(lonEast, latNorth, -maxDepthMeters)
        ],
        width: 1.5,
        material: Cesium.Color.fromCssColorString('#0e4c66')
      }
    });
    newEntities.push(backRightPillar);

    // ==========================================
    // B. Ocean Surface Layer & Active Depth Slice
    // ==========================================

    // Ocean Surface Plane (top of cutaway box)
    const oceanSurface = viewer.entities.add({
      name: 'Ocean Surface',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          lonWest, latSouth,
          lonEast, latSouth,
          lonEast, latNorth,
          lonWest, latNorth
        ]),
        height: 500,
        material: Cesium.Color.fromCssColorString('#0e4c66').withAlpha(0.55)
      }
    });
    newEntities.push(oceanSurface);

    // Active Depth Iso-surface Plane (controlled by Depth Slider)
    if (activeDepthMeters > 0) {
      const depthSlice = viewer.entities.add({
        name: `Depth Plane (${depth}m)`,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            lonWest, latSouth,
            lonEast, latSouth,
            lonEast, latNorth,
            lonWest, latNorth
          ]),
          height: -activeDepthMeters,
          material: Cesium.Color.fromCssColorString('#00d4ff').withAlpha(0.22),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#00d4ff').withAlpha(0.7)
        }
      });
      newEntities.push(depthSlice);
    }

    // ==========================================
    // C. 3D Ocean Current Flow Streamlines / Arrows
    // ==========================================
    if (showCurrents) {
      // 1. Warm northeastward curved current arrows (red/orange)
      const warmCurrentCoordinates = [
        [83.0, 8.5],
        [85.5, 11.0],
        [88.0, 13.5],
        [90.5, 15.2],
        [92.0, 16.0]
      ];

      const warmCurrent = viewer.entities.add({
        name: 'Warm Bay of Bengal Current',
        polyline: {
          positions: warmCurrentCoordinates.map(pt => Cesium.Cartesian3.fromDegrees(pt[0], pt[1], 1500)),
          width: 8,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#ff6b4a')
          )
        }
      });
      newEntities.push(warmCurrent);

      // Branching warm current loop
      const warmCurrentLoop = viewer.entities.add({
        name: 'Warm Coastal Gyre',
        polyline: {
          positions: [
            [84.5, 12.0],
            [87.0, 14.5],
            [90.0, 15.8],
            [88.5, 17.5],
            [85.5, 16.8]
          ].map(pt => Cesium.Cartesian3.fromDegrees(pt[0], pt[1], 1500)),
          width: 7,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#fa8c16')
          )
        }
      });
      newEntities.push(warmCurrentLoop);

      // 2. Cool cyclonic gyre currents around Sri Lanka (cyan/blue)
      const coolCurrentSriLanka = viewer.entities.add({
        name: 'Sri Lanka Dome Current',
        polyline: {
          positions: [
            [81.2, 6.5],
            [82.8, 8.0],
            [82.5, 10.5],
            [81.5, 11.2],
            [80.8, 9.8]
          ].map(pt => Cesium.Cartesian3.fromDegrees(pt[0], pt[1], 1500)),
          width: 7,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#00d4ff')
          )
        }
      });
      newEntities.push(coolCurrentSriLanka);

      // 3. Central Bay cool return current
      const coolReturnCurrent = viewer.entities.add({
        name: 'Bay of Bengal Gyre Return',
        polyline: {
          positions: [
            [92.5, 14.0],
            [90.5, 11.5],
            [87.5, 9.5],
            [84.5, 8.0]
          ].map(pt => Cesium.Cartesian3.fromDegrees(pt[0], pt[1], 1500)),
          width: 7,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#1890ff')
          )
        }
      });
      newEntities.push(coolReturnCurrent);

      // 4. Subsurface vertical upwelling arrow (cyan vertical vector rising from 1000m to 400m)
      const upwellingArrow = viewer.entities.add({
        name: 'Coastal Upwelling Vector',
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(82.5, 12.0, -1000 * visualScale),
            Cesium.Cartesian3.fromDegrees(82.5, 12.0, -350 * visualScale)
          ],
          width: 8,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#00ffff')
          )
        }
      });
      newEntities.push(upwellingArrow);

      // Subsurface horizontal flow arrows inside the cutaway volume
      const subsurfaceFlow = viewer.entities.add({
        name: 'Thermocline Subsurface Flow',
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(81.5, 7.5, -450 * visualScale),
            Cesium.Cartesian3.fromDegrees(85.5, 9.0, -500 * visualScale),
            Cesium.Cartesian3.fromDegrees(89.5, 10.5, -550 * visualScale)
          ],
          width: 6,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.fromCssColorString('#faad14')
          )
        }
      });
      newEntities.push(subsurfaceFlow);
    }

    // ==========================================
    // D. Geographic Country & Region Labels
    // ==========================================
    const geoLabels = [
      { text: 'INDIA', lon: 78.8, lat: 17.5, height: 4000, font: 'bold 20px Inter', color: '#ffffff' },
      { text: 'SRI LANKA', lon: 80.7, lat: 7.8, height: 3000, font: 'bold 16px Inter', color: '#ffffff' },
      { text: 'Bay of Bengal', lon: 88.5, lat: 14.8, height: 2000, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'BANGLADESH', lon: 90.2, lat: 23.8, height: 4000, font: 'bold 15px Inter', color: '#ffffff' },
      { text: 'MYANMAR', lon: 95.8, lat: 19.5, height: 4000, font: 'bold 16px Inter', color: '#ffffff' }
    ];

    geoLabels.forEach(lbl => {
      const labelEntity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lbl.lon, lbl.lat, lbl.height),
        label: {
          text: lbl.text,
          font: lbl.font,
          fillColor: Cesium.Color.fromCssColorString(lbl.color),
          outlineColor: Cesium.Color.fromCssColorString('#0a1628'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100000, 10000000)
        }
      });
      newEntities.push(labelEntity);
    });

    // ==========================================
    // E. 3D Submerged Sensor Platforms (Argo & Gliders)
    // ==========================================
    const allObservations = oceanDataService['generateDemoObservationData']({});

    allObservations.forEach(obs => {
      const isArgo = obs.platformType === 'argo';
      const isGlider = obs.platformType === 'glider';

      if (isArgo && !showArgo) return;
      if (isGlider && !showGliders) return;

      const isSelected = selectedObservationId === obs.id;
      const markerDepthMeters = -(obs.depth * visualScale);

      // Vertical Tether Profile Line from sea surface to submerged depth
      const tether = viewer.entities.add({
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(obs.longitude, obs.latitude, 0),
            Cesium.Cartesian3.fromDegrees(obs.longitude, obs.latitude, markerDepthMeters)
          ],
          width: isSelected ? 2.5 : 1.5,
          material: Cesium.Color.fromCssColorString(
            isSelected ? '#ffffff' : isArgo ? 'rgba(0, 212, 255, 0.45)' : 'rgba(244, 114, 182, 0.45)'
          )
        }
      });
      newEntities.push(tether);

      // Submerged Sensor Platform Marker
      const iconUri = isArgo ? createArgoIcon(isSelected) : createGliderIcon(isSelected);

      const markerEntity = viewer.entities.add({
        name: obs.platformId,
        position: Cesium.Cartesian3.fromDegrees(obs.longitude, obs.latitude, markerDepthMeters),
        billboard: {
          image: iconUri,
          scale: isSelected ? 1.25 : 0.95,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          heightReference: Cesium.HeightReference.NONE
        },
        label: {
          text: obs.platformId,
          font: isSelected ? 'bold 14px Inter' : '12px Inter',
          fillColor: isSelected ? Cesium.Color.fromCssColorString('#00d4ff') : Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#0a1628'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -26)
        }
      });

      // Attach raw observation data for click picking
      (markerEntity as any).observationData = obs;
      newEntities.push(markerEntity);
    });

    entitiesRef.current = newEntities;
  }, [
    isSceneReady,
    parameter,
    depth,
    showArgo,
    showGliders,
    showCurrents,
    verticalExaggeration,
    opacity,
    selectedObservationId,
    visualScale,
    maxDepthMeters,
    activeDepthMeters
  ]);

  // ==========================================
  // Camera Control Actions
  // ==========================================
  const handleZoom = (delta: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const camera = viewer.camera;
    if (delta > 0) {
      camera.zoomIn(camera.positionCartographic.height * 0.25);
    } else {
      camera.zoomOut(camera.positionCartographic.height * 0.25);
    }
  };

  const handleRotate = (angleDegrees: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(angleDegrees));
  };

  const handleResetCamera = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const preset = REGION_PRESETS.bay_of_bengal;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        preset.destination[0],
        preset.destination[1],
        preset.destination[2]
      ),
      orientation: {
        heading: Cesium.Math.toRadians(preset.heading),
        pitch: Cesium.Math.toRadians(preset.pitch),
        roll: Cesium.Math.toRadians(preset.roll)
      },
      duration: 1.5
    });
    if (onRegionChange) {
      onRegionChange('bay_of_bengal');
    }
  }, [onRegionChange]);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="cesium-ocean-scene-wrapper">
      {/* Primary Cesium WebGL Container */}
      <div ref={containerRef} className="cesium-viewport-container" />

      {/* Floating 3D Camera Controls Toolbar */}
      <div className="floating-camera-toolbar">
        <button 
          className="camera-tool-btn" 
          onClick={() => handleZoom(1)} 
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="camera-tool-btn" 
          onClick={() => handleZoom(-1)} 
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="camera-tool-btn" 
          onClick={() => handleRotate(15)} 
          title="Rotate Orbit"
        >
          <Compass size={16} />
        </button>
        <button 
          className="camera-tool-btn" 
          onClick={handleResetCamera} 
          title="Reset Reference 3D View"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          className="camera-tool-btn" 
          onClick={handleFullscreen} 
          title="Toggle Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Quick Ocean Basin Preset Buttons */}
      <div className="ocean-basin-pill-bar">
        {Object.entries(REGION_PRESETS).map(([key, item]) => (
          <button
            key={key}
            className={`basin-pill ${activeRegion === key ? 'active' : ''}`}
            onClick={() => onRegionChange && onRegionChange(key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Entity Hover Tooltip */}
      {hoveredEntity && (
        <div className="scene-hover-badge">
          <Eye size={13} className="hover-badge-icon" />
          <span>Click to inspect <strong>{hoveredEntity}</strong></span>
        </div>
      )}

      {/* Depth Stratification Legend Tag */}
      <div className="depth-scale-tag">
        <Layers size={13} />
        <span>Vertical Exaggeration: {verticalExaggeration}x (0m – 3000m)</span>
      </div>
    </div>
  );
}