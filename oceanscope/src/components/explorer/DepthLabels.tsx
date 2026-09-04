import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DepthLabelsProps {
  currentDepth: number;
}

export default function DepthLabels({ currentDepth }: DepthLabelsProps) {
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
      // Make labels always face the camera
      groupRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      {levels.map((level, i) => (
        <group key={i}>
          {/* Depth contour plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level.y, 0]}>
            <planeGeometry args={[14, 14, 20, 20]} />
            <meshStandardMaterial
              color="#0e4c66"
              wireframe
              transparent
              opacity={0.08}
            />
          </mesh>
          
          {/* Depth label on the side */}
          <Text
            position={[-7.5, level.y, 0]}
            fontSize={0.35}
            color={level.depth === currentDepth ? '#00d4ff' : '#7a9cae'}
            anchorX="center"
            anchorY="middle"
          >
            {level.label}
          </Text>
          
          {/* Highlight current depth */}
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