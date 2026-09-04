import { useState, useEffect } from 'react';
import type { OceanParameter, VisualizationMode, OceanControls as OceanControlsType } from '../types/oceanData';
import { mockObservationPoints } from '../data/mockData';
import OceanScene from '../components/ocean/OceanScene';
import OceanControls from '../components/ocean/OceanControls';
import DataPanel from '../components/ocean/DataPanel';
import Timeline from '../components/ocean/Timeline';
import './Explorer.css';

export default function Explorer() {
  const [controls, setControls] = useState<OceanControlsType>({
    parameter: 'temperature',
    depth: 1000,
    time: new Date(),
    visualizationMode: 'surface',
    showObservationPoints: true,
    isPlaying: false,
    animationSpeed: 1
  });

  const [showArgo, setShowArgo] = useState(true);
  const [showGliders, setShowGliders] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(mockObservationPoints[0]);
  const [measurements, setMeasurements] = useState(
    mockObservationPoints[0].measurements[controls.parameter]
  );

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

  const handleVisualizationModeChange = (mode: VisualizationMode) => {
    setControls(prev => ({ ...prev, visualizationMode: mode }));
  };

  const handleToggleObservationPoints = () => {
    setControls(prev => ({ ...prev, showObservationPoints: !prev.showObservationPoints }));
  };

  const handlePlayPause = () => {
    setControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleReset = () => {
    setControls({
      parameter: 'temperature',
      depth: 1000,
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

  const handlePointSelect = (pointId: string) => {
    const point = mockObservationPoints.find(p => p.id === pointId);
    if (point) {
      setSelectedPoint(point);
    }
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
          <OceanControls
            parameter={controls.parameter}
            depth={controls.depth}
            time={controls.time}
            visualizationMode={controls.visualizationMode}
            showObservationPoints={controls.showObservationPoints}
            isPlaying={controls.isPlaying}
            showArgo={showArgo}
            showGliders={showGliders}
            onParameterChange={handleParameterChange}
            onDepthChange={handleDepthChange}
            onTimeChange={handleTimeChange}
            onVisualizationModeChange={handleVisualizationModeChange}
            onToggleObservationPoints={handleToggleObservationPoints}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onToggleArgo={handleToggleArgo}
            onToggleGliders={handleToggleGliders}
          />
        </div>

        {/* Center 3D Visualization */}
        <div className="explorer-viewport">
          <OceanScene 
            parameter={controls.parameter} 
            showArgo={showArgo}
            showGliders={showGliders}
            depth={controls.depth}
          />
          
          {/* Observation Points Overlay */}
          {controls.showObservationPoints && (
            <div className="observation-points-overlay">
              {mockObservationPoints.map((point) => (
                <button
                  key={point.id}
                  className={`observation-point ${selectedPoint?.id === point.id ? 'active' : ''}`}
                  onClick={() => handlePointSelect(point.id)}
                  style={{
                    left: `${((point.longitude + 180) / 360) * 100}%`,
                    top: `${((90 - point.latitude) / 180) * 100}%`
                  }}
                  title={point.name}
                >
                  <div className="point-marker" />
                  <span className="point-label">{point.name}</span>
                </button>
              ))}
            </div>
          )}
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