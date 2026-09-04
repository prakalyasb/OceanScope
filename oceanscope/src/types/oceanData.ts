export type OceanParameter = 
  | 'temperature'
  | 'salinity'
  | 'chlorophyll'
  | 'currentSpeed'
  | 'waveHeight'
  | 'dissolvedOxygen';

export type VisualizationMode = 
  | 'surface'
  | 'depth'
  | '3dProfile'
  | 'heatmap';

export type DataSource = 
  | 'INCOIS'
  | 'Copernicus'
  | 'Argo'
  | 'Satellite'
  | 'Model'
  | 'UserUpload';

export type DatasetStatus = 
  | 'ready'
  | 'processing'
  | 'error'
  | 'pending';

export type InsightSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface OceanMeasurement {
  value: number;
  unit: string;
  depth: number;
  timestamp: Date;
  quality: number; // 0-1 data quality score
}

export interface ObservationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  depth: number;
  measurements: Record<OceanParameter, OceanMeasurement[]>;
  region: string;
  active: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  parameter: OceanParameter;
  region: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  depth: {
    min: number;
    max: number;
  };
  source: DataSource;
  status: DatasetStatus;
  observationPoints: number;
  description: string;
  fileSize?: number;
  fileType?: string;
}

export interface Insight {
  id: string;
  title: string;
  severity: InsightSeverity;
  parameter: OceanParameter;
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  observedValue: number;
  expectedRange: {
    min: number;
    max: number;
  };
  explanation: string;
  timestamp: Date;
  relatedObservationPoints: string[];
}

export interface TimeSeries {
  timestamp: Date;
  value: number;
  depth?: number;
}

export interface DepthProfile {
  depth: number;
  value: number;
  temperature?: number;
  salinity?: number;
}

export interface DataQuality {
  score: number;
  issues: string[];
  completeness: number;
  accuracy: number;
}

export interface ComparisonConfig {
  primary: {
    parameter: OceanParameter;
    timePeriod: {
      start: Date;
      end: Date;
    };
    depth: number;
  };
  secondary: {
    parameter: OceanParameter;
    timePeriod: {
      start: Date;
      end: Date;
    };
    depth: number;
  };
  mode: 'parameter' | 'time' | 'depth' | 'model';
}

export interface UploadFile {
  file: File;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  parsedVariables?: string[];
  error?: string;
}

export interface OceanControls {
  parameter: OceanParameter;
  depth: number;
  time: Date;
  visualizationMode: VisualizationMode;
  showObservationPoints: boolean;
  isPlaying: boolean;
  animationSpeed: number;
}