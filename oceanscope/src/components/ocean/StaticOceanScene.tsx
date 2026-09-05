import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './StaticOceanScene.css';

interface StaticOceanSceneProps {
  depth: number;
  opacity: number;
}

export default function StaticOceanScene({
  depth,
  opacity
}: StaticOceanSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x87CEEB, 1.0);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 0.6);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Ocean volume (simple box)
    const geometry = new THREE.BoxGeometry(10, 5, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90d9,
      transparent: true,
      opacity: opacity * 0.5,
      roughness: 0.4,
      metalness: 0.2
    });
    const oceanVolume = new THREE.Mesh(geometry, material);
    oceanVolume.position.set(0, -2.5, 0);
    scene.add(oceanVolume);

    // Ocean surface
    const surfaceGeometry = new THREE.PlaneGeometry(10, 10);
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90d9,
      transparent: true,
      opacity: opacity * 0.8,
      roughness: 0.3,
      metalness: 0.3,
      side: THREE.DoubleSide
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    surface.position.set(0, 0, 0);
    scene.add(surface);

    // Depth planes
    const depths = [0, 500, 1000, 2000, 3000];
    depths.forEach((d) => {
      const y = - (d / 3000) * 2.5;
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: d === depth ? 0x00d4ff : 0x0e4c66,
        wireframe: true,
        transparent: true,
        opacity: d === depth ? 0.3 : 0.1
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(0, y, 0);
      scene.add(plane);
    });

    // Bottom grid
    const gridGeometry = new THREE.PlaneGeometry(14, 14);
    const gridMaterial = new THREE.MeshStandardMaterial({
      color: 0x0e4c66,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, -5.1, 0);
    scene.add(grid);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [depth, opacity]);

  return (
    <div className="static-ocean-scene">
      <div ref={containerRef} className="scene-container" />
    </div>
  );
}