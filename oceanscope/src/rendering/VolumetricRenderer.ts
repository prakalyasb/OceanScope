// Volumetric 3D rendering for ocean model fields
import * as THREE from 'three';

export interface VolumeData {
  dimensions: {
    x: number;
    y: number;
    z: number;
  };
  spacing: {
    x: number;
    y: number;
    z: number;
  };
  values: Float32Array;
  bounds: {
    min: number;
    max: number;
  };
  timestamps: Date[];
}

export interface RenderOptions {
  colorMap: ColorMap;
  opacity: number;
  isosurfaceValue?: number;
  depthSlice?: number;
  verticalExaggeration: number;
  showWireframe: boolean;
}

export type ColorMap = 
  | 'temperature' 
  | 'salinity' 
  | 'chlorophyll' 
  | 'currentSpeed' 
  | 'waveHeight' 
  | 'dissolvedOxygen'
  | 'custom';

export class VolumetricRenderer {
  private scene: THREE.Scene;
  private volumeMesh?: THREE.Mesh;
  private isosurfaceMesh?: THREE.Mesh;
  private depthSliceMesh?: THREE.Mesh;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  // Generate color gradient for colormap
  private getColorMap(colorMap: ColorMap, value: number, min: number, max: number): THREE.Color {
    const normalized = (value - min) / (max - min);
    
    switch (colorMap) {
      case 'temperature':
        // Blue → Cyan → Yellow → Red
        if (normalized < 0.33) {
          return new THREE.Color().lerpColors(
            new THREE.Color('#0066cc'),
            new THREE.Color('#00d4ff'),
            normalized / 0.33
          );
        } else if (normalized < 0.66) {
          return new THREE.Color().lerpColors(
            new THREE.Color('#00d4ff'),
            new THREE.Color('#fbbf24'),
            (normalized - 0.33) / 0.33
          );
        } else {
          return new THREE.Color().lerpColors(
            new THREE.Color('#fbbf24'),
            new THREE.Color('#ff6b6b'),
            (normalized - 0.66) / 0.34
          );
        }
        
      case 'salinity':
        // Green → Cyan → Blue
        return new THREE.Color().lerpColors(
          new THREE.Color('#4ade80'),
          new THREE.Color('#0066cc'),
          normalized
        );
        
      case 'chlorophyll':
        // Dark green → Light green
        return new THREE.Color().lerpColors(
          new THREE.Color('#134e4a'),
          new THREE.Color('#22c55e'),
          normalized
        );
        
      case 'currentSpeed':
        // Purple → Blue
        return new THREE.Color().lerpColors(
          new THREE.Color('#8b5cf6'),
          new THREE.Color('#0284c7'),
          normalized
        );
        
      case 'waveHeight':
        // Orange → Blue
        return new THREE.Color().lerpColors(
          new THREE.Color('#f97316'),
          new THREE.Color('#0066cc'),
          normalized
        );
        
      case 'dissolvedOxygen':
        // Blue → Green
        return new THREE.Color().lerpColors(
          new THREE.Color('#3b82f6'),
          new THREE.Color('#10b981'),
          normalized
        );
        
      default:
        return new THREE.Color('#00d4ff');
    }
  }
  
  // Render volumetric data
  renderVolume(data: VolumeData, options: RenderOptions) {
    // Remove existing meshes
    this.clear();
    
    const { dimensions, spacing, values, bounds } = data;
    const { colorMap, opacity, verticalExaggeration, showWireframe } = options;
    
    // Create geometry with vertical exaggeration
    const geometry = new THREE.BoxGeometry(
      dimensions.x * spacing.x,
      dimensions.y * spacing.y * verticalExaggeration,
      dimensions.z * spacing.z,
      dimensions.x,
      dimensions.y,
      dimensions.z
    );
    
    const positions = geometry.attributes.position;
    const colors = [];
    
    // Apply colormap to vertices
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Map position to data index
      const ix = Math.floor((x / (dimensions.x * spacing.x) + 0.5) * dimensions.x);
      const iy = Math.floor((y / (dimensions.y * spacing.y * verticalExaggeration) + 0.5) * dimensions.y);
      const iz = Math.floor((z / (dimensions.z * spacing.z) + 0.5) * dimensions.z);
      
      const index = ix + iy * dimensions.x + iz * dimensions.x * dimensions.y;
      const value = values[index] || bounds.min;
      
      const color = this.getColorMap(colorMap, value, bounds.min, bounds.max);
      colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.1,
      wireframe: showWireframe
    });
    
    this.volumeMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.volumeMesh);
    
    // Render isosurface if specified
    if (options.isosurfaceValue !== undefined) {
      this.renderIsosurface(data, options);
    }
    
    // Render depth slice if specified
    if (options.depthSlice !== undefined) {
      this.renderDepthSlice(data, options);
    }
  }
  
  // Extract and render isosurface
  private renderIsosurface(data: VolumeData, options: RenderOptions) {
    const { dimensions, spacing, values, bounds } = data;
    const { colorMap, isosurfaceValue, verticalExaggeration } = options;
    
    if (isosurfaceValue === undefined) return;
    
    // Marching cubes algorithm for isosurface extraction
    const triangles = this.marchingCubes(values, dimensions, isosurfaceValue);
    
    if (triangles.length === 0) return;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(triangles.length * 3);
    const colors = new Float32Array(triangles.length * 3);
    
    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      positions[i * 3] = triangle.x * spacing.x;
      positions[i * 3 + 1] = triangle.y * spacing.y * verticalExaggeration;
      positions[i * 3 + 2] = triangle.z * spacing.z;
      
      const color = this.getColorMap(colorMap, isosurfaceValue, bounds.min, bounds.max);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.3
    });
    
    this.isosurfaceMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.isosurfaceMesh);
  }
  
  // Simplified marching cubes implementation
  private marchingCubes(values: Float32Array, dimensions: { x: number; y: number; z: number }, isoValue: number): Array<{ x: number; y: number; z: number }> {
    const triangles: Array<{ x: number; y: number; z: number }> = [];
    
    // Simplified implementation - iterate through voxels
    for (let y = 0; y < dimensions.y - 1; y++) {
      for (let z = 0; z < dimensions.z - 1; z++) {
        for (let x = 0; x < dimensions.x - 1; x++) {
          const cube = this.getCubeValues(values, dimensions, x, y, z);
          const cubeIndex = this.getCubeIndex(cube, isoValue);
          
          if (cubeIndex > 0 && cubeIndex < 255) {
            // Generate triangles for this cube
            this.triangulateCube(x, y, z, cubeIndex, isoValue, cube, triangles);
          }
        }
      }
    }
    
    return triangles;
  }
  
  private getCubeValues(values: Float32Array, dimensions: { x: number; y: number; z: number }, x: number, y: number, z: number): number[] {
    const indices = [
      (y) * dimensions.x * dimensions.z + (z) * dimensions.x + (x),
      (y) * dimensions.x * dimensions.z + (z) * dimensions.x + (x + 1),
      (y + 1) * dimensions.x * dimensions.z + (z) * dimensions.x + (x + 1),
      (y + 1) * dimensions.x * dimensions.z + (z) * dimensions.x + (x),
      (y) * dimensions.x * dimensions.z + (z + 1) * dimensions.x + (x),
      (y) * dimensions.x * dimensions.z + (z + 1) * dimensions.x + (x + 1),
      (y + 1) * dimensions.x * dimensions.z + (z + 1) * dimensions.x + (x + 1),
      (y + 1) * dimensions.x * dimensions.z + (z + 1) * dimensions.x + (x)
    ];
    
    return indices.map(i => values[i]);
  }
  
  private getCubeIndex(cube: number[], isoValue: number): number {
    let index = 0;
    for (let i = 0; i < 8; i++) {
      if (cube[i] > isoValue) {
        index |= (1 << i);
      }
    }
    return index;
  }
  
  private triangulateCube(x: number, y: number, z: number, _cubeIndex: number, isoValue: number, cube: number[], triangles: Array<{ x: number; y: number; z: number }>) {
    // Simplified triangulation - add basic triangles
    // Full implementation would use marching cubes lookup tables
    const edgeTable = this.getEdgeIntersections(cube, isoValue);
    
    // Add triangles based on edge intersections
    for (let i = 0; i < edgeTable.length; i += 3) {
      const v1 = edgeTable[i];
      const v2 = edgeTable[i + 1];
      const v3 = edgeTable[i + 2];
      
      if (v1 && v2 && v3) {
        triangles.push(
          { x: x + v1.x, y: y + v1.y, z: z + v1.z },
          { x: x + v2.x, y: y + v2.y, z: z + v2.z },
          { x: x + v3.x, y: y + v3.y, z: z + v3.z }
        );
      }
    }
  }
  
  private getEdgeIntersections(cube: number[], isoValue: number): Array<{ x: number; y: number; z: number } | null> {
    // Simplified edge intersection calculation
    const intersections: Array<{ x: number; y: number; z: number } | null> = [];
    
    for (let i = 0; i < 12; i++) {
      const v1 = cube[this.edgeVertices[i][0]];
      const v2 = cube[this.edgeVertices[i][1]];
      
      if ((v1 > isoValue && v2 < isoValue) || (v1 < isoValue && v2 > isoValue)) {
        const t = (isoValue - v1) / (v2 - v1);
        const p1 = this.vertexPositions[this.edgeVertices[i][0]];
        const p2 = this.vertexPositions[this.edgeVertices[i][1]];
        
        intersections.push({
          x: p1.x + t * (p2.x - p1.x),
          y: p1.y + t * (p2.y - p1.y),
          z: p1.z + t * (p2.z - p1.z)
        });
      } else {
        intersections.push(null);
      }
    }
    
    return intersections;
  }
  
  private edgeVertices = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  
  private vertexPositions = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 0, y: 1, z: 1 }
  ];
  
  // Render depth slice
  private renderDepthSlice(data: VolumeData, options: RenderOptions) {
    const { dimensions, spacing, values, bounds } = data;
    const { colorMap, depthSlice, verticalExaggeration } = options;
    
    if (depthSlice === undefined) return;
    
    const sliceGeometry = new THREE.PlaneGeometry(
      dimensions.x * spacing.x,
      dimensions.z * spacing.z,
      dimensions.x,
      dimensions.z
    );
    
    const positions = sliceGeometry.attributes.position;
    const colors = [];
    
    const yIndex = Math.floor((depthSlice / (dimensions.y * spacing.y)) * dimensions.y);
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const ix = Math.floor((x / (dimensions.x * spacing.x) + 0.5) * dimensions.x);
      const iz = Math.floor((z / (dimensions.z * spacing.z) + 0.5) * dimensions.z);
      
      const index = ix + yIndex * dimensions.x + iz * dimensions.x * dimensions.y;
      const value = values[index] || bounds.min;
      
      const color = this.getColorMap(colorMap, value, bounds.min, bounds.max);
      colors.push(color.r, color.g, color.b);
    }
    
    sliceGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.1
    });
    
    this.depthSliceMesh = new THREE.Mesh(sliceGeometry, material);
    this.depthSliceMesh.position.y = depthSlice * verticalExaggeration;
    this.depthSliceMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.depthSliceMesh);
  }
  
  // Clear all rendered meshes
  clear() {
    if (this.volumeMesh) {
      this.scene.remove(this.volumeMesh);
      this.volumeMesh.geometry.dispose();
      const material = this.volumeMesh.material;
      if (Array.isArray(material)) {
        material.forEach(m => m.dispose());
      } else {
        material.dispose();
      }
      this.volumeMesh = undefined;
    }
    
    if (this.isosurfaceMesh) {
      this.scene.remove(this.isosurfaceMesh);
      this.isosurfaceMesh.geometry.dispose();
      const material = this.isosurfaceMesh.material;
      if (Array.isArray(material)) {
        material.forEach(m => m.dispose());
      } else {
        material.dispose();
      }
      this.isosurfaceMesh = undefined;
    }
    
    if (this.depthSliceMesh) {
      this.scene.remove(this.depthSliceMesh);
      this.depthSliceMesh.geometry.dispose();
      const material = this.depthSliceMesh.material;
      if (Array.isArray(material)) {
        material.forEach(m => m.dispose());
      } else {
        material.dispose();
      }
      this.depthSliceMesh = undefined;
    }
  }
  
  // Update render options
  updateOptions(_options: Partial<RenderOptions>) {
    // Re-render with new options
    // This would cache the current data and re-render
  }
}