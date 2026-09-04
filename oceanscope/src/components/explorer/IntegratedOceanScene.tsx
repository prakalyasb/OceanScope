import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import './IntegratedOceanScene.css';

interface IntegratedOceanSceneProps {
  parameter: string;
  depth: number;
  showArgo: boolean;
  showGliders: boolean;
  showCurrents: boolean;
  verticalExaggeration: number;
  opacity: number;
}

// Geographic map background with correct orientation
function GeographicMapBackground() {
  const mapRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (mapRef.current) {
      // Subtle slow rotation for visual interest
      mapRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.02;
    }
  });

  return (
    <group ref={mapRef} position={[0, 3, -8]}>
      {/* Ocean base surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a4d6e"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* India landmass */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Sri Lanka */}
      <mesh position={[2.5, 0.1, -1]}>
        <circleGeometry args={[0.7, 16]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Myanmar */}
      <mesh position={[4, 0.1, 1.5]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Bangladesh */}
      <mesh position={[3.5, 0.1, 2.5]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Region labels - always facing camera */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
      >
        India
      </Text>
      
      <Text
        position={[2.5, 0.3, -1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
      >
        Sri Lanka
      </Text>
      
      <Text
        position={[4, 0.3, 1.5]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
      >
        Myanmar
      </Text>
      
      <Text
        position={[-3, 0.3, 0]}
        fontSize={0.35}
        color="#00d4ff"
        anchorX="center"
      >
        Arabian Sea
      </Text>
      
      <Text
        position={[3, 0.3, 3]}
        fontSize={0.35}
        color="#00d4ff"
        anchorX="center"
      >
        Bay of Bengal
      </Text>
      
      {/* Selected region highlight */}
      <mesh position={[1, 0.05, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Ocean surface with realistic waves
function OceanSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const wave = 
          Math.sin(x * 0.3 + time * 0.8) * 0.1 + 
          Math.cos(z * 0.2 + time * 0.6) * 0.08;
        positions.setY(i, wave);
      }
      
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[14, 14, 64, 64]} />
      <meshStandardMaterial
        color="#4a90d9"
        transparent
        opacity={0.7}
        roughness={0.15}
        metalness={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Underwater cross-section with depth-based gradients
function UnderwaterCrossSection({ parameter }: { parameter: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getGradientColors = () => {
    switch (parameter) {
      case 'temperature':
        return [
          new THREE.Color('#ff6b6b'),
          new THREE.Color('#fbbf24'),
          new THREE.Color('#2dd4bf'),
          new THREE.Color('#00d4ff'),
          new THREE.Color('#0066cc')
        ];
      case 'salinity':
        return [
          new THREE.Color('#a3e635'),
          new THREE.Color('#4ade80'),
          new THREE.Color('#2dd4bf'),
          new THREE.Color('#00d4ff'),
          new THREE.Color('#1e3a5f')
        ];
      default:
        return [
          new THREE.Color('#ff6b6b'),
          new THREE.Color('#fbbf24'),
          new THREE.Color('#2dd4bf'),
          new THREE.Color('#00d4ff'),
          new THREE.Color('#0066cc')
        ];
    }
  };

  const gradientColors = getGradientColors();

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(14, 6, 14, 50, 25, 50);
    const positions = geo.attributes.position;
    const colors = [];
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedDepth = (y + 3) / 6;
      
      const colorIndex = Math.min(Math.floor(normalizedDepth * 4), 4);
      const colorFraction = (normalizedDepth * 4) % 1;
      
      const tempColor = new THREE.Color();
      tempColor.lerpColors(gradientColors[colorIndex], gradientColors[Math.min(colorIndex + 1, 4)], colorFraction);
      
      colors.push(tempColor.r, tempColor.g, tempColor.b);
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [parameter]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.12) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        roughness={0.25}
        metalness={0.1}
      />
    </mesh>
  );
}

// Depth levels with labels
function DepthLevels({ currentDepth }: { currentDepth: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const levels = [
    { depth: 0, label: '0m', y: 0 },
    { depth: 500, label: '500m', y: -0.75 },
    { depth: 1000, label: '1000m', y: -1.5 },
    { depth: 2000, label: '2000m', y: -2.25 },
    { depth: 3000, label: '3000m', y: -3 },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      {levels.map((level, i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level.y, 0]}>
            <planeGeometry args={[14, 14, 20, 20]} />
            <meshStandardMaterial
              color="#0e4c66"
              wireframe
              transparent
              opacity={0.08}
            />
          </mesh>
          
          <Text
            position={[-7.5, level.y, 0]}
            fontSize={0.35}
            color={level.depth === currentDepth ? '#00d4ff' : '#7a9cae'}
            anchorX="center"
            anchorY="middle"
          >
            {level.label}
          </Text>
          
          {level.depth === currentDepth && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level.y, 0]}>
              <planeGeometry args={[14, 14]} />
              <meshStandardMaterial
                color="#00d4ff"
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Animated current arrows
function CurrentFlows() {
  const groupRef = useRef<THREE.Group>(null);
  
  const currentPaths = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      points: Array.from({ length: 6 }, (_, j) => ({
        position: [
          -5 + (j * 2) + (Math.random() - 0.5) * 2,
          -0.3 - (i * 0.4) - Math.random() * 0.5,
          -4 + (j * 1.5) + (Math.random() - 0.5) * 2
        ] as [number, number, number],
        speed: 0.4 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      })),
      color: i % 2 === 0 ? '#ff6b6b' : '#00d4ff'
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      currentPaths.forEach((path, pathIndex) => {
        const group = groupRef.current?.children[pathIndex] as THREE.Group;
        if (group) {
          group.children.forEach((arrow: any, i) => {
            const currentPoint = path.points[i];
            const nextPoint = path.points[(i + 1) % path.points.length];
            
            const offset = (time * currentPoint.speed + currentPoint.phase) % 1;
            
            arrow.position.x = currentPoint.position[0] + (nextPoint.position[0] - currentPoint.position[0]) * offset;
            arrow.position.y = currentPoint.position[1] + (nextPoint.position[1] - currentPoint.position[1]) * offset;
            arrow.position.z = currentPoint.position[2] + (nextPoint.position[2] - currentPoint.position[2]) * offset;
            
            const dx = nextPoint.position[0] - currentPoint.position[0];
            const dz = nextPoint.position[2] - currentPoint.position[2];
            arrow.rotation.y = Math.atan2(dx, dz);
          });
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {currentPaths.map((path, i) => (
        <group key={i}>
          {path.points.map((point, j) => (
            <group key={j} position={point.position as [number, number, number]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.1, 0.5, 8]} />
                <meshStandardMaterial 
                  color={path.color} 
                  emissive={path.color}
                  emissiveIntensity={0.4}
                />
              </mesh>
              <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[0.12, 0.2, 8]} />
                <meshStandardMaterial 
                  color={path.color} 
                  emissive={path.color}
                  emissiveIntensity={0.5}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// Argo and Glider markers
function ObservationMarkers({ type, show }: { type: 'argo' | 'glider'; show: boolean }) {
  if (!show) return null;
  
  const argoPositions = useMemo(() => [
    { position: [-3, -0.5, 2] as [number, number, number], id: 'ARGO_IND_0045' },
    { position: [2, -1.2, -1] as [number, number, number], id: 'ARGO_IND_0089' },
    { position: [-1, -2, 3] as [number, number, number], id: 'ARGO_IND_0123' },
    { position: [4, -0.8, 1] as [number, number, number], id: 'ARGO_IND_0156' },
  ], []);

  const gliderPositions = useMemo(() => [
    { position: [3, -1, -2] as [number, number, number], id: 'GLIDER_023' },
    { position: [-4, -0.3, 1] as [number, number, number], id: 'GLIDER_041' },
  ], []);

  const markers = type === 'argo' ? argoPositions : gliderPositions;
  const markerColor = type === 'argo' ? '#00d4ff' : '#f472b6';

  return (
    <>
      {markers.map((marker, i) => (
        <group key={i} position={marker.position}>
          {type === 'argo' ? (
            <>
              <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial 
                  color={markerColor} 
                  emissive={markerColor}
                  emissiveIntensity={0.6}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              
              <mesh position={[0, marker.position[1] / 2, 0]}>
                <cylinderGeometry args={[0.012, 0.012, Math.abs(marker.position[1]), 8]} />
                <meshStandardMaterial
                  color={markerColor}
                  transparent
                  opacity={0.4}
                />
              </mesh>
              
              <mesh position={[0, -marker.position[1], 0]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial
                  color={markerColor}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </>
          ) : (
            <>
              <mesh rotation={[0, Math.PI / 4, 0]}>
                <tetrahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial 
                  color={markerColor} 
                  emissive={markerColor}
                  emissiveIntensity={0.5}
                  roughness={0.3}
                  metalness={0.7}
                />
              </mesh>
              
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
                <meshStandardMaterial
                  color={markerColor}
                  transparent
                  opacity={0.25}
                />
              </mesh>
            </>
          )}
        </group>
      ))}
    </>
  );
}

export default function IntegratedOceanScene({
  parameter,
  depth,
  showArgo,
  showGliders,
  showCurrents,
  verticalExaggeration,
  opacity
}: IntegratedOceanSceneProps) {
  // Suppress unused parameter warnings for future implementation
  void verticalExaggeration;
  void opacity;
  
  return (
    <div className="integrated-ocean-scene">
      <Canvas
        camera={{ position: [10, 6, 10], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2744 50%, #1a3a5c 100%)' }}
      >
        <PerspectiveCamera makeDefault position={[10, 6, 10]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 15, 5]} intensity={1.0} color="#87CEEB" />
        <pointLight position={[8, 8, 8]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-8, 4, -8]} intensity={0.4} color="#2dd4bf" />
        <pointLight position={[0, -5, 0]} intensity={0.3} color="#4169E1" />
        
        <GeographicMapBackground />
        <OceanSurface />
        <UnderwaterCrossSection parameter={parameter} />
        <DepthLevels currentDepth={depth} />
        {showCurrents && <CurrentFlows />}
        <ObservationMarkers type="argo" show={showArgo} />
        <ObservationMarkers type="glider" show={showGliders} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0.1}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}