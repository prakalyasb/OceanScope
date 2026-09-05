import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { INDIA_SHAPE, GEOGRAPHIC_LABELS } from '../../data/indiaGeoData';
import type { ObservationData } from '../../services/OceanDataService';
import './BroadOceanVisualization.css';

interface BroadOceanVisualizationProps {
  depth: number;
  verticalExaggeration: number;
  showCurrents: boolean;
  showMarkers: boolean;
  onMarkerClick?: (observation: ObservationData) => void;
}

// Create map geometry from coordinates
function createMapGeometry(coordinates: number[][]) {
  const shape = new THREE.Shape();
  shape.moveTo(coordinates[0][0], coordinates[0][1]);
  for (let i = 1; i < coordinates.length; i++) {
    shape.lineTo(coordinates[i][0], coordinates[i][1]);
  }
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  return geometry;
}

// Temperature gradient texture
function createTemperatureGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#000080');
    gradient.addColorStop(0.3, '#0000ff');
    gradient.addColorStop(0.5, '#00ffff');
    gradient.addColorStop(0.7, '#00ff00');
    gradient.addColorStop(0.85, '#ffff00');
    gradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Ocean depth layers
function OceanDepthLayers({ depth, verticalExaggeration }: { depth: number; verticalExaggeration: number }) {
  const depthLevels = [0, 500, 1000, 2000, 3000];
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 40, 100, 100), []);
  const tempTexture = useMemo(() => createTemperatureGradient(), []);
  
  return (
    <group>
      {depthLevels.map((d) => {
        const yOffset = -(d / 3000) * verticalExaggeration * 5;
        const opacity = d <= depth ? 0.6 : 0.2;
        
        return (
          <group key={d}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yOffset, 0]}>
              <primitive object={geometry} attach="geometry" />
              <meshStandardMaterial
                map={tempTexture}
                transparent
                opacity={opacity}
                roughness={0.6}
                metalness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            <Text
              position={[-25, yOffset + 0.5, -15]}
              fontSize={0.5}
              color="#00d4ff"
              anchorX="left"
            >
              {d}m
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Ocean surface
function OceanSurface() {
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 40, 100, 100), []);
  const tempTexture = useMemo(() => createTemperatureGradient(), []);
  const indiaGeometry = useMemo(() => createMapGeometry(INDIA_SHAPE), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          map={tempTexture}
          transparent
          opacity={0.8}
          roughness={0.5}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <primitive object={indiaGeometry} attach="geometry" />
        <meshStandardMaterial
          color="#2d5a3e"
          transparent
          opacity={0.7}
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {GEOGRAPHIC_LABELS.map((label, i) => (
        <Text
          key={i}
          position={[label.position[0] - 78, 0.5, label.position[1] - 20]}
          fontSize={label.type === 'ocean' ? 0.3 : label.type === 'country' ? 0.25 : 0.2}
          color={label.type === 'ocean' ? '#00d4ff' : label.type === 'country' ? '#ffffff' : '#7a9cae'}
          anchorX="center"
        >
          {label.name}
        </Text>
      ))}
    </group>
  );
}

// Ocean currents
function OceanCurrents({ showCurrents }: { showCurrents: boolean }) {
  const currents = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 30;
      const angle = Math.random() * Math.PI * 2;
      const magnitude = 0.5 + Math.random() * 1.5;
      arr.push({ x, z, angle, magnitude });
    }
    return arr;
  }, []);

  if (!showCurrents) return null;

  return (
    <group>
      {currents.map((current, i) => (
        <group key={i} position={[current.x, 0.2, current.z]} rotation={[0, current.angle, 0]}>
          <mesh position={[0, 0, current.magnitude / 2]}>
            <cylinderGeometry args={[0.05, 0.05, current.magnitude, 8]} />
            <meshStandardMaterial color="#00d4ff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, current.magnitude]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color="#00d4ff" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Observation markers
function ObservationMarkers({ showMarkers, onClick }: { showMarkers: boolean; onClick?: (observation: ObservationData) => void }) {
  const markers = useMemo(() => {
    return [
      { id: 'ARGO-2900123', lat: 15, lon: 75, type: 'argo', depth: 250 },
      { id: 'GLIDER-SG567', lat: 18, lon: 88, type: 'glider', depth: 150 },
      { id: 'CTD-789', lat: 12, lon: 80, type: 'ctd', depth: 500 },
      { id: 'BGC-123', lat: 10, lon: 85, type: 'bgc', depth: 100 },
      { id: 'MOORING-456', lat: 14, lon: 82, type: 'mooring', depth: 1000 },
      { id: 'ADCP-789', lat: 16, lon: 84, type: 'adcp', depth: 300 }
    ];
  }, []);

  if (!showMarkers) return null;


  const handleMarkerClick = (marker: any) => {
    if (onClick) {
      const observation: ObservationData = {
        id: marker.id,
        platformId: marker.id,
        platformType: marker.type as any,
        latitude: marker.lat,
        longitude: marker.lon,
        timestamp: new Date(),
        depth: marker.depth,
        variables: {
          temperature: 25 + Math.random() * 5,
          salinity: 34 + Math.random() * 2,
          oxygen: 5 + Math.random() * 2,
          chlorophyll: Math.random() * 2
        }
      };
      onClick(observation);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'argo': return '#f97316';
      case 'glider': return '#2dd4bf';
      case 'ctd': return '#a855f7';
      case 'bgc': return '#10b981';
      case 'mooring': return '#fbbf24';
      case 'adcp': return '#ec4899';
      default: return '#00d4ff';
    }
  };

  return (
    <group>
      {markers.map((marker, i) => (
        <group key={i} position={[marker.lon - 78, 0.5, marker.lat - 20]}>
          <mesh onClick={() => handleMarkerClick(marker)}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color={getMarkerColor(marker.type)}
              emissive={getMarkerColor(marker.type)}
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
          >
            {marker.type.toUpperCase()}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function BroadOceanVisualization({
  depth,
  verticalExaggeration,
  showCurrents,
  showMarkers,
  onMarkerClick
}: BroadOceanVisualizationProps) {
  return (
    <div className="broad-ocean-visualization">
      <Canvas
        camera={{ position: [0, 30, 40], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2744 100%)' }}
      >
        <PerspectiveCamera makeDefault position={[0, 30, 40]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 30, 10]} intensity={1.2} color="#87CEEB" />
        <pointLight position={[10, 20, 10]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-10, 15, -10]} intensity={0.4} color="#2dd4bf" />

        <OceanSurface />
        <OceanDepthLayers depth={depth} verticalExaggeration={verticalExaggeration} />
        <OceanCurrents showCurrents={showCurrents} />
        <ObservationMarkers showMarkers={showMarkers} onClick={onMarkerClick} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={20}
          maxDistance={80}
        />
      </Canvas>
    </div>
  );
}