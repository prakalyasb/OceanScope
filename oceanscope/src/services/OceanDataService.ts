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

export interface DepthProfilePoint {
  depth: number;
  model: number;
  observed: number;
  difference?: number;
  isAnomaly?: boolean;
}

export interface ObservationData {
  id: string;
  platformId: string;
  platformType: 'argo' | 'glider' | 'ctd' | 'bgc';
  latitude: number;
  longitude: number;
  timestamp: Date;
  depth: number;
  status?: 'NORMAL' | 'ANOMALY DETECTED' | 'UPWELLING DETECTED' | 'CALIBRATING';
  modelTemperature?: number;
  observedTemperature?: number;
  difference?: number;
  variables: {
    temperature?: number;
    salinity?: number;
    oxygen?: number;
    chlorophyll?: number;
  };
  profile?: DepthProfilePoint[];
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

  // Generate demo observation data matching reference image
  private generateDemoObservationData(_params: any): ObservationData[] {
    return [
      // --- BAY OF BENGAL (Indian Ocean) ---
      {
        id: 'ARGO_IND_0045',
        platformId: 'ARGO_IND_0045',
        platformType: 'argo',
        latitude: 13.5,
        longitude: 84.8,
        timestamp: new Date('2024-10-15T08:30:00Z'),
        depth: 200,
        status: 'ANOMALY DETECTED',
        modelTemperature: 27.4,
        observedTemperature: 29.1,
        difference: 1.7,
        variables: {
          temperature: 29.1,
          salinity: 34.6,
          oxygen: 5.2,
          chlorophyll: 1.4
        },
        profile: [
          { depth: 0, model: 30.5, observed: 30.8, difference: 0.3 },
          { depth: 25, model: 30.2, observed: 30.6, difference: 0.4 },
          { depth: 50, model: 29.8, observed: 30.3, difference: 0.5 },
          { depth: 75, model: 29.2, observed: 29.9, difference: 0.7 },
          { depth: 100, model: 28.5, observed: 29.4, difference: 0.9 },
          { depth: 125, model: 27.8, observed: 29.3, difference: 1.5, isAnomaly: true },
          { depth: 150, model: 27.4, observed: 29.1, difference: 1.7, isAnomaly: true },
          { depth: 175, model: 27.1, observed: 28.7, difference: 1.6, isAnomaly: true },
          { depth: 200, model: 26.8, observed: 27.5, difference: 0.7 },
          { depth: 225, model: 26.5, observed: 26.8, difference: 0.3 },
          { depth: 250, model: 26.2, observed: 26.3, difference: 0.1 }
        ]
      },
      {
        id: 'ARGO_IND_0089',
        platformId: 'ARGO_IND_0089',
        platformType: 'argo',
        latitude: 15.2,
        longitude: 88.5,
        timestamp: new Date('2024-10-15T07:15:00Z'),
        depth: 500,
        status: 'NORMAL',
        modelTemperature: 18.2,
        observedTemperature: 18.5,
        difference: 0.3,
        variables: {
          temperature: 18.5,
          salinity: 34.9,
          oxygen: 4.8,
          chlorophyll: 0.6
        },
        profile: [
          { depth: 0, model: 30.2, observed: 30.3 },
          { depth: 100, model: 27.6, observed: 27.8 },
          { depth: 200, model: 24.1, observed: 24.3 },
          { depth: 300, model: 20.8, observed: 21.0 },
          { depth: 500, model: 18.2, observed: 18.5 }
        ]
      },
      {
        id: 'ARGO_IND_0123',
        platformId: 'ARGO_IND_0123',
        platformType: 'argo',
        latitude: 18.1,
        longitude: 89.2,
        timestamp: new Date('2024-10-15T06:00:00Z'),
        depth: 1000,
        status: 'NORMAL',
        modelTemperature: 8.9,
        observedTemperature: 9.4,
        difference: 0.5,
        variables: {
          temperature: 9.4,
          salinity: 35.1,
          oxygen: 3.9
        }
      },
      {
        id: 'ARGO_IND_0156',
        platformId: 'ARGO_IND_0156',
        platformType: 'argo',
        latitude: 7.8,
        longitude: 83.2,
        timestamp: new Date('2024-10-15T09:45:00Z'),
        depth: 100,
        status: 'UPWELLING DETECTED',
        modelTemperature: 28.1,
        observedTemperature: 27.2,
        difference: -0.9,
        variables: {
          temperature: 27.2,
          salinity: 34.4,
          oxygen: 5.9,
          chlorophyll: 2.8
        }
      },
      {
        id: 'GLIDER_023',
        platformId: 'GLIDER_023',
        platformType: 'glider',
        latitude: 11.4,
        longitude: 82.5,
        timestamp: new Date('2024-10-15T08:00:00Z'),
        depth: 800,
        status: 'NORMAL',
        modelTemperature: 11.2,
        observedTemperature: 11.0,
        difference: -0.2,
        variables: {
          temperature: 11.0,
          salinity: 35.0,
          oxygen: 4.1
        }
      },
      {
        id: 'GLIDER_041',
        platformId: 'GLIDER_041',
        platformType: 'glider',
        latitude: 12.8,
        longitude: 92.6,
        timestamp: new Date('2024-10-15T08:15:00Z'),
        depth: 1500,
        status: 'NORMAL',
        modelTemperature: 5.4,
        observedTemperature: 5.2,
        difference: -0.2,
        variables: {
          temperature: 5.2,
          salinity: 34.8,
          oxygen: 3.5
        }
      },

      // --- ARABIAN SEA (High Salinity & Somali Jet) ---
      {
        id: 'ARGO_IND_0210',
        platformId: 'ARGO_IND_0210',
        platformType: 'argo',
        latitude: 16.4,
        longitude: 64.2,
        timestamp: new Date('2024-10-15T09:10:00Z'),
        depth: 250,
        status: 'ANOMALY DETECTED',
        modelTemperature: 26.2,
        observedTemperature: 28.4,
        difference: 2.2,
        variables: {
          temperature: 28.4,
          salinity: 36.8, // High salinity signature
          oxygen: 4.6,
          chlorophyll: 1.8
        },
        profile: [
          { depth: 0, model: 29.5, observed: 30.1, difference: 0.6 },
          { depth: 50, model: 28.8, observed: 29.6, difference: 0.8 },
          { depth: 100, model: 27.5, observed: 28.9, difference: 1.4, isAnomaly: true },
          { depth: 150, model: 26.8, observed: 28.7, difference: 1.9, isAnomaly: true },
          { depth: 200, model: 26.4, observed: 28.5, difference: 2.1, isAnomaly: true },
          { depth: 250, model: 26.2, observed: 28.4, difference: 2.2, isAnomaly: true },
          { depth: 300, model: 24.5, observed: 25.1, difference: 0.6 }
        ]
      },
      {
        id: 'ARGO_IND_0225',
        platformId: 'ARGO_IND_0225',
        platformType: 'argo',
        latitude: 18.5,
        longitude: 58.2,
        timestamp: new Date('2024-10-15T06:45:00Z'),
        depth: 150,
        status: 'UPWELLING DETECTED',
        modelTemperature: 25.8,
        observedTemperature: 23.9,
        difference: -1.9,
        variables: {
          temperature: 23.9,
          salinity: 36.2,
          oxygen: 6.1,
          chlorophyll: 3.4
        }
      },
      {
        id: 'GLIDER_055',
        platformId: 'GLIDER_055',
        platformType: 'glider',
        latitude: 14.8,
        longitude: 68.5,
        timestamp: new Date('2024-10-15T07:30:00Z'),
        depth: 950,
        status: 'NORMAL',
        modelTemperature: 9.8,
        observedTemperature: 9.9,
        difference: 0.1,
        variables: {
          temperature: 9.9,
          salinity: 35.6,
          oxygen: 3.2
        }
      },

      // --- EQUATORIAL INDIAN OCEAN (Wyrtki Jet) ---
      {
        id: 'ARGO_IND_0340',
        platformId: 'ARGO_IND_0340',
        platformType: 'argo',
        latitude: 0.4,
        longitude: 80.5,
        timestamp: new Date('2024-10-15T08:50:00Z'),
        depth: 180,
        status: 'NORMAL',
        modelTemperature: 28.8,
        observedTemperature: 29.2,
        difference: 0.4,
        variables: {
          temperature: 29.2,
          salinity: 35.1,
          oxygen: 4.9,
          chlorophyll: 0.9
        },
        profile: [
          { depth: 0, model: 30.1, observed: 30.3 },
          { depth: 50, model: 29.6, observed: 29.8 },
          { depth: 100, model: 29.2, observed: 29.5 },
          { depth: 180, model: 28.8, observed: 29.2 },
          { depth: 250, model: 25.5, observed: 25.8 }
        ]
      },

      // --- NORTH ATLANTIC (Gulf Stream & AMOC) ---
      {
        id: 'ARGO_ATL_0112',
        platformId: 'ARGO_ATL_0112',
        platformType: 'argo',
        latitude: 35.2,
        longitude: -68.4,
        timestamp: new Date('2024-10-15T09:15:00Z'),
        depth: 220,
        status: 'ANOMALY DETECTED',
        modelTemperature: 22.8,
        observedTemperature: 24.6,
        difference: 1.8,
        variables: {
          temperature: 24.6,
          salinity: 36.4,
          oxygen: 5.4,
          chlorophyll: 1.1
        },
        profile: [
          { depth: 0, model: 26.5, observed: 27.1, difference: 0.6 },
          { depth: 50, model: 25.8, observed: 26.6, difference: 0.8 },
          { depth: 100, model: 24.9, observed: 26.2, difference: 1.3, isAnomaly: true },
          { depth: 150, model: 23.8, observed: 25.5, difference: 1.7, isAnomaly: true },
          { depth: 220, model: 22.8, observed: 24.6, difference: 1.8, isAnomaly: true },
          { depth: 300, model: 20.2, observed: 20.9, difference: 0.7 }
        ]
      },
      {
        id: 'ARGO_ATL_0145',
        platformId: 'ARGO_ATL_0145',
        platformType: 'argo',
        latitude: 28.5,
        longitude: -61.2,
        timestamp: new Date('2024-10-15T06:30:00Z'),
        depth: 450,
        status: 'NORMAL',
        modelTemperature: 18.5,
        observedTemperature: 18.7,
        difference: 0.2,
        variables: {
          temperature: 18.7,
          salinity: 36.6,
          oxygen: 5.0,
          chlorophyll: 0.4
        }
      },
      {
        id: 'GLIDER_ATL_01',
        platformId: 'GLIDER_ATL_01',
        platformType: 'glider',
        latitude: 38.0,
        longitude: -63.5,
        timestamp: new Date('2024-10-15T08:45:00Z'),
        depth: 1200,
        status: 'NORMAL',
        modelTemperature: 6.2,
        observedTemperature: 6.0,
        difference: -0.2,
        variables: {
          temperature: 6.0,
          salinity: 35.0,
          oxygen: 4.8
        }
      },

      // --- SOUTH ATLANTIC (Benguela & Brazil Basin) ---
      {
        id: 'ARGO_ATL_0428',
        platformId: 'ARGO_ATL_0428',
        platformType: 'argo',
        latitude: -24.2,
        longitude: 11.5,
        timestamp: new Date('2024-10-15T07:50:00Z'),
        depth: 180,
        status: 'UPWELLING DETECTED',
        modelTemperature: 18.2,
        observedTemperature: 16.5,
        difference: -1.7,
        variables: {
          temperature: 16.5,
          salinity: 35.2,
          oxygen: 5.8,
          chlorophyll: 2.9
        },
        profile: [
          { depth: 0, model: 21.5, observed: 20.2, difference: -1.3 },
          { depth: 50, model: 19.8, observed: 18.1, difference: -1.7, isAnomaly: true },
          { depth: 100, model: 18.9, observed: 17.2, difference: -1.7, isAnomaly: true },
          { depth: 180, model: 18.2, observed: 16.5, difference: -1.7, isAnomaly: true },
          { depth: 300, model: 14.5, observed: 14.2, difference: -0.3 }
        ]
      },

      // --- NORTH PACIFIC (Kuroshio & Subtropical Gyre) ---
      {
        id: 'ARGO_PAC_0088',
        platformId: 'ARGO_PAC_0088',
        platformType: 'argo',
        latitude: 33.2,
        longitude: 139.5,
        timestamp: new Date('2024-10-15T09:00:00Z'),
        depth: 200,
        status: 'ANOMALY DETECTED',
        modelTemperature: 23.1,
        observedTemperature: 24.9,
        difference: 1.8,
        variables: {
          temperature: 24.9,
          salinity: 34.8,
          oxygen: 5.1,
          chlorophyll: 1.3
        },
        profile: [
          { depth: 0, model: 27.5, observed: 28.1, difference: 0.6 },
          { depth: 50, model: 26.2, observed: 27.2, difference: 1.0 },
          { depth: 100, model: 24.8, observed: 26.4, difference: 1.6, isAnomaly: true },
          { depth: 150, model: 23.9, observed: 25.7, difference: 1.8, isAnomaly: true },
          { depth: 200, model: 23.1, observed: 24.9, difference: 1.8, isAnomaly: true },
          { depth: 300, model: 19.5, observed: 20.1, difference: 0.6 }
        ]
      },
      {
        id: 'ARGO_PAC_0142',
        platformId: 'ARGO_PAC_0142',
        platformType: 'argo',
        latitude: 22.5,
        longitude: 145.0,
        timestamp: new Date('2024-10-15T06:15:00Z'),
        depth: 750,
        status: 'NORMAL',
        modelTemperature: 12.4,
        observedTemperature: 12.6,
        difference: 0.2,
        variables: {
          temperature: 12.6,
          salinity: 34.9,
          oxygen: 4.5
        }
      },
      {
        id: 'GLIDER_PAC_02',
        platformId: 'GLIDER_PAC_02',
        platformType: 'glider',
        latitude: 35.8,
        longitude: 146.5,
        timestamp: new Date('2024-10-15T08:20:00Z'),
        depth: 1400,
        status: 'NORMAL',
        modelTemperature: 4.8,
        observedTemperature: 4.7,
        difference: -0.1,
        variables: {
          temperature: 4.7,
          salinity: 34.6,
          oxygen: 3.8
        }
      },

      // --- SOUTH PACIFIC (Humboldt Upwelling System) ---
      {
        id: 'ARGO_PAC_0572',
        platformId: 'ARGO_PAC_0572',
        platformType: 'argo',
        latitude: -18.5,
        longitude: -78.4,
        timestamp: new Date('2024-10-15T08:10:00Z'),
        depth: 160,
        status: 'UPWELLING DETECTED',
        modelTemperature: 18.5,
        observedTemperature: 16.8,
        difference: -1.7,
        variables: {
          temperature: 16.8,
          salinity: 35.0,
          oxygen: 5.6,
          chlorophyll: 3.1
        },
        profile: [
          { depth: 0, model: 21.0, observed: 19.8, difference: -1.2 },
          { depth: 50, model: 19.5, observed: 17.9, difference: -1.6, isAnomaly: true },
          { depth: 100, model: 18.9, observed: 17.2, difference: -1.7, isAnomaly: true },
          { depth: 160, model: 18.5, observed: 16.8, difference: -1.7, isAnomaly: true },
          { depth: 250, model: 15.0, observed: 14.8, difference: -0.2 }
        ]
      },

      // --- SOUTHERN OCEAN (Antarctic ACC) ---
      {
        id: 'ARGO_SO_0019',
        platformId: 'ARGO_SO_0019',
        platformType: 'argo',
        latitude: -55.2,
        longitude: 58.4,
        timestamp: new Date('2024-10-15T07:40:00Z'),
        depth: 300,
        status: 'NORMAL',
        modelTemperature: 2.4,
        observedTemperature: 2.6,
        difference: 0.2,
        variables: {
          temperature: 2.6,
          salinity: 34.1,
          oxygen: 7.2, // Highly oxygenated polar water
          chlorophyll: 0.8
        },
        profile: [
          { depth: 0, model: 4.1, observed: 4.2 },
          { depth: 50, model: 3.5, observed: 3.6 },
          { depth: 100, model: 2.9, observed: 3.1 },
          { depth: 200, model: 2.6, observed: 2.8 },
          { depth: 300, model: 2.4, observed: 2.6 },
          { depth: 500, model: 1.8, observed: 1.9 }
        ]
      },

      // --- ARCTIC OCEAN (Transpolar Drift & Halocline) ---
      {
        id: 'ARGO_ARC_0064',
        platformId: 'ARGO_ARC_0064',
        platformType: 'argo',
        latitude: 82.5,
        longitude: 12.0,
        timestamp: new Date('2024-10-15T09:20:00Z'),
        depth: 250,
        status: 'ANOMALY DETECTED',
        modelTemperature: -0.2,
        observedTemperature: 0.9,
        difference: 1.1, // Arctic warming anomaly
        variables: {
          temperature: 0.9,
          salinity: 33.8, // Fresh polar surface layer
          oxygen: 7.6,
          chlorophyll: 0.5
        },
        profile: [
          { depth: 0, model: -1.2, observed: -0.8, difference: 0.4 },
          { depth: 50, model: -0.8, observed: -0.1, difference: 0.7 },
          { depth: 100, model: -0.5, observed: 0.5, difference: 1.0, isAnomaly: true },
          { depth: 180, model: -0.3, observed: 0.8, difference: 1.1, isAnomaly: true },
          { depth: 250, model: -0.2, observed: 0.9, difference: 1.1, isAnomaly: true },
          { depth: 400, model: 0.4, observed: 1.0, difference: 0.6 }
        ]
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