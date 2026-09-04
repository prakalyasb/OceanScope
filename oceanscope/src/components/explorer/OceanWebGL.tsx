import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import OceanSurface from './OceanSurface';
import OceanVolume from './OceanVolume';
import CurrentFlow from './CurrentFlow';
import ObservationMarkers from './ObservationMarkers';
import DepthLabels from './DepthLabels';
import './OceanWebGL.css';

interface OceanWebGLProps {
  parameter: string;
  depth: number;
  showArgo: boolean;
  showGliders: boolean;
  showCurrents: boolean;
}

export default function OceanWebGL({
  parameter,
  depth,
  showArgo,
  showGliders,
  showCurrents
}: OceanWebGLProps) {
  return (
    <div className="ocean-webgl-container">
      <Canvas
        camera={{ position: [8, 6, 10], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2744 100%)' }}
      >
        <PerspectiveCamera makeDefault position={[8, 6, 10]} />
        
        {/* Lighting for underwater effect */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 15, 5]} intensity={1.0} color="#87CEEB" />
        <pointLight position={[8, 8, 8]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-8, 4, -8]} intensity={0.4} color="#2dd4bf" />
        <pointLight position={[0, -5, 0]} intensity={0.3} color="#4169E1" />
        
        {/* Ocean components */}
        <OceanSurface />
        <OceanVolume parameter={parameter} depth={depth} />
        <DepthLabels currentDepth={depth} />
        {showCurrents && <CurrentFlow />}
        {showArgo && <ObservationMarkers type="argo" />}
        {showGliders && <ObservationMarkers type="glider" />}
        
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