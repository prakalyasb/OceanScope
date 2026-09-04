import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OceanSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        // Create realistic wave motion with multiple frequencies
        const wave = 
          Math.sin(x * 0.3 + time * 0.8) * 0.12 + 
          Math.cos(z * 0.2 + time * 0.6) * 0.08 +
          Math.sin((x + z) * 0.15 + time * 0.4) * 0.05;
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