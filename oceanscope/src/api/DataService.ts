// REST/OPeNDAP API integration architecture
export interface ApiConfig {
  baseUrl: string;
  opendapUrl?: string;
  timeout: number;
  retryAttempts: number;
}

export interface TimeSeriesRequest {
  variable: string;
  startTime: Date;
  endTime: Date;
  boundingBox?: BoundingBox;
  depthRange?: [number, number];
  resolution?: 'low' | 'medium' | 'high';
}

export interface VolumeDataRequest {
  variable: string;
  time: Date;
  boundingBox: BoundingBox;
  depthRange: [number, number];
  resolution: {
    x: number;
    y: number;
    z: number;
  };
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface ApiResponse<T> {
  data: T;
  metadata: {
    timestamp: Date;
    source: string;
    quality: number;
  };
  status: 'success' | 'error';
  error?: string;
}

// REST API client
export class RestApiClient {
  private config: ApiConfig;
  
  constructor(config: ApiConfig) {
    this.config = config;
  }
  
  async fetchTimeSeries(request: TimeSeriesRequest): Promise<ApiResponse<TimeSeriesData>> {
    const url = `${this.config.baseUrl}/timeseries`;
    const params = new URLSearchParams({
      variable: request.variable,
      startTime: request.startTime.toISOString(),
      endTime: request.endTime.toISOString(),
      resolution: request.resolution || 'medium'
    });
    
    if (request.boundingBox) {
      params.append('minLat', request.boundingBox.minLat.toString());
      params.append('maxLat', request.boundingBox.maxLat.toString());
      params.append('minLon', request.boundingBox.minLon.toString());
      params.append('maxLon', request.boundingBox.maxLon.toString());
    }
    
    if (request.depthRange) {
      params.append('minDepth', request.depthRange[0].toString());
      params.append('maxDepth', request.depthRange[1].toString());
    }
    
    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.config.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        data: this.transformTimeSeries(data),
        metadata: {
          timestamp: new Date(),
          source: 'REST API',
          quality: 1.0
        },
        status: 'success'
      };
    } catch (error) {
      return {
        data: {} as TimeSeriesData,
        metadata: {
          timestamp: new Date(),
          source: 'REST API',
          quality: 0
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  async fetchVolumeData(request: VolumeDataRequest): Promise<ApiResponse<VolumeData>> {
    const url = `${this.config.baseUrl}/volume`;
    const params = new URLSearchParams({
      variable: request.variable,
      time: request.time.toISOString(),
      minLat: request.boundingBox.minLat.toString(),
      maxLat: request.boundingBox.maxLat.toString(),
      minLon: request.boundingBox.minLon.toString(),
      maxLon: request.boundingBox.maxLon.toString(),
      minDepth: request.depthRange[0].toString(),
      maxDepth: request.depthRange[1].toString(),
      resolutionX: request.resolution.x.toString(),
      resolutionY: request.resolution.y.toString(),
      resolutionZ: request.resolution.z.toString()
    });
    
    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.config.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        data: this.transformVolumeData(data),
        metadata: {
          timestamp: new Date(),
          source: 'REST API',
          quality: 1.0
        },
        status: 'success'
      };
    } catch (error) {
      return {
        data: {} as VolumeData,
        metadata: {
          timestamp: new Date(),
          source: 'REST API',
          quality: 0
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private transformTimeSeries(data: any): TimeSeriesData {
    return {
      timestamps: data.timestamps.map((t: string) => new Date(t)),
      values: data.values,
      depths: data.depths,
      locations: data.locations || [],
      quality: data.quality || 1.0
    };
  }
  
  private transformVolumeData(data: any): VolumeData {
    return {
      dimensions: data.dimensions,
      spacing: data.spacing,
      values: new Float32Array(data.values),
      bounds: data.bounds,
      timestamps: data.timestamps.map((t: string) => new Date(t))
    };
  }
}

// OPeNDAP client for NetCDF files
export class OpendapClient {
  private config: ApiConfig;
  
  constructor(config: ApiConfig) {
    this.config = config;
  }
  
  async fetchNetCDF(url: string, variables: string[]): Promise<ApiResponse<NetCDFData>> {
    // OPeNDAP implementation using opendap.js or similar library
    // For now, return mock implementation
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(this.config.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse NetCDF data (would use a library like netcdfjs in production)
      const data = await this.parseNetCDF(await response.arrayBuffer(), variables);
      
      return {
        data,
        metadata: {
          timestamp: new Date(),
          source: 'OPeNDAP',
          quality: 1.0
        },
        status: 'success'
      };
    } catch (error) {
      return {
        data: {} as NetCDFData,
        metadata: {
          timestamp: new Date(),
          source: 'OPeNDAP',
          quality: 0
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async parseNetCDF(_buffer: ArrayBuffer, _variables: string[]): Promise<NetCDFData> {
    // Mock implementation - would use netcdfjs library
    return {
      variables: {},
      dimensions: {},
      globalAttributes: {}
    };
  }
}

// Data types
export interface TimeSeriesData {
  timestamps: Date[];
  values: number[];
  depths: number[];
  locations?: Array<{ latitude: number; longitude: number }>;
  quality: number;
}

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

export interface NetCDFData {
  variables: Record<string, any>;
  dimensions: Record<string, number>;
  globalAttributes: Record<string, any>;
}

// Unified data service
export class DataService {
  private restClient: RestApiClient;
  private opendapClient?: OpendapClient;
  
  constructor(config: ApiConfig) {
    this.restClient = new RestApiClient(config);
    if (config.opendapUrl) {
      this.opendapClient = new OpendapClient(config);
    }
  }
  
  async getTimeSeries(request: TimeSeriesRequest): Promise<ApiResponse<TimeSeriesData>> {
    return this.restClient.fetchTimeSeries(request);
  }
  
  async getVolumeData(request: VolumeDataRequest): Promise<ApiResponse<VolumeData>> {
    return this.restClient.fetchVolumeData(request);
  }
  
  async getNetCDF(url: string, variables: string[]): Promise<ApiResponse<NetCDFData>> {
    if (!this.opendapClient) {
      return {
        data: {} as NetCDFData,
        metadata: {
          timestamp: new Date(),
          source: 'OPeNDAP',
          quality: 0
        },
        status: 'error',
        error: 'OPeNDAP client not configured'
      };
    }
    return this.opendapClient.fetchNetCDF(url, variables);
  }
}