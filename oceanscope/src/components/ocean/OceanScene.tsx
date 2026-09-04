import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './OceanScene.css';

// Realistic ocean volume with depth-based temperature gradients
function OceanVolume({ depth }: { depth: number }) {
  // Depth parameter affects future visualization customization
  void depth;
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create realistic water column with depth-based gradients
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(16, 8, 16, 32, 16, 32);
    const positions = geo.attributes.position;
    const colors = [];
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedDepth = (y + 4) / 8; // Normalize from -4 to 4 range
      
      // Create realistic temperature gradient
      const tempColor = new THREE.Color();
      
      if (normalizedDepth > 0.75) {
        // Surface layer - warmest (red/orange)
        tempColor.setHSL(0.02 + (1 - normalizedDepth) * 0.03, 0.85, 0.55);
      } else if (normalizedDepth > 0.5) {
        // Thermocline - rapid temperature change
        tempColor.setHSL(0.55 + (0.75 - normalizedDepth) * 0.2, 0.8, 0.5);
      } else if (normalizedDepth > 0.25) {
        // Mid-depth - cooler (cyan/blue)
        tempColor.setHSL(0.58, 0.75, 0.45 + normalizedDepth * 0.2);
      } else {
        // Deep ocean - coldest (deep blue)
        tempColor.setHSL(0.62, 0.8, 0.3 + normalizedDepth * 0.3);
      }
      
      colors.push(tempColor.r, tempColor.g, tempColor.b);
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Subtle ocean motion
      meshRef.current.position.y = Math.sin(time * 0.2) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// Geographic map at the top of the scene
function GeographicMap() {
  return (
    <group position={[0, 2.5, -6]}>
      {/* Map base */}
      <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial
          color="#1a3a5c"
          transparent
          opacity={0.9}
          roughness={0.8}
        />
      </mesh>
      
      {/* Simplified land masses */}
      <group rotation={[-Math.PI / 2.5, 0, 0]}>
        {/* India */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshStandardMaterial color="#2d4a3e" transparent opacity={0.8} />
        </mesh>
        
        {/* Sri Lanka */}
        <mesh position={[2, 0.01, -1]}>
          <circleGeometry args={[0.5, 16]} />
          <meshStandardMaterial color="#2d4a3e" transparent opacity={0.8} />
        </mesh>
        
        {/* Myanmar */}
        <mesh position={[4, 0.01, 0]}>
          <planeGeometry args={[2, 1.5]} />
          <meshStandardMaterial color="#2d4a3e" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* Region labels */}
      <Text
        position={[0, 0.2, -4]}
        fontSize={0.4}
        color="#00d4ff"
        anchorX="center"
      >
        Bay of Bengal
      </Text>
      <Text
        position={[-5, 0.2, 2]}
        fontSize={0.35}
        color="#00d4ff"
        anchorX="center"
      >
        Arabian Sea
      </Text>
      <Text
        position={[0, 0.2, 2]}
        fontSize={0.3}
        color="#7a9cae"
        anchorX="center"
      >
        India
      </Text>
    </group>
  );
}

// Depth level indicators with contour lines
function DepthLevels({ currentDepth }: { currentDepth: number }) {
  const levels = [
    { depth: 0, label: '0m', y: 0 },
    { depth: 500, label: '500m', y: -0.8 },
    { depth: 1000, label: '1000m', y: -1.6 },
    { depth: 2000, label: '2000m', y: -2.4 },
    { depth: 3000, label: '3000m', y: -3.2 },
  ];

  return (
    <>
      {levels.map((level, i) => (
        <group key={i}>
          {/* Depth contour plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level.y, 0]}>
            <planeGeometry args={[16, 16, 20, 20]} />
            <meshStandardMaterial
              color="#0e4c66"
              wireframe
              transparent
              opacity={0.12}
            />
          </mesh>
          
          {/* Depth label */}
          <Text
            position={[-8, level.y, -8]}
            fontSize={0.25}
            color={level.depth === currentDepth ? '#00d4ff' : '#7a9cae'}
            anchorX="left"
            anchorY="middle"
          >
            {level.label}
          </Text>
          
          {/* Highlight current depth */}
          {level.depth === currentDepth && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level.y, 0]}>
              <planeGeometry args={[16, 16]} />
              <meshStandardMaterial
                color="#00d4ff"
                transparent
                opacity={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

// Realistic current arrows with flow animation
function CurrentArrows() {
  const arrows = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      position: [
        (Math.random() - 0.5) * 14,
        -Math.random() * 1.5,
        (Math.random() - 0.5) * 14
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.2 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((arrow: any, i) => {
        const data = arrows[i];
        const offset = Math.sin(time * data.speed + data.phase) * 0.1;
        arrow.position.x = data.position[0] + Math.cos(data.rotation) * offset;
        arrow.position.z = data.position[2] + Math.sin(data.rotation) * offset;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {arrows.map((arrow, i) => (
        <group key={i} position={arrow.position} rotation={[0, arrow.rotation, 0]}>
          {/* Curved arrow body */}
          <mesh>
            <cylinderGeometry args={[0.03, 0.05, 0.4, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#ff6b6b' : '#00d4ff'} 
              emissive={i % 2 === 0 ? '#ff6b6b' : '#00d4ff'}
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Arrow head */}
          <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#ff6b6b' : '#00d4ff'} 
              emissive={i % 2 === 0 ? '#ff6b6b' : '#00d4ff'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Argo float markers (diamonds) with realistic styling
function ArgoFloats({ selected }: { selected: boolean }) {
  // Selected parameter affects future styling customization
  void selected;
  const floats = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        -Math.random() * 2.5,
        (Math.random() - 0.5) * 12
      ] as [number, number, number],
      active: Math.random() > 0.3,
      id: `ARGO_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`
    }));
  }, []);

  return (
    <>
      {floats.map((float, i) => (
        <group key={i} position={float.position}>
          {/* Diamond shape */}
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial 
              color={float.active ? '#00d4ff' : '#5a7a8a'} 
              emissive={float.active ? '#00d4ff' : '#5a7a8a'}
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          
          {/* Active glow effect */}
          {float.active && (
            <>
              <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                  color="#00d4ff"
                  transparent
                  opacity={0.15}
                />
              </mesh>
              {/* Vertical line to surface */}
              <mesh>
                <cylinderGeometry args={[0.01, 0.01, 3, 8]} />
                <meshStandardMaterial
                  color="#00d4ff"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </>
          )}
        </group>
      ))}
    </>
  );
}

// Glider markers (triangles) with realistic styling
function Gliders() {
  const gliders = useMemo(() => {
    return Array.from({ length: 6 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        -Math.random() * 2,
        (Math.random() - 0.5) * 12
      ] as [number, number, number],
      id: `GLIDER_${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`
    }));
  }, []);

  return (
    <>
      {gliders.map((glider, i) => (
        <group key={i} position={glider.position}>
          {/* Triangle shape */}
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <tetrahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial 
              color="#f472b6" 
              emissive="#f472b6"
              emissiveIntensity={0.5}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          
          {/* Movement trail */}
          <mesh>
            <cylinderGeometry args={[0.01, 0.01, 1.5, 8]} />
            <meshStandardMaterial
              color="#f472b6"
              transparent
              opacity={0.2}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Water surface with subtle waves
function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const wave = Math.sin(x * 0.5 + time) * 0.1 + Math.cos(z * 0.3 + time * 0.8) * 0.05;
        positions.setY(i, wave);
      }
      
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[16, 16, 64, 64]} />
      <meshStandardMaterial
        color="#0066cc"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Coordinate grid with scientific styling
function CoordinateGrid() {
  return (
    <Grid
      args={[16, 16]}
      cellSize={1}
      cellThickness={0.2}
      cellColor="rgba(0, 212, 255, 0.08)"
      sectionSize={2}
      sectionThickness={0.4}
      sectionColor="rgba(0, 212, 255, 0.15)"
      fadeDistance={25}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid
    />
  );
}

interface OceanSceneProps {
  parameter?: string;
  showArgo?: boolean;
  showGliders?: boolean;
  depth?: number;
}

export default function OceanScene({ 
  parameter = 'temperature', 
  showArgo = true, 
  showGliders = false,
  depth = 1000 
}: OceanSceneProps) {
  // Parameter can be used for future visualization customization
  void parameter;

  return (
    <div className="ocean-scene-container">
      <Canvas
        camera={{ position: [10, 6, 10], fov: 55 }}
        style={{ background: '#0a1628' }}
      >
        <PerspectiveCamera makeDefault position={[10, 6, 10]} />
        
        {/* Lighting setup for realistic underwater effect */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#87CEEB" />
        <pointLight position={[8, 8, 8]} intensity={1} color="#00d4ff" />
        <pointLight position={[-8, 5, -8]} intensity={0.7} color="#2dd4bf" />
        <pointLight position={[0, -3, 0]} intensity={0.2} color="#4169E1" />
        
        {/* Scene elements */}
        <GeographicMap />
        <WaterSurface />
        <OceanVolume depth={depth} />
        <DepthLevels currentDepth={depth} />
        <CoordinateGrid />
        <CurrentArrows />
        {showArgo && <ArgoFloats selected={true} />}
        {showGliders && <Gliders />}
        
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