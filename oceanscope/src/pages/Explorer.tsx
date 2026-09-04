import { useState, useEffect } from 'react';
import type { OceanParameter, OceanControls as OceanControlsType } from '../types/oceanData';
import { mockObservationPoints, parameterMetadata } from '../data/mockData';
import IntegratedOceanScene from '../components/explorer/IntegratedOceanScene';
import AdvancedExplorerControls from '../components/explorer/AdvancedExplorerControls';
import DataPanel from '../components/ocean/DataPanel';
import Timeline from '../components/ocean/Timeline';
import DepthProfileChart from '../components/ui/DepthProfileChart';
import type { ColorbarConfig } from '../components/ui/ColorbarEditor';
import './Explorer.css';

export default function Explorer() {
  const [controls, setControls] = useState<OceanControlsType>({
    parameter: 'temperature',
    depth: 1500,
    time: new Date(),
    visualizationMode: 'volume',
    showObservationPoints: true,
    isPlaying: false,
    animationSpeed: 1
  });

  const [showArgo, setShowArgo] = useState(true);
  const [showGliders, setShowGliders] = useState(false);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showCTD, setShowCTD] = useState(false);
  const [showBGC, setShowBGC] = useState(false);
  const [verticalExaggeration, setVerticalExaggeration] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState(mockObservationPoints[0]);
  const [measurements, setMeasurements] = useState(
    mockObservationPoints[0].measurements[controls.parameter]
  );
  
  const [colorbarConfig, setColorbarConfig] = useState<ColorbarConfig>({
    colorMap: 'temperature',
    min: 2,
    max: 32,
    scale: 'linear',
    opacity: 0.8,
    palette: ['#0066cc', '#00d4ff', '#2dd4bf', '#fbbf24', '#ff6b6b']
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (controls.isPlaying) {
      interval = setInterval(() => {
        setControls(prev => ({
          ...prev,
          time: new Date(prev.time.getTime() + 3600000)
        }));
      }, 1000 / controls.animationSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [controls.isPlaying, controls.animationSpeed]);

  useEffect(() => {
    const point = mockObservationPoints.find(p => p.id === selectedPoint?.id);
    if (point) {
      setMeasurements(point.measurements[controls.parameter]);
    }
  }, [controls.parameter, selectedPoint]);

  const handleParameterChange = (param: OceanParameter) => {
    setControls(prev => ({ ...prev, parameter: param }));
  };

  const handleDepthChange = (depth: number) => {
    setControls(prev => ({ ...prev, depth }));
  };

  const handleTimeChange = (time: Date) => {
    setControls(prev => ({ ...prev, time }));
  };

  const handlePlayPause = () => {
    setControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleReset = () => {
    setControls({
      parameter: 'temperature',
      depth: 1500,
      time: new Date(),
      visualizationMode: 'surface',
      showObservationPoints: true,
      isPlaying: false,
      animationSpeed: 1
    });
    setSelectedPoint(mockObservationPoints[0]);
    setShowArgo(true);
    setShowGliders(false);
  };

  const handleToggleArgo = () => {
    setShowArgo(!showArgo);
  };

  const handleToggleGliders = () => {
    setShowGliders(!showGliders);
  };

  const handleToggleCurrents = () => {
    setShowCurrents(!showCurrents);
  };

  const handleToggleCTD = () => {
    setShowCTD(!showCTD);
  };

  const handleToggleBGC = () => {
    setShowBGC(!showBGC);
  };

  const handleVerticalExaggerationChange = (value: number) => {
    setVerticalExaggeration(value);
  };

  const handleColorbarConfigChange = (config: ColorbarConfig) => {
    setColorbarConfig(config);
  };

  return (
    <div className="explorer-page">
      <div className="explorer-header">
        <h1 className="explorer-title">Ocean Explorer</h1>
        <p className="explorer-subtitle">
          Interactive 3D visualization of oceanographic data
        </p>
      </div>

      <div className="explorer-layout">
        {/* Left Control Panel */}
        <div className="explorer-controls">
          <AdvancedExplorerControls
            parameter={controls.parameter}
            depth={controls.depth}
            time={controls.time}
            isPlaying={controls.isPlaying}
            showArgo={showArgo}
            showGliders={showGliders}
            showCurrents={showCurrents}
            showCTD={showCTD}
            showBGC={showBGC}
            verticalExaggeration={verticalExaggeration}
            colorbarConfig={colorbarConfig}
            onParameterChange={handleParameterChange}
            onDepthChange={handleDepthChange}
            onTimeChange={handleTimeChange}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onToggleArgo={handleToggleArgo}
            onToggleGliders={handleToggleGliders}
            onToggleCurrents={handleToggleCurrents}
            onToggleCTD={handleToggleCTD}
            onToggleBGC={handleToggleBGC}
            onVerticalExaggerationChange={handleVerticalExaggerationChange}
            onColorbarConfigChange={handleColorbarConfigChange}
          />
        </div>

        {/* Center Integrated 3D Visualization */}
        <div className="explorer-viewport">
          <IntegratedOceanScene
            parameter={controls.parameter}
            depth={controls.depth}
            showArgo={showArgo}
            showGliders={showGliders}
            showCurrents={showCurrents}
            verticalExaggeration={verticalExaggeration}
            opacity={colorbarConfig.opacity}
          />
        </div>

        {/* Right Data Panel */}
        <div className="explorer-data">
          <DataPanel
            parameter={controls.parameter}
            measurements={measurements}
            selectedPoint={selectedPoint ? {
              name: selectedPoint.name,
              latitude: selectedPoint.latitude,
              longitude: selectedPoint.longitude
            } : undefined}
          />
          
          {/* Depth Profile Chart */}
          <DepthProfileChart
            data={measurements.map(m => ({
              depth: m.depth,
              model: m.value + (Math.random() - 0.5) * 2,
              observed: m.value,
              timestamp: m.timestamp
            }))}
            variable={controls.parameter}
            unit={parameterMetadata[controls.parameter].unit}
            title={`${parameterMetadata[controls.parameter].name} Profile`}
            showAnomaly={true}
            anomalyThreshold={1.5}
          />
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="explorer-timeline">
        <Timeline
          currentTime={controls.time}
          onTimeChange={handleTimeChange}
          isPlaying={controls.isPlaying}
          onPlayPause={handlePlayPause}
        />
      </div>
    </div>
  );
}