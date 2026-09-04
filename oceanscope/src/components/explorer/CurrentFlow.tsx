import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CurrentFlow() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create realistic current flow paths
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
            
            // Rotate arrow to face direction
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
              {/* Large arrow body */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.1, 0.5, 8]} />
                <meshStandardMaterial 
                  color={path.color} 
                  emissive={path.color}
                  emissiveIntensity={0.4}
                />
              </mesh>
              {/* Arrow head */}
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