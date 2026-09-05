import { useState, useEffect } from 'react';
import type { OceanParameter } from '../types/oceanData';
import IntegratedOceanScene from '../components/explorer/IntegratedOceanScene';
import AdvancedExplorerControls from '../components/explorer/AdvancedExplorerControls';
import LocationOverview from '../components/explorer/LocationOverview';
import OceanInsightPanel from '../components/indian-ocean/OceanInsightPanel';
import Timeline from '../components/ocean/Timeline';
import type { ObservationData } from '../services/OceanDataService';
import { oceanDataService } from '../services/OceanDataService';
import { OCEAN_BASINS } from '../data/oceanBasins';
import './Explorer.css';

export default function Explorer() {
  const [parameter, setParameter] = useState<OceanParameter>('temperature');
  const [depth, setDepth] = useState<number>(200);
  const [time, setTime] = useState<Date>(new Date('2024-10-15T08:30:00Z'));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const [showArgo, setShowArgo] = useState<boolean>(true);
  const [showGliders, setShowGliders] = useState<boolean>(false);
  const [showCurrents, setShowCurrents] = useState<boolean>(true);
  const [showModelObservation, setShowModelObservation] = useState<boolean>(true);
  const [verticalExaggeration, setVerticalExaggeration] = useState<number>(5);
  const [activeRegion, setActiveRegion] = useState<string>('bay_of_bengal');

  // Observations from service (defaulting to ARGO_IND_0045 matching the reference image)
  const defaultObservations = oceanDataService['generateDemoObservationData']({});
  const [selectedObservation, setSelectedObservation] = useState<ObservationData | undefined>(
    defaultObservations[0]
  );

  // Time-lapse playback simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(prev => new Date(prev.getTime() + 3600000 * 6));
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleParameterChange = (param: OceanParameter) => {
    setParameter(param);
  };

  const handleDepthChange = (newDepth: number) => {
    setDepth(newDepth);
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleSelectObservation = (obs: ObservationData) => {
    setSelectedObservation(obs);
    if (obs.depth) {
      setDepth(obs.depth);
    }
  };

  const handleSelectPin = (pinId: string) => {
    if (pinId === 'pin-1' || pinId === 'pin-2') {
      setSelectedObservation(defaultObservations[0]); // ARGO_IND_0045
    } else if (pinId === 'pin-4') {
      setSelectedObservation(defaultObservations[3]); // ARGO_IND_0156 upwelling
    }
  };

  const handleRegionChange = (newRegion: string) => {
    setActiveRegion(newRegion);
    const basin = OCEAN_BASINS[newRegion];
    if (basin && basin.primaryObservationId) {
      const match = defaultObservations.find(o => o.id === basin.primaryObservationId);
      if (match) {
        setSelectedObservation(match);
        if (match.depth) {
          setDepth(match.depth);
        }
      }
    }
  };

  return (
    <div className="explorer-page-fullscreen">
      {/* 1. Main 3D CesiumJS + WebGL Ocean Viewport */}
      <div className="fullscreen-3d-viewport">
        <IntegratedOceanScene
          parameter={parameter}
          depth={depth}
          showArgo={showArgo}
          showGliders={showGliders}
          showCurrents={showCurrents}
          verticalExaggeration={verticalExaggeration}
          opacity={0.85}
          selectedObservationId={selectedObservation?.id}
          onSelectObservation={handleSelectObservation}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
        />
      </div>

      {/* 2. Top World Map / Location Overview (Centered top header) */}
      <div className="top-location-overview-wrapper">
        <LocationOverview
          currentRegion={activeRegion}
          onSelectRegion={handleRegionChange}
        />
      </div>

      {/* 3. Floating Left Scientific Controls Panel */}
      <div className="floating-left-controls-wrapper">
        <AdvancedExplorerControls
          parameter={parameter}
          depth={depth}
          time={time}
          isPlaying={isPlaying}
          showArgo={showArgo}
          showGliders={showGliders}
          showCurrents={showCurrents}
          showModelObservation={showModelObservation}
          verticalExaggeration={verticalExaggeration}
          onParameterChange={handleParameterChange}
          onDepthChange={handleDepthChange}
          onTimeChange={setTime}
          onPlayPause={handlePlayPause}
          onToggleArgo={() => setShowArgo(!showArgo)}
          onToggleGliders={() => setShowGliders(!showGliders)}
          onToggleCurrents={() => setShowCurrents(!showCurrents)}
          onToggleModelObservation={() => setShowModelObservation(!showModelObservation)}
          onVerticalExaggerationChange={setVerticalExaggeration}
        />
      </div>

      {/* 4. Floating Right Ocean Insight Inspection Panel */}
      {selectedObservation && (
        <div className="floating-right-insight-wrapper">
          <OceanInsightPanel
            observation={selectedObservation}
            onClose={() => setSelectedObservation(undefined)}
          />
        </div>
      )}

      {/* 5. Floating Bottom Scrubbable Timeline */}
      <div className="floating-bottom-timeline-wrapper">
        <Timeline
          currentTime={time}
          onTimeChange={setTime}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSelectPin={handleSelectPin}
        />
      </div>
    </div>
  );
}