// Plugin architecture for extensible sensor integration
export interface SensorPlugin {
  id: string;
  name: string;
  type: 'argo' | 'glider' | 'ctd' | 'bgc' | 'mooring' | 'hf-radar' | 'adcp' | 'custom';
  icon: string;
  description: string;
  
  // Data fetching
  fetchData: (params: FetchParams) => Promise<SensorData>;
  
  // Visualization
  renderMarkers: (data: SensorData, scene: any) => void;
  renderProfile: (data: SensorData, variable: string) => ProfileData;
  
  // Configuration
  config?: PluginConfig;
}

export interface FetchParams {
  startTime: Date;
  endTime: Date;
  boundingBox?: BoundingBox;
  depthRange?: [number, number];
  variables?: string[];
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface SensorData {
  id: string;
  type: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    depth: number;
  };
  measurements: Record<string, number>;
  quality: number;
  metadata?: Record<string, any>;
}

export interface ProfileData {
  depths: number[];
  values: number[];
  timestamps: Date[];
  variable: string;
}

export interface PluginConfig {
  opacity?: number;
  color?: string;
  size?: number;
  visible?: boolean;
  depthRange?: [number, number];
}

// Base plugin class for common functionality
export abstract class BaseSensorPlugin implements SensorPlugin {
  abstract id: string;
  abstract name: string;
  abstract type: SensorPlugin['type'];
  abstract icon: string;
  abstract description: string;
  
  config: PluginConfig = {
    opacity: 0.8,
    color: '#00d4ff',
    size: 1,
    visible: true
  };
  
  abstract fetchData(params: FetchParams): Promise<SensorData>;
  abstract renderMarkers(data: SensorData, scene: any): void;
  abstract renderProfile(data: SensorData, variable: string): ProfileData;
  
  updateConfig(newConfig: Partial<PluginConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Plugin registry
export class PluginRegistry {
  private plugins: Map<string, SensorPlugin> = new Map();
  
  register(plugin: SensorPlugin) {
    this.plugins.set(plugin.id, plugin);
  }
  
  unregister(id: string) {
    this.plugins.delete(id);
  }
  
  get(id: string): SensorPlugin | undefined {
    return this.plugins.get(id);
  }
  
  getAll(): SensorPlugin[] {
    return Array.from(this.plugins.values());
  }
  
  getByType(type: SensorPlugin['type']): SensorPlugin[] {
    return this.getAll().filter(p => p.type === type);
  }
}

// Singleton instance
export const pluginRegistry = new PluginRegistry();