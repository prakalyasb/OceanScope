import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import './CesiumMap.css';

function GeographicEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Earth sphere with realistic coloring */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          color="#1a4d6e"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* India landmass */}
      <mesh ref={earthRef} position={[0.8, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Sri Lanka */}
      <mesh ref={earthRef} position={[1.1, 0.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Myanmar */}
      <mesh ref={earthRef} position={[1.5, 0.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#2d5a3e" />
      </mesh>
      
      {/* Bay of Bengal water */}
      <mesh ref={earthRef} position={[1.2, 0.4, 0.3]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#1a4d6e" transparent opacity={0.7} />
      </mesh>
      
      {/* Arabian Sea water */}
      <mesh ref={earthRef} position={[0.2, 0.3, -0.4]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#1a4d6e" transparent opacity={0.7} />
      </mesh>
      
      {/* Region labels */}
      <Text
        position={[1.2, 0.8, 0.5]}
        fontSize={0.2}
        color="#00d4ff"
        anchorX="center"
      >
        Bay of Bengal
      </Text>
      
      <Text
        position={[0.3, 0.6, -0.6]}
        fontSize={0.18}
        color="#00d4ff"
        anchorX="center"
      >
        Arabian Sea
      </Text>
      
      <Text
        position={[0.8, 0.9, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
      >
        India
      </Text>
      
      <Text
        position={[1.1, 0.4, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
      >
        Sri Lanka
      </Text>
      
      <Text
        position={[1.5, 0.9, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
      >
        Myanmar
      </Text>
      
      {/* Selected region highlight */}
      <mesh ref={earthRef} position={[1, 0.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
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

export default function GeographicMap() {
  return (
    <div className="cesium-map-container">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        style={{ background: '#0a1628' }}
      >
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#87CEEB" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
        
        <GeographicEarth />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}