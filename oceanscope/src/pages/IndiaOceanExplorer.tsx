import { useState, useEffect } from 'react';
import RealWorldMap from '../components/worldmap/RealWorldMap';
import BroadOceanVisualization from '../components/indian-ocean/BroadOceanVisualization';
import OceanDataControls from '../components/indian-ocean/OceanDataControls';
import ColorLegend from '../components/indian-ocean/ColorLegend';
import Timeline from '../components/indian-ocean/Timeline';
import OceanInsightPanel from '../components/indian-ocean/OceanInsightPanel';
import type { OceanRegion } from '../components/worldmap/RealWorldMap';
import type { ObservationData } from '../services/OceanDataService';
import './IndiaOceanExplorer.css';

export default function IndiaOceanExplorer() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedRegion, setSelectedRegion] = useState<OceanRegion | undefined>();
  const [selectedVariable, setSelectedVariable] = useState('sst');
  const [layerOpacity, setLayerOpacity] = useState(0.7);
  const [showLayer, setShowLayer] = useState(true);
  const [colorMin, setColorMin] = useState(18);
  const [colorMax, setColorMax] = useState(32);
  const [depth, setDepth] = useState(100);
  const [verticalExaggeration, setVerticalExaggeration] = useState(5);
  const [showCurrents, setShowCurrents] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedObservation, setSelectedObservation] = useState<ObservationData | undefined>();
  const [showModelObservation, setShowModelObservation] = useState(true);
  const [showArgoFloats, setShowArgoFloats] = useState(true);
  const [showGliders, setShowGliders] = useState(false);
  
  // Timeline state
  const [timelineDates] = useState(() => {
    const dates = [];
    const startDate = new Date('2024-01-01');
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  });
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Auto-play timeline
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTimeIndex((prev) => {
        if (prev >= timelineDates.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timelineDates.length]);

  const handleRegionSelect = (region: OceanRegion) => {
    setSelectedRegion(region);
    setViewMode('3d');
  };

  const handleBackToMap = () => {
    setViewMode('2d');
    setSelectedRegion(undefined);
    setSelectedObservation(undefined);
  };

  const getVariableName = () => {
    const names: Record<string, string> = {
      sst: 'Sea Surface Temperature',
      salinity: 'Salinity',
      currents: 'Ocean Currents',
      waves: 'Wave Height',
      chlorophyll: 'Chlorophyll',
      sealevel: 'Sea Level',
      bathymetry: 'Bathymetry'
    };
    return names[selectedVariable] || selectedVariable;
  };

  const getColorPalette = () => {
    switch (selectedVariable) {
      case 'sst':
        return ['#000080', '#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
      case 'salinity':
        return ['#0066cc', '#00d4ff', '#2dd4bf', '#4ade80', '#a3e635'];
      case 'currents':
        return ['#1e3a5f', '#4c1d95', '#7c3aed', '#a78bfa', '#c4b5fd'];
      case 'waves':
        return ['#7c2d12', '#ea580c', '#f97316', '#fbbf24', '#fef08a'];
      case 'chlorophyll':
        return ['#134e4a', '#0d9488', '#14b8a6', '#2dd4bf', '#00d4ff'];
      case 'sealevel':
        return ['#3f6212', '#65a30d', '#84cc16', '#a3e635', '#bef264'];
      case 'bathymetry':
        return ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8'];
      default:
        return ['#000080', '#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
    }
  };

  const handleResetCamera = () => {
    // Camera reset will be handled by the visualization component
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="india-ocean-explorer">
      <div className="explorer-header">
        <h1 className="explorer-title">
          {viewMode === '2d' ? 'India Ocean Explorer' : `${selectedRegion?.name || 'Ocean'} 3D View`}
        </h1>
        <p className="explorer-subtitle">
          {viewMode === '2d' 
            ? 'Click on an ocean region to explore in 3D' 
            : 'Interactive oceanographic data visualization'}
        </p>
      </div>

      <div className="explorer-viewport">
        {viewMode === '2d' ? (
          <RealWorldMap
            onRegionSelect={handleRegionSelect}
            selectedRegion={selectedRegion}
          />
        ) : (
          <>
            <button className="back-to-map-btn" onClick={handleBackToMap}>
              ← Back to Map
            </button>
              <BroadOceanVisualization
              depth={depth}
              verticalExaggeration={verticalExaggeration}
              showCurrents={showCurrents}
              showMarkers={showMarkers}
              onMarkerClick={setSelectedObservation}
            />
          </>
        )}

        {viewMode === '3d' && (
          <>
            {/* Left Control Panel */}
            <div className="left-control-panel">
            <OceanDataControls
              selectedVariable={selectedVariable}
              onVariableChange={setSelectedVariable}
              layerOpacity={layerOpacity}
              onOpacityChange={setLayerOpacity}
              showLayer={showLayer}
              onLayerToggle={setShowLayer}
              onResetCamera={handleResetCamera}
              onFullscreen={handleFullscreen}
              depth={depth}
              onDepthChange={setDepth}
              verticalExaggeration={verticalExaggeration}
              onVerticalExaggerationChange={setVerticalExaggeration}
              showCurrents={showCurrents}
              onToggleCurrents={setShowCurrents}
              showMarkers={showMarkers}
              onToggleMarkers={setShowMarkers}
              showGrid={showGrid}
              onToggleGrid={setShowGrid}
              showModelObservation={showModelObservation}
              onToggleModelObservation={setShowModelObservation}
              showArgoFloats={showArgoFloats}
              onToggleArgoFloats={setShowArgoFloats}
              showGliders={showGliders}
              onToggleGliders={setShowGliders}
            />
            </div>

            {/* Center 3D Visualization */}
            <div className="center-visualization">
              <BroadOceanVisualization
                depth={depth}
                verticalExaggeration={verticalExaggeration}
                showCurrents={showCurrents}
                showMarkers={showMarkers}
                onMarkerClick={setSelectedObservation}
              />
            </div>

            {/* Right Ocean Insight Panel */}
            {selectedObservation && (
              <div className="right-insight-panel">
                <OceanInsightPanel
                  observation={selectedObservation}
                  onClose={() => setSelectedObservation(undefined)}
                />
              </div>
            )}

            {/* Bottom Timeline */}
            <div className="bottom-timeline">
              <Timeline
                dates={timelineDates}
                currentIndex={currentTimeIndex}
                onIndexChange={setCurrentTimeIndex}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onSpeedChange={setPlaybackSpeed}
              />
            </div>

            {/* Color Legend (bottom right) */}
            <div className="color-legend-wrapper">
              <ColorLegend
                variable={getVariableName()}
                minValue={colorMin}
                maxValue={colorMax}
                colors={getColorPalette()}
                onMinChange={setColorMin}
                onMaxChange={setColorMax}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
