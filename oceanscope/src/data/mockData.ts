import type { 
  ObservationPoint, 
  Dataset, 
  Insight, 
  OceanParameter,
  TimeSeries,
  DepthProfile 
} from '../types/oceanData';

// Helper function to generate realistic ocean measurements
const generateMeasurements = (baseValue: number, variance: number, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    value: baseValue + (Math.random() - 0.5) * variance,
    unit: getUnitForParameter(baseValue),
    depth: i * 10,
    timestamp: new Date(Date.now() - i * 3600000),
    quality: 0.85 + Math.random() * 0.15
  }));
};

const getUnitForParameter = (value: number): string => {
  if (value > 100) return 'm/s';
  if (value > 30) return '°C';
  if (value > 10) return 'PSU';
  if (value > 5) return 'mg/m³';
  if (value > 1) return 'm';
  return 'mg/L';
};

// Mock observation points around Indian coastline
export const mockObservationPoints: ObservationPoint[] = [
  {
    id: 'obs-001',
    name: 'Mumbai Coast Station',
    latitude: 19.0760,
    longitude: 72.8777,
    depth: 50,
    region: 'Arabian Sea',
    active: true,
    measurements: {
      temperature: generateMeasurements(27.5, 2.0, 24),
      salinity: generateMeasurements(35.0, 1.5, 24),
      chlorophyll: generateMeasurements(2.5, 1.0, 24),
      currentSpeed: generateMeasurements(0.5, 0.3, 24),
      waveHeight: generateMeasurements(1.2, 0.5, 24),
      dissolvedOxygen: generateMeasurements(6.0, 1.0, 24)
    }
  },
  {
    id: 'obs-002',
    name: 'Chennai Coastal Station',
    latitude: 13.0827,
    longitude: 80.2707,
    depth: 45,
    region: 'Bay of Bengal',
    active: true,
    measurements: {
      temperature: generateMeasurements(28.5, 1.8, 24),
      salinity: generateMeasurements(32.0, 2.0, 24),
      chlorophyll: generateMeasurements(3.0, 1.2, 24),
      currentSpeed: generateMeasurements(0.4, 0.2, 24),
      waveHeight: generateMeasurements(1.0, 0.4, 24),
      dissolvedOxygen: generateMeasurements(5.8, 0.9, 24)
    }
  },
  {
    id: 'obs-003',
    name: 'Kochi Deep Sea Station',
    latitude: 9.9312,
    longitude: 76.2673,
    depth: 100,
    region: 'Arabian Sea',
    active: true,
    measurements: {
      temperature: generateMeasurements(26.0, 2.5, 24),
      salinity: generateMeasurements(36.0, 1.2, 24),
      chlorophyll: generateMeasurements(1.8, 0.8, 24),
      currentSpeed: generateMeasurements(0.6, 0.4, 24),
      waveHeight: generateMeasurements(1.5, 0.6, 24),
      dissolvedOxygen: generateMeasurements(5.5, 1.2, 24)
    }
  },
  {
    id: 'obs-004',
    name: 'Kolkata Estuary Station',
    latitude: 22.5726,
    longitude: 88.3639,
    depth: 30,
    region: 'Bay of Bengal',
    active: true,
    measurements: {
      temperature: generateMeasurements(29.0, 2.2, 24),
      salinity: generateMeasurements(28.0, 3.0, 24),
      chlorophyll: generateMeasurements(4.5, 1.5, 24),
      currentSpeed: generateMeasurements(0.3, 0.2, 24),
      waveHeight: generateMeasurements(0.8, 0.3, 24),
      dissolvedOxygen: generateMeasurements(5.2, 1.1, 24)
    }
  },
  {
    id: 'obs-005',
    name: 'Goa Coastal Station',
    latitude: 15.2993,
    longitude: 74.1240,
    depth: 40,
    region: 'Arabian Sea',
    active: true,
    measurements: {
      temperature: generateMeasurements(27.0, 1.9, 24),
      salinity: generateMeasurements(34.5, 1.8, 24),
      chlorophyll: generateMeasurements(2.2, 0.9, 24),
      currentSpeed: generateMeasurements(0.5, 0.3, 24),
      waveHeight: generateMeasurements(1.3, 0.5, 24),
      dissolvedOxygen: generateMeasurements(6.2, 0.8, 24)
    }
  },
  {
    id: 'obs-006',
    name: 'Andaman Sea Station',
    latitude: 11.7401,
    longitude: 92.6586,
    depth: 80,
    region: 'Bay of Bengal',
    active: true,
    measurements: {
      temperature: generateMeasurements(28.0, 2.0, 24),
      salinity: generateMeasurements(33.0, 1.5, 24),
      chlorophyll: generateMeasurements(2.8, 1.1, 24),
      currentSpeed: generateMeasurements(0.4, 0.3, 24),
      waveHeight: generateMeasurements(1.1, 0.4, 24),
      dissolvedOxygen: generateMeasurements(5.9, 1.0, 24)
    }
  },
  {
    id: 'obs-007',
    name: 'Lakshadweep Deep Station',
    latitude: 10.5667,
    longitude: 72.6417,
    depth: 120,
    region: 'Arabian Sea',
    active: true,
    measurements: {
      temperature: generateMeasurements(25.5, 2.8, 24),
      salinity: generateMeasurements(36.5, 1.0, 24),
      chlorophyll: generateMeasurements(1.5, 0.7, 24),
      currentSpeed: generateMeasurements(0.7, 0.5, 24),
      waveHeight: generateMeasurements(1.8, 0.7, 24),
      dissolvedOxygen: generateMeasurements(5.3, 1.3, 24)
    }
  },
  {
    id: 'obs-008',
    name: 'Visakhapatnam Station',
    latitude: 17.6868,
    longitude: 83.2185,
    depth: 55,
    region: 'Bay of Bengal',
    active: true,
    measurements: {
      temperature: generateMeasurements(28.2, 2.1, 24),
      salinity: generateMeasurements(31.5, 2.2, 24),
      chlorophyll: generateMeasurements(3.2, 1.3, 24),
      currentSpeed: generateMeasurements(0.45, 0.25, 24),
      waveHeight: generateMeasurements(1.05, 0.45, 24),
      dissolvedOxygen: generateMeasurements(5.7, 1.05, 24)
    }
  }
];

// Mock datasets
export const mockDatasets: Dataset[] = [
  {
    id: 'ds-001',
    name: 'Indian Ocean Temperature Profile',
    parameter: 'temperature',
    region: 'Indian Ocean',
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-12-31')
    },
    depth: { min: 0, max: 200 },
    source: 'INCOIS',
    status: 'ready',
    observationPoints: 156,
    description: 'Comprehensive temperature profile across the Indian Ocean with daily measurements from surface to 200m depth.',
    fileSize: 245000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-002',
    name: 'Bay of Bengal Salinity',
    parameter: 'salinity',
    region: 'Bay of Bengal',
    dateRange: {
      start: new Date('2024-03-01'),
      end: new Date('2024-09-30')
    },
    depth: { min: 0, max: 150 },
    source: 'Copernicus',
    status: 'ready',
    observationPoints: 89,
    description: 'High-resolution salinity measurements in the Bay of Bengal region, focusing on monsoon period variations.',
    fileSize: 180000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-003',
    name: 'Arabian Sea Chlorophyll',
    parameter: 'chlorophyll',
    region: 'Arabian Sea',
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-06-30')
    },
    depth: { min: 0, max: 50 },
    source: 'Satellite',
    status: 'ready',
    observationPoints: 234,
    description: 'Satellite-derived chlorophyll concentration data for the Arabian Sea, including coastal upwelling zones.',
    fileSize: 95000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-004',
    name: 'Indian Ocean Surface Currents',
    parameter: 'currentSpeed',
    region: 'Indian Ocean',
    dateRange: {
      start: new Date('2024-06-01'),
      end: new Date('2024-12-31')
    },
    depth: { min: 0, max: 15 },
    source: 'Model',
    status: 'ready',
    observationPoints: 312,
    description: 'Surface current velocity data from ocean circulation models covering the entire Indian Ocean basin.',
    fileSize: 320000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-005',
    name: 'Ocean Wave Forecast',
    parameter: 'waveHeight',
    region: 'Indian Ocean',
    dateRange: {
      start: new Date('2024-09-01'),
      end: new Date('2025-03-01')
    },
    depth: { min: 0, max: 0 },
    source: 'Model',
    status: 'ready',
    observationPoints: 178,
    description: '7-day wave height forecast data for the Indian Ocean region with 3-hour temporal resolution.',
    fileSize: 145000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-006',
    name: 'Argo Float Temperature',
    parameter: 'temperature',
    region: 'Indian Ocean',
    dateRange: {
      start: new Date('2023-01-01'),
      end: new Date('2024-12-31')
    },
    depth: { min: 0, max: 2000 },
    source: 'Argo',
    status: 'ready',
    observationPoints: 45,
    description: 'Temperature profiles from Argo floating sensors providing deep ocean measurements up to 2000m depth.',
    fileSize: 78000000,
    fileType: 'NetCDF'
  },
  {
    id: 'ds-007',
    name: 'Dissolved Oxygen Survey',
    parameter: 'dissolvedOxygen',
    region: 'Arabian Sea',
    dateRange: {
      start: new Date('2024-04-01'),
      end: new Date('2024-10-31')
    },
    depth: { min: 0, max: 500 },
    source: 'INCOIS',
    status: 'ready',
    observationPoints: 67,
    description: 'Dissolved oxygen concentration measurements to study oxygen minimum zones in the Arabian Sea.',
    fileSize: 112000000,
    fileType: 'NetCDF'
  }
];

// Mock insights
export const mockInsights: Insight[] = [
  {
    id: 'ins-001',
    title: 'Temperature Anomaly Detected',
    severity: 'high',
    parameter: 'temperature',
    location: {
      latitude: 15.5,
      longitude: 73.8,
      region: 'Arabian Sea'
    },
    observedValue: 30.2,
    expectedRange: { min: 27.0, max: 28.5 },
    explanation: 'Surface temperature 2°C above normal for this season, potentially indicating anomalous heating event or reduced upwelling.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-001', 'obs-005']
  },
  {
    id: 'ins-002',
    title: 'High Chlorophyll Concentration',
    severity: 'medium',
    parameter: 'chlorophyll',
    location: {
      latitude: 19.2,
      longitude: 72.9,
      region: 'Arabian Sea'
    },
    observedValue: 5.8,
    expectedRange: { min: 1.5, max: 3.5 },
    explanation: 'Elevated chlorophyll levels suggest active phytoplankton bloom, possibly due to nutrient-rich upwelling conditions.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-001']
  },
  {
    id: 'ins-003',
    title: 'Strong Current Region',
    severity: 'low',
    parameter: 'currentSpeed',
    location: {
      latitude: 10.3,
      longitude: 76.1,
      region: 'Arabian Sea'
    },
    observedValue: 1.8,
    expectedRange: { min: 0.3, max: 0.8 },
    explanation: 'Unusually high surface current velocities detected, likely associated with local eddy formation or western boundary current intensification.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-003']
  },
  {
    id: 'ins-004',
    title: 'Salinity Variation Alert',
    severity: 'medium',
    parameter: 'salinity',
    location: {
      latitude: 22.6,
      longitude: 88.4,
      region: 'Bay of Bengal'
    },
    observedValue: 24.5,
    expectedRange: { min: 30.0, max: 34.0 },
    explanation: 'Significantly lower salinity levels indicate possible freshwater influx from river discharge or heavy precipitation events.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-004']
  },
  {
    id: 'ins-005',
    title: 'Possible Upwelling Zone',
    severity: 'high',
    parameter: 'temperature',
    location: {
      latitude: 14.8,
      longitude: 74.2,
      region: 'Arabian Sea'
    },
    observedValue: 24.8,
    expectedRange: { min: 27.0, max: 29.0 },
    explanation: 'Cold surface temperature anomaly combined with high chlorophyll suggests active coastal upwelling bringing nutrient-rich deep water to surface.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-005']
  },
  {
    id: 'ins-006',
    title: 'Low Dissolved Oxygen Warning',
    severity: 'critical',
    parameter: 'dissolvedOxygen',
    location: {
      latitude: 16.5,
      longitude: 73.0,
      region: 'Arabian Sea'
    },
    observedValue: 2.1,
    expectedRange: { min: 5.0, max: 7.0 },
    explanation: 'Critically low dissolved oxygen levels detected, indicating potential oxygen minimum zone expansion that could impact marine life.',
    timestamp: new Date(),
    relatedObservationPoints: ['obs-003', 'obs-007']
  }
];

// Mock time series data
export const generateTimeSeries = (parameter: OceanParameter, days: number = 30): TimeSeries[] => {
  const baseValues: Record<OceanParameter, number> = {
    temperature: 27.5,
    salinity: 34.0,
    chlorophyll: 2.5,
    currentSpeed: 0.5,
    waveHeight: 1.2,
    dissolvedOxygen: 6.0
  };

  const variances: Record<OceanParameter, number> = {
    temperature: 2.0,
    salinity: 1.5,
    chlorophyll: 1.0,
    currentSpeed: 0.3,
    waveHeight: 0.5,
    dissolvedOxygen: 1.0
  };

  return Array.from({ length: days }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000),
    value: baseValues[parameter] + (Math.random() - 0.5) * variances[parameter] * 2
  })).reverse();
};

// Mock depth profile data
export const generateDepthProfile = (parameter: OceanParameter, maxDepth: number = 200): DepthProfile[] => {
  const surfaceValues: Record<OceanParameter, number> = {
    temperature: 28.0,
    salinity: 34.0,
    chlorophyll: 2.5,
    currentSpeed: 0.5,
    waveHeight: 1.2,
    dissolvedOxygen: 6.0
  };

  const depthDecay: Record<OceanParameter, number> = {
    temperature: 0.015,
    salinity: 0.005,
    chlorophyll: 0.02,
    currentSpeed: 0.01,
    waveHeight: 0.0,
    dissolvedOxygen: 0.008
  };

  return Array.from({ length: Math.floor(maxDepth / 10) }, (_, i) => {
    const depth = i * 10;
    const surfaceValue = surfaceValues[parameter];
    const decay = depthDecay[parameter];
    
    return {
      depth,
      value: surfaceValue * Math.exp(-decay * depth) + (Math.random() - 0.5) * 0.5
    };
  });
};

// Parameter metadata
export const parameterMetadata: Record<OceanParameter, {
  name: string;
  unit: string;
  color: string;
  icon: string;
  range: { min: number; max: number };
}> = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    color: '#FF6B6B',
    icon: 'thermometer',
    range: { min: 15, max: 35 }
  },
  salinity: {
    name: 'Salinity',
    unit: 'PSU',
    color: '#4ECDC4',
    icon: 'droplets',
    range: { min: 30, max: 40 }
  },
  chlorophyll: {
    name: 'Chlorophyll',
    unit: 'mg/m³',
    color: '#45B7D1',
    icon: 'leaf',
    range: { min: 0, max: 10 }
  },
  currentSpeed: {
    name: 'Current Speed',
    unit: 'm/s',
    color: '#96CEB4',
    icon: 'wind',
    range: { min: 0, max: 2 }
  },
  waveHeight: {
    name: 'Wave Height',
    unit: 'm',
    color: '#FFEAA7',
    icon: 'waves',
    range: { min: 0, max: 5 }
  },
  dissolvedOxygen: {
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    color: '#DDA0DD',
    icon: 'circle',
    range: { min: 0, max: 10 }
  }
};