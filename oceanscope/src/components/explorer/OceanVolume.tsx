import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OceanVolumeProps {
  parameter: string;
  depth: number;
}

export default function OceanVolume({ parameter, depth }: OceanVolumeProps) {
  // Depth parameter for future customization
  void depth;
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Get color gradient based on parameter
  const getGradientColors = () => {
    switch (parameter) {
      case 'temperature':
        return [
          new THREE.Color('#ff6b6b'), // Surface - warm
          new THREE.Color('#fbbf24'), // Upper thermocline
          new THREE.Color('#2dd4bf'), // Mid-depth
          new THREE.Color('#00d4ff'), // Lower
          new THREE.Color('#0066cc')  // Deep
        ];
      case 'salinity':
        return [
          new THREE.Color('#a3e635'),
          new THREE.Color('#4ade80'),
          new THREE.Color('#2dd4bf'),
          new THREE.Color('#00d4ff'),
          new THREE.Color('#1e3a5f')
        ];
      case 'chlorophyll':
        return [
          new THREE.Color('#22c55e'),
          new THREE.Color('#16a34a'),
          new THREE.Color('#15803d'),
          new THREE.Color('#14532d'),
          new THREE.Color('#052e16')
        ];
      case 'currentSpeed':
        return [
          new THREE.Color('#8b5cf6'),
          new THREE.Color('#6366f1'),
          new THREE.Color('#3b82f6'),
          new THREE.Color('#0ea5e9'),
          new THREE.Color('#0284c7')
        ];
      case 'waveHeight':
        return [
          new THREE.Color('#f97316'),
          new THREE.Color('#fb923c'),
          new THREE.Color('#fdba74'),
          new THREE.Color('#fed7aa'),
          new THREE.Color('#0066cc')
        ];
      case 'dissolvedOxygen':
        return [
          new THREE.Color('#3b82f6'),
          new THREE.Color('#06b6d4'),
          new THREE.Color('#14b8a6'),
          new THREE.Color('#10b981'),
          new THREE.Color('#059669')
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

  // Create realistic water column geometry with depth-based coloring
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(14, 6, 14, 50, 25, 50);
    const positions = geo.attributes.position;
    const colors = [];
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedDepth = (y + 3) / 6; // Normalize from -3 to 3 range
      
      // Create smooth gradient between color stops
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
      // Subtle ocean movement
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