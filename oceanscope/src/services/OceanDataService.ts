// NetCDF-ready data service architecture
// This layer normalizes different NetCDF variable names to OceanScope standards

export interface OceanDataPoint {
  latitude: number;
  longitude: number;
  depth: number;
  time: Date;
  temperature?: number;
  salinity?: number;
  current_u?: number;
  current_v?: number;
  chlorophyll?: number;
  waveHeight?: number;
  seaLevel?: number;
  bathymetry?: number;
}

export interface ObservationData {
  id: string;
  platformId: string;
  platformType: 'argo' | 'glider' | 'ctd' | 'bgc';
  latitude: number;
  longitude: number;
  timestamp: Date;
  depth: number;
  variables: {
    temperature?: number;
    salinity?: number;
    oxygen?: number;
    chlorophyll?: number;
  };
}

export interface GridData {
  latitude: number[];
  longitude: number[];
  depth: number[];
  time: Date[];
  data: {
    temperature?: number[][][]; // [time][depth][lat][lon]
    salinity?: number[][][];
    current_u?: number[][][];
    current_v?: number[][][];
    chlorophyll?: number[][][];
  };
}

// Variable name normalization map
export const VARIABLE_NORMALIZATION: Record<string, string> = {
  // Temperature
  'thetao': 'temperature',
  'temp': 'temperature',
  'temperature': 'temperature',
  'sst': 'temperature',
  'T': 'temperature',
  
  // Salinity
  'so': 'salinity',
  'salinity': 'salinity',
  'sal': 'salinity',
  'S': 'salinity',
  
  // Currents (u component)
  'uo': 'current_u',
  'u': 'current_u',
  'current_u': 'current_u',
  
  // Currents (v component)
  'vo': 'current_v',
  'v': 'current_v',
  'current_v': 'current_v',
  
  // Chlorophyll
  'chl': 'chlorophyll',
  'chlorophyll': 'chlorophyll',
  'Chl': 'chlorophyll',
  
  // Oxygen
  'o2': 'oxygen',
  'oxygen': 'oxygen',
  'O2': 'oxygen'
};

// Normalize NetCDF variable names to OceanScope standards
export function normalizeVariableName(name: string): string {
  return VARIABLE_NORMALIZATION[name.toLowerCase()] || name;
}

// Service class for ocean data operations
export class OceanDataService {
  private baseUrl: string;
  private isDemo: boolean;

  constructor(baseUrl: string = '', isDemo: boolean = true) {
    this.baseUrl = baseUrl;
    this.isDemo = isDemo;
  }

  // Fetch grid data for a specific region and time range
  async fetchGridData(params: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
    minDepth: number;
    maxDepth: number;
    startTime: Date;
    endTime: Date;
    variables: string[];
  }): Promise<GridData> {
    if (this.isDemo) {
      return this.generateDemoGridData(params);
    }

    // TODO: Implement actual REST API call
    const response = await fetch(`${this.baseUrl}/grid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  // Fetch observation data (Argo, Glider, CTD, BGC)
  async fetchObservationData(params: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
    startTime: Date;
    endTime: Date;
    platformTypes?: string[];
  }): Promise<ObservationData[]> {
    if (this.isDemo) {
      return this.generateDemoObservationData(params);
    }

    // TODO: Implement actual REST API call
    const response = await fetch(`${this.baseUrl}/observations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  // Get data point at specific location
  async getDataPoint(params: {
    latitude: number;
    longitude: number;
    depth: number;
    time: Date;
  }): Promise<OceanDataPoint> {
    if (this.isDemo) {
      return this.generateDemoDataPoint(params);
    }

    // TODO: Implement actual REST API call
    const response = await fetch(`${this.baseUrl}/point`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  // Generate demo grid data (clearly labeled)
  private generateDemoGridData(_params: any): GridData {
    const latStep = 1.0;
    const lonStep = 1.0;
    const depthStep = 100;

    const latitude = [];
    const longitude = [];
    const depth = [];
    const time = [new Date('2024-01-01')];

    for (let lat = 5; lat <= 30; lat += latStep) {
      latitude.push(lat);
    }
    for (let lon = 65; lon <= 95; lon += lonStep) {
      longitude.push(lon);
    }
    for (let d = 0; d <= 3000; d += depthStep) {
      depth.push(d);
    }

    // Generate structured demo data
    const data: any = {};
    data.temperature = this.generateTemperatureField(latitude.length, longitude.length, depth.length);
    data.salinity = this.generateSalinityField(latitude.length, longitude.length, depth.length);
    data.current_u = this.generateCurrentField(latitude.length, longitude.length, depth.length);
    data.current_v = this.generateCurrentField(latitude.length, longitude.length, depth.length);

    return { latitude, longitude, depth, time, data };
  }

  // Generate demo observation data (clearly labeled)
  private generateDemoObservationData(_params: any): ObservationData[] {
    return [
      {
        id: 'DEMO-ARGO-001',
        platformId: '2900123',
        platformType: 'argo',
        latitude: 15.0,
        longitude: 75.0,
        timestamp: new Date('2024-01-15'),
        depth: 250,
        variables: {
          temperature: 24.5,
          salinity: 35.2,
          oxygen: 5.8,
          chlorophyll: 0.8
        }
      },
      {
        id: 'DEMO-GLIDER-001',
        platformId: 'SG567',
        platformType: 'glider',
        latitude: 18.0,
        longitude: 88.0,
        timestamp: new Date('2024-01-15'),
        depth: 150,
        variables: {
          temperature: 26.2,
          salinity: 34.8,
          oxygen: 6.1,
          chlorophyll: 1.2
        }
      },
      {
        id: 'DEMO-CTD-001',
        platformId: 'CTD-789',
        platformType: 'ctd',
        latitude: 12.0,
        longitude: 80.0,
        timestamp: new Date('2024-01-15'),
        depth: 500,
        variables: {
          temperature: 22.8,
          salinity: 35.5,
          oxygen: 4.5
        }
      },
      {
        id: 'DEMO-BGC-001',
        platformId: 'BGC-123',
        platformType: 'bgc',
        latitude: 10.0,
        longitude: 85.0,
        timestamp: new Date('2024-01-15'),
        depth: 100,
        variables: {
          temperature: 27.5,
          salinity: 34.2,
          oxygen: 6.8,
          chlorophyll: 2.1
        }
      }
    ];
  }

  // Generate demo data point (clearly labeled)
  private generateDemoDataPoint(_params: any): OceanDataPoint {
    return {
      latitude: _params.latitude,
      longitude: _params.longitude,
      depth: _params.depth,
      time: _params.time,
      temperature: 25.0 + Math.random() * 5,
      salinity: 34.0 + Math.random() * 2,
      current_u: (Math.random() - 0.5) * 0.5,
      current_v: (Math.random() - 0.5) * 0.5,
      chlorophyll: Math.random() * 2
    };
  }

  // Helper: Generate temperature field
  private generateTemperatureField(latCount: number, lonCount: number, depthCount: number): number[][][] {
    const data: number[][][] = [];
    for (let t = 0; t < 1; t++) {
      const timeSlice: number[][] = [];
      for (let d = 0; d < depthCount; d++) {
        const depthSlice: number[] = [];
        for (let lat = 0; lat < latCount; lat++) {
          for (let lon = 0; lon < lonCount; lon++) {
            depthSlice.push(20 + Math.random() * 10);
          }
        }
        timeSlice.push(depthSlice);
      }
      data.push(timeSlice);
    }
    return data;
  }

  // Helper: Generate salinity field
  private generateSalinityField(latCount: number, lonCount: number, depthCount: number): number[][][] {
    const data: number[][][] = [];
    for (let t = 0; t < 1; t++) {
      const timeSlice: number[][] = [];
      for (let d = 0; d < depthCount; d++) {
        const depthSlice: number[] = [];
        for (let lat = 0; lat < latCount; lat++) {
          for (let lon = 0; lon < lonCount; lon++) {
            depthSlice.push(34 + Math.random() * 2);
          }
        }
        timeSlice.push(depthSlice);
      }
      data.push(timeSlice);
    }
    return data;
  }

  // Helper: Generate current field
  private generateCurrentField(latCount: number, lonCount: number, depthCount: number): number[][][] {
    const data: number[][][] = [];
    for (let t = 0; t < 1; t++) {
      const timeSlice: number[][] = [];
      for (let d = 0; d < depthCount; d++) {
        const depthSlice: number[] = [];
        for (let lat = 0; lat < latCount; lat++) {
          for (let lon = 0; lon < lonCount; lon++) {
            depthSlice.push((Math.random() - 0.5) * 0.5);
          }
        }
        timeSlice.push(depthSlice);
      }
      data.push(timeSlice);
    }
    return data;
  }
}

// Create singleton instance
export const oceanDataService = new OceanDataService('', true); // Demo mode by default