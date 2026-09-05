import { useState } from 'react';
import RealWorldMap from '../components/worldmap/RealWorldMap';
import type { OceanRegion } from '../components/worldmap/RealWorldMap';
import './ExplorerNew.css';

export default function ExplorerNew() {
  const [selectedRegion, setSelectedRegion] = useState<OceanRegion | undefined>();

  const handleRegionSelect = (region: OceanRegion) => {
    setSelectedRegion(region);
  };

  return (
    <div className="explorer-new">
      <div className="explorer-header">
        <h1 className="explorer-title">Ocean Explorer</h1>
        <p className="explorer-subtitle">Interactive oceanographic visualization</p>
      </div>

      <div className="explorer-viewport">
        <RealWorldMap
          onRegionSelect={handleRegionSelect}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  );
}