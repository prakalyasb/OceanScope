import { useMemo } from 'react';

interface ObservationMarkersProps {
  type: 'argo' | 'glider';
}

export default function ObservationMarkers({ type }: ObservationMarkersProps) {
  // Realistic observation positions around Indian Ocean
  const argoPositions = useMemo(() => [
    { position: [-3, -0.5, 2] as [number, number, number], id: 'ARGO_0012' },
    { position: [2, -1.2, -1] as [number, number, number], id: 'ARGO_0045' },
    { position: [-1, -2, 3] as [number, number, number], id: 'ARGO_0089' },
    { position: [4, -0.8, 1] as [number, number, number], id: 'ARGO_0123' },
    { position: [-2, -1.5, -2] as [number, number, number], id: 'ARGO_0156' },
    { position: [1, -2.2, 2] as [number, number, number], id: 'ARGO_0189' },
    { position: [3, -0.3, -3] as [number, number, number], id: 'ARGO_0234' },
    { position: [-4, -1.8, 0] as [number, number, number], id: 'ARGO_0267' },
  ], []);

  const gliderPositions = useMemo(() => [
    { position: [3, -1, -2] as [number, number, number], id: 'GLIDER_023' },
    { position: [-4, -0.3, 1] as [number, number, number], id: 'GLIDER_041' },
    { position: [0, -1.8, 3] as [number, number, number], id: 'GLIDER_056' },
    { position: [2, -2.5, -1] as [number, number, number], id: 'GLIDER_078' },
  ], []);

  const markers = type === 'argo' ? argoPositions : gliderPositions;
  const markerColor = type === 'argo' ? '#00d4ff' : '#f472b6';

  return (
    <>
      {markers.map((marker, i) => (
        <group key={i} position={marker.position}>
          {type === 'argo' ? (
            // Diamond shape for Argo floats
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
              
              {/* Vertical line to surface */}
              <mesh position={[0, marker.position[1] / 2, 0]}>
                <cylinderGeometry args={[0.012, 0.012, Math.abs(marker.position[1]), 8]} />
                <meshStandardMaterial
                  color={markerColor}
                  transparent
                  opacity={0.4}
                />
              </mesh>
              
              {/* Surface marker */}
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
            // Triangle shape for Gliders
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
              
              {/* Movement trail */}
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