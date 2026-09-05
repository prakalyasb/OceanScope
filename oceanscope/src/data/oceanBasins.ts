export interface OceanCurrentStreamline {
  name: string;
  coords: [number, number][]; // [lon, lat]
  color: string;
  width?: number;
  depth?: number; // meters (negative if submerged)
  isSubsurface?: boolean;
  isUpwelling?: boolean;
  isSinking?: boolean;
  startDepth?: number;
  endDepth?: number;
}

export interface OceanGeographicLabel {
  text: string;
  lon: number;
  lat: number;
  height: number;
  font?: string;
  color?: string;
}

export interface OceanBasinConfig {
  id: string;
  name: string;
  shortName: string;
  oceanCategory: 'Indian' | 'Atlantic' | 'Pacific' | 'Polar' | 'Global';
  coordsLabel: string;
  camera: {
    destination: [number, number, number]; // lon, lat, height
    heading: number; // degrees
    pitch: number;   // degrees
    roll: number;
  };
  bbox: [number, number, number, number]; // [minLon, maxLon, minLat, maxLat] for minimap
  cutawayBounds: {
    lonWest: number;
    lonEast: number;
    latSouth: number;
    latNorth: number;
  };
  thermalProfile: {
    surfaceTemp: number; // °C
    deepTemp: number;    // °C
    thermoclineGradient: 'steep' | 'moderate' | 'polar' | 'saline';
  };
  currents: OceanCurrentStreamline[];
  labels: OceanGeographicLabel[];
  primaryObservationId: string;
}

export const OCEAN_BASINS: Record<string, OceanBasinConfig> = {
  bay_of_bengal: {
    id: 'bay_of_bengal',
    name: 'Bay of Bengal',
    shortName: 'Bay of Bengal',
    oceanCategory: 'Indian',
    coordsLabel: '6°N–20°N, 80°E–94°E',
    camera: {
      destination: [88.5, 4.2, 1950000],
      heading: 348,
      pitch: -38,
      roll: 0
    },
    bbox: [80.5, 93.5, 5.8, 20.2],
    cutawayBounds: {
      lonWest: 80.5,
      lonEast: 93.5,
      latSouth: 5.8,
      latNorth: 20.2
    },
    thermalProfile: {
      surfaceTemp: 30.5,
      deepTemp: 2.2,
      thermoclineGradient: 'steep'
    },
    primaryObservationId: 'ARGO_IND_0045',
    currents: [
      {
        name: 'Warm Bay of Bengal Current',
        coords: [[83.0, 8.5], [85.5, 11.0], [88.0, 13.5], [90.5, 15.2], [92.0, 16.0]],
        color: '#ff6b4a',
        width: 8
      },
      {
        name: 'Warm Coastal Gyre',
        coords: [[84.5, 12.0], [87.0, 14.5], [90.0, 15.8], [88.5, 17.5], [85.5, 16.8]],
        color: '#fa8c16',
        width: 7
      },
      {
        name: 'Sri Lanka Dome Current',
        coords: [[81.2, 6.5], [82.8, 8.0], [82.5, 10.5], [81.5, 11.2], [80.8, 9.8]],
        color: '#00d4ff',
        width: 7
      },
      {
        name: 'Bay of Bengal Gyre Return',
        coords: [[92.5, 14.0], [90.5, 11.5], [87.5, 9.5], [84.5, 8.0]],
        color: '#1890ff',
        width: 7
      },
      {
        name: 'Coastal Upwelling Vector',
        coords: [[82.5, 12.0], [82.5, 12.0]],
        color: '#00ffff',
        width: 8,
        isUpwelling: true,
        startDepth: 1000,
        endDepth: 350
      },
      {
        name: 'Thermocline Subsurface Flow',
        coords: [[81.5, 7.5], [85.5, 9.0], [89.5, 10.5]],
        color: '#faad14',
        width: 6,
        isSubsurface: true,
        depth: 480
      }
    ],
    labels: [
      { text: 'INDIA', lon: 78.8, lat: 17.5, height: 4000, font: 'bold 20px Inter', color: '#ffffff' },
      { text: 'SRI LANKA', lon: 80.7, lat: 7.8, height: 3000, font: 'bold 16px Inter', color: '#ffffff' },
      { text: 'Bay of Bengal', lon: 88.5, lat: 14.8, height: 2000, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'BANGLADESH', lon: 90.2, lat: 23.8, height: 4000, font: 'bold 15px Inter', color: '#ffffff' },
      { text: 'MYANMAR', lon: 95.8, lat: 19.5, height: 4000, font: 'bold 16px Inter', color: '#ffffff' }
    ]
  },

  arabian_sea: {
    id: 'arabian_sea',
    name: 'Arabian Sea (Somali Jet)',
    shortName: 'Arabian Sea',
    oceanCategory: 'Indian',
    coordsLabel: '8°N–24°N, 55°E–75°E',
    camera: {
      destination: [66.0, 5.5, 2300000],
      heading: 354,
      pitch: -40,
      roll: 0
    },
    bbox: [55.0, 75.0, 8.0, 24.5],
    cutawayBounds: {
      lonWest: 56.0,
      lonEast: 74.5,
      latSouth: 8.5,
      latNorth: 24.0
    },
    thermalProfile: {
      surfaceTemp: 29.8,
      deepTemp: 2.1,
      thermoclineGradient: 'saline'
    },
    primaryObservationId: 'ARGO_IND_0210',
    currents: [
      {
        name: 'Somali Current Jet',
        coords: [[51.5, 6.0], [53.5, 9.5], [56.0, 13.0], [58.8, 15.5]],
        color: '#ff4d4f',
        width: 9
      },
      {
        name: 'Great Whirl Eddy',
        coords: [[54.0, 8.5], [56.5, 10.5], [56.0, 12.8], [53.5, 11.2], [52.8, 9.2]],
        color: '#ff7a45',
        width: 7
      },
      {
        name: 'Ras al Hadd Jet',
        coords: [[59.5, 22.0], [63.0, 21.0], [66.5, 19.5], [70.0, 18.0]],
        color: '#faad14',
        width: 7
      },
      {
        name: 'West India Coastal Current',
        coords: [[72.5, 20.5], [73.2, 16.0], [74.5, 12.0], [75.5, 8.5]],
        color: '#00d4ff',
        width: 7
      },
      {
        name: 'Oman Coastal Upwelling Vector',
        coords: [[57.5, 18.2], [57.5, 18.2]],
        color: '#00ffff',
        width: 8,
        isUpwelling: true,
        startDepth: 950,
        endDepth: 250
      },
      {
        name: 'Red Sea High-Salinity Subsurface Outflow',
        coords: [[54.0, 13.0], [60.0, 14.5], [66.0, 15.5]],
        color: '#722ed1',
        width: 6,
        isSubsurface: true,
        depth: 600
      }
    ],
    labels: [
      { text: 'ARABIAN SEA', lon: 64.5, lat: 16.5, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'SOMALIA', lon: 48.5, lat: 7.5, height: 4000, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'OMAN', lon: 56.5, lat: 21.5, height: 4000, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'INDIA (WEST COAST)', lon: 75.8, lat: 17.5, height: 4000, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'SOCOTRA', lon: 54.0, lat: 12.5, height: 2500, font: 'bold 14px Inter', color: '#ffd666' }
    ]
  },

  equatorial_indian: {
    id: 'equatorial_indian',
    name: 'Equatorial Indian Ocean',
    shortName: 'Equat. Indian',
    oceanCategory: 'Indian',
    coordsLabel: '10°S–6°N, 65°E–95°E',
    camera: {
      destination: [80.0, -14.0, 3100000],
      heading: 0,
      pitch: -46,
      roll: 0
    },
    bbox: [65.0, 95.0, -10.0, 6.0],
    cutawayBounds: {
      lonWest: 66.0,
      lonEast: 94.0,
      latSouth: -9.5,
      latNorth: 5.5
    },
    thermalProfile: {
      surfaceTemp: 30.0,
      deepTemp: 2.0,
      thermoclineGradient: 'steep'
    },
    primaryObservationId: 'ARGO_IND_0340',
    currents: [
      {
        name: 'Wyrtki Surface Jet',
        coords: [[68.0, 0.5], [74.0, 0.8], [80.0, 0.2], [86.0, -0.4], [92.0, -0.8]],
        color: '#ff4d4f',
        width: 9
      },
      {
        name: 'South Equatorial Current',
        coords: [[93.0, -8.0], [87.0, -8.2], [80.0, -8.5], [73.0, -8.2], [67.0, -8.0]],
        color: '#1890ff',
        width: 8
      },
      {
        name: 'Equatorial Undercurrent',
        coords: [[70.0, 0.0], [78.0, 0.0], [86.0, 0.0]],
        color: '#faad14',
        width: 6,
        isSubsurface: true,
        depth: 180
      }
    ],
    labels: [
      { text: 'EQUATORIAL INDIAN OCEAN', lon: 80.0, lat: -2.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'MALDIVES', lon: 73.2, lat: 3.2, height: 2500, font: 'bold 15px Inter', color: '#ffffff' },
      { text: 'CHAGOS ARCHIPELAGO', lon: 72.0, lat: -6.0, height: 2500, font: 'bold 14px Inter', color: '#ffffff' },
      { text: 'SUMATRA (INDONESIA)', lon: 97.5, lat: 0.5, height: 4000, font: 'bold 18px Inter', color: '#ffffff' }
    ]
  },

  north_atlantic: {
    id: 'north_atlantic',
    name: 'North Atlantic (Gulf Stream)',
    shortName: 'North Atlantic',
    oceanCategory: 'Atlantic',
    coordsLabel: '20°N–45°N, 40°W–80°W',
    camera: {
      destination: [-62.0, 16.0, 3100000],
      heading: 350,
      pitch: -42,
      roll: 0
    },
    bbox: [-80.0, -42.0, 20.0, 45.0],
    cutawayBounds: {
      lonWest: -78.0,
      lonEast: -46.0,
      latSouth: 22.0,
      latNorth: 42.0
    },
    thermalProfile: {
      surfaceTemp: 26.5,
      deepTemp: 2.3,
      thermoclineGradient: 'moderate'
    },
    primaryObservationId: 'ARGO_ATL_0112',
    currents: [
      {
        name: 'Gulf Stream Main Jet',
        coords: [[-79.5, 25.5], [-76.0, 31.0], [-71.0, 36.5], [-63.0, 39.5], [-50.0, 41.5]],
        color: '#ff3b30',
        width: 10
      },
      {
        name: 'North Atlantic Drift',
        coords: [[-50.0, 41.5], [-43.0, 43.5], [-35.0, 45.0]],
        color: '#fa8c16',
        width: 8
      },
      {
        name: 'Sargasso Sea Subtropical Gyre',
        coords: [[-68.0, 28.0], [-62.0, 27.0], [-58.0, 30.0], [-64.0, 32.0], [-70.0, 30.5]],
        color: '#13c2c2',
        width: 7
      },
      {
        name: 'Cold Labrador Current Confluence',
        coords: [[-52.0, 45.0], [-55.0, 42.0], [-58.0, 40.0]],
        color: '#00d4ff',
        width: 8
      },
      {
        name: 'AMOC Deep Convective Sinking Vector',
        coords: [[-50.0, 43.0], [-50.0, 43.0]],
        color: '#2f54eb',
        width: 8,
        isSinking: true,
        startDepth: 100,
        endDepth: 1800
      }
    ],
    labels: [
      { text: 'NORTH ATLANTIC', lon: -58.0, lat: 34.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'GULF STREAM', lon: -71.5, lat: 34.5, height: 2000, font: 'bold 18px Inter', color: '#ff4d4f' },
      { text: 'UNITED STATES', lon: -82.0, lat: 35.0, height: 4500, font: 'bold 20px Inter', color: '#ffffff' },
      { text: 'BERMUDA', lon: -64.7, lat: 32.3, height: 2000, font: 'bold 15px Inter', color: '#ffd666' },
      { text: 'SARGASSO SEA', lon: -60.0, lat: 26.5, height: 2000, font: 'bold 17px Inter', color: '#36cfc9' }
    ]
  },

  south_atlantic: {
    id: 'south_atlantic',
    name: 'South Atlantic (Benguela)',
    shortName: 'South Atlantic',
    oceanCategory: 'Atlantic',
    coordsLabel: '34°S–12°S, 36°W–14°E',
    camera: {
      destination: [-11.0, -42.0, 3400000],
      heading: 5,
      pitch: -45,
      roll: 0
    },
    bbox: [-38.0, 16.0, -36.0, -10.0],
    cutawayBounds: {
      lonWest: -36.0,
      lonEast: 14.0,
      latSouth: -34.0,
      latNorth: -12.0
    },
    thermalProfile: {
      surfaceTemp: 22.0,
      deepTemp: 1.8,
      thermoclineGradient: 'moderate'
    },
    primaryObservationId: 'ARGO_ATL_0428',
    currents: [
      {
        name: 'Benguela Upwelling Current',
        coords: [[16.0, -34.0], [14.5, -28.0], [12.0, -22.0], [8.5, -16.0]],
        color: '#00d4ff',
        width: 8
      },
      {
        name: 'Brazil Current',
        coords: [[-35.0, -14.0], [-38.0, -20.0], [-42.0, -26.0], [-46.0, -32.0]],
        color: '#ff7a45',
        width: 8
      },
      {
        name: 'South Atlantic Trans-Basin Current',
        coords: [[-30.0, -32.0], [-15.0, -33.0], [0.0, -33.5], [12.0, -33.0]],
        color: '#1890ff',
        width: 7
      },
      {
        name: 'Namibia Coastal Upwelling Vector',
        coords: [[13.8, -24.5], [13.8, -24.5]],
        color: '#00ffff',
        width: 8,
        isUpwelling: true,
        startDepth: 900,
        endDepth: 200
      }
    ],
    labels: [
      { text: 'SOUTH ATLANTIC', lon: -12.0, lat: -23.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'BRAZIL BASIN', lon: -28.0, lat: -20.0, height: 2500, font: 'bold 17px Inter', color: '#ffffff' },
      { text: 'BENGUELA CURRENT', lon: 10.0, lat: -25.0, height: 2000, font: 'bold 17px Inter', color: '#00d4ff' },
      { text: 'SOUTH AFRICA', lon: 22.0, lat: -30.0, height: 4000, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'ST. HELENA', lon: -5.7, lat: -15.9, height: 2000, font: 'bold 14px Inter', color: '#ffd666' }
    ]
  },

  north_pacific: {
    id: 'north_pacific',
    name: 'North Pacific (Kuroshio)',
    shortName: 'North Pacific',
    oceanCategory: 'Pacific',
    coordsLabel: '20°N–42°N, 128°E–165°E',
    camera: {
      destination: [145.0, 12.0, 3300000],
      heading: 352,
      pitch: -43,
      roll: 0
    },
    bbox: [126.0, 168.0, 18.0, 44.0],
    cutawayBounds: {
      lonWest: 128.0,
      lonEast: 165.0,
      latSouth: 20.0,
      latNorth: 42.0
    },
    thermalProfile: {
      surfaceTemp: 27.8,
      deepTemp: 1.6,
      thermoclineGradient: 'steep'
    },
    primaryObservationId: 'ARGO_PAC_0088',
    currents: [
      {
        name: 'Kuroshio Western Boundary Current',
        coords: [[125.0, 22.0], [128.5, 27.5], [134.0, 32.5], [140.5, 35.0], [145.0, 36.5]],
        color: '#ff4d4f',
        width: 10
      },
      {
        name: 'Kuroshio Extension Meander',
        coords: [[145.0, 36.5], [152.0, 37.5], [157.0, 36.0], [163.0, 38.0]],
        color: '#ff7a45',
        width: 8
      },
      {
        name: 'Oyashio Subarctic Inflow',
        coords: [[148.0, 44.0], [145.0, 40.5], [143.0, 38.0]],
        color: '#00d4ff',
        width: 7
      },
      {
        name: 'Subtropical Countercurrent',
        coords: [[130.0, 22.5], [140.0, 23.5], [150.0, 24.0], [160.0, 24.2]],
        color: '#faad14',
        width: 6
      }
    ],
    labels: [
      { text: 'NORTH PACIFIC', lon: 152.0, lat: 31.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'KUROSHIO CURRENT', lon: 137.0, lat: 31.5, height: 2000, font: 'bold 18px Inter', color: '#ff4d4f' },
      { text: 'JAPAN', lon: 138.0, lat: 37.0, height: 4000, font: 'bold 20px Inter', color: '#ffffff' },
      { text: 'PHILIPPINE SEA', lon: 133.0, lat: 24.0, height: 2500, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'MARIANA TRENCH REGION', lon: 145.0, lat: 18.0, height: 2500, font: 'bold 15px Inter', color: '#36cfc9' }
    ]
  },

  south_pacific: {
    id: 'south_pacific',
    name: 'South Pacific (Humboldt)',
    shortName: 'South Pacific',
    oceanCategory: 'Pacific',
    coordsLabel: '32°S–10°S, 72°W–112°W',
    camera: {
      destination: [-92.0, -42.0, 3400000],
      heading: 356,
      pitch: -44,
      roll: 0
    },
    bbox: [-114.0, -70.0, -34.0, -8.0],
    cutawayBounds: {
      lonWest: -112.0,
      lonEast: -72.0,
      latSouth: -32.0,
      latNorth: -10.0
    },
    thermalProfile: {
      surfaceTemp: 21.5,
      deepTemp: 1.5,
      thermoclineGradient: 'moderate'
    },
    primaryObservationId: 'ARGO_PAC_0572',
    currents: [
      {
        name: 'Humboldt (Peru) Coastal Current',
        coords: [[-73.0, -32.0], [-72.5, -26.0], [-74.0, -20.0], [-77.0, -14.0], [-82.0, -9.5]],
        color: '#00d4ff',
        width: 9
      },
      {
        name: 'South Equatorial Pacific Drift',
        coords: [[-85.0, -10.5], [-92.0, -11.0], [-100.0, -11.5], [-110.0, -12.0]],
        color: '#1890ff',
        width: 8
      },
      {
        name: 'Peru Coastal Upwelling Filament',
        coords: [[-76.0, -17.5], [-76.0, -17.5]],
        color: '#00ffff',
        width: 8,
        isUpwelling: true,
        startDepth: 850,
        endDepth: 180
      }
    ],
    labels: [
      { text: 'SOUTH PACIFIC', lon: -96.0, lat: -21.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'HUMBOLDT CURRENT', lon: -76.0, lat: -22.0, height: 2000, font: 'bold 18px Inter', color: '#00d4ff' },
      { text: 'PERU BASIN', lon: -86.0, lat: -15.0, height: 2500, font: 'bold 17px Inter', color: '#ffffff' },
      { text: 'CHILE', lon: -70.0, lat: -28.0, height: 4500, font: 'bold 18px Inter', color: '#ffffff' },
      { text: 'PERU', lon: -74.0, lat: -12.0, height: 4500, font: 'bold 18px Inter', color: '#ffffff' }
    ]
  },

  southern_ocean: {
    id: 'southern_ocean',
    name: 'Southern Ocean (Antarctic ACC)',
    shortName: 'Southern Ocean',
    oceanCategory: 'Polar',
    coordsLabel: '65°S–48°S, 20°E–90°E',
    camera: {
      destination: [55.0, -75.0, 3900000],
      heading: 0,
      pitch: -46,
      roll: 0
    },
    bbox: [20.0, 90.0, -68.0, -46.0],
    cutawayBounds: {
      lonWest: 22.0,
      lonEast: 88.0,
      latSouth: -65.0,
      latNorth: -48.0
    },
    thermalProfile: {
      surfaceTemp: 4.2,
      deepTemp: 0.5,
      thermoclineGradient: 'polar'
    },
    primaryObservationId: 'ARGO_SO_0019',
    currents: [
      {
        name: 'Antarctic Circumpolar Current (ACC - North Jet)',
        coords: [[25.0, -50.0], [40.0, -50.5], [55.0, -49.5], [70.0, -50.0], [85.0, -51.0]],
        color: '#1890ff',
        width: 10
      },
      {
        name: 'Antarctic Circumpolar Current (ACC - Polar Front)',
        coords: [[24.0, -57.0], [38.0, -58.0], [52.0, -56.5], [68.0, -57.5], [84.0, -58.5]],
        color: '#096dd9',
        width: 10
      },
      {
        name: 'Antarctic Coastal Current (East Wind Drift)',
        coords: [[80.0, -64.5], [65.0, -64.8], [50.0, -64.2], [35.0, -64.5]],
        color: '#003a8c',
        width: 7
      },
      {
        name: 'Antarctic Bottom Water (AABW) Deep Sinking',
        coords: [[45.0, -63.0], [45.0, -63.0]],
        color: '#001529',
        width: 8,
        isSinking: true,
        startDepth: 80,
        endDepth: 2200
      }
    ],
    labels: [
      { text: 'SOUTHERN OCEAN', lon: 55.0, lat: -54.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'ANTARCTIC CIRCUMPOLAR CURRENT (ACC)', lon: 55.0, lat: -51.5, height: 2000, font: 'bold 17px Inter', color: '#40a9ff' },
      { text: 'KERGUELEN PLATEAU', lon: 70.0, lat: -49.0, height: 2500, font: 'bold 15px Inter', color: '#ffd666' },
      { text: 'ANTARCTICA (ICE EDGE)', lon: 55.0, lat: -67.0, height: 4000, font: 'bold 20px Inter', color: '#ffffff' }
    ]
  },

  arctic: {
    id: 'arctic',
    name: 'Arctic Ocean (Transpolar Drift)',
    shortName: 'Arctic Ocean',
    oceanCategory: 'Polar',
    coordsLabel: '72°N–88°N, 40°W–50°E',
    camera: {
      destination: [0.0, 60.0, 3700000],
      heading: 0,
      pitch: -50,
      roll: 0
    },
    bbox: [-45.0, 55.0, 70.0, 89.0],
    cutawayBounds: {
      lonWest: -38.0,
      lonEast: 46.0,
      latSouth: 72.0,
      latNorth: 87.0
    },
    thermalProfile: {
      surfaceTemp: -0.5,
      deepTemp: 1.2,
      thermoclineGradient: 'polar'
    },
    primaryObservationId: 'ARGO_ARC_0064',
    currents: [
      {
        name: 'Transpolar Drift Stream',
        coords: [[40.0, 85.0], [20.0, 86.5], [0.0, 84.0], [-10.0, 80.0], [-18.0, 75.0]],
        color: '#00d4ff',
        width: 8
      },
      {
        name: 'West Spitsbergen Atlantic Water Inflow',
        coords: [[5.0, 73.0], [10.0, 76.0], [14.0, 79.5], [18.0, 82.0]],
        color: '#ff7a45',
        width: 7
      },
      {
        name: 'East Greenland Polar Current',
        coords: [[-10.0, 82.0], [-16.0, 78.5], [-22.0, 74.5]],
        color: '#096dd9',
        width: 8
      }
    ],
    labels: [
      { text: 'ARCTIC OCEAN', lon: 0.0, lat: 82.0, height: 2500, font: 'bold 22px Inter', color: '#00d4ff' },
      { text: 'TRANSPOLAR DRIFT', lon: 10.0, lat: 84.5, height: 2000, font: 'bold 17px Inter', color: '#69c0ff' },
      { text: 'SVALBARD', lon: 18.0, lat: 78.5, height: 2500, font: 'bold 16px Inter', color: '#ffffff' },
      { text: 'GREENLAND SEA', lon: -12.0, lat: 75.0, height: 2500, font: 'bold 17px Inter', color: '#ffffff' }
    ]
  },

  global: {
    id: 'global',
    name: 'Global Earth',
    shortName: 'Global View',
    oceanCategory: 'Global',
    coordsLabel: 'Worldwide Oceans',
    camera: {
      destination: [30.0, 15.0, 11500000],
      heading: 0,
      pitch: -88,
      roll: 0
    },
    bbox: [-180, 180, -75, 75],
    cutawayBounds: {
      lonWest: 80.5,
      lonEast: 93.5,
      latSouth: 5.8,
      latNorth: 20.2
    },
    thermalProfile: {
      surfaceTemp: 24.0,
      deepTemp: 2.0,
      thermoclineGradient: 'moderate'
    },
    primaryObservationId: 'ARGO_IND_0045',
    currents: [
      {
        name: 'Global Conveyor Belt (Atlantic Leg)',
        coords: [[-45.0, 15.0], [-60.0, 30.0], [-40.0, 50.0]],
        color: '#ff4d4f',
        width: 8
      },
      {
        name: 'Global Conveyor Belt (Indian Ocean Leg)',
        coords: [[80.0, -10.0], [60.0, -30.0], [30.0, -35.0]],
        color: '#1890ff',
        width: 8
      },
      {
        name: 'Global Conveyor Belt (Pacific Leg)',
        coords: [[160.0, 10.0], [140.0, 35.0], [-170.0, 45.0]],
        color: '#faad14',
        width: 8
      }
    ],
    labels: [
      { text: 'ATLANTIC OCEAN', lon: -35.0, lat: 25.0, height: 8000, font: 'bold 24px Inter', color: '#00d4ff' },
      { text: 'PACIFIC OCEAN', lon: -150.0, lat: 10.0, height: 8000, font: 'bold 24px Inter', color: '#00d4ff' },
      { text: 'INDIAN OCEAN', lon: 75.0, lat: -10.0, height: 8000, font: 'bold 24px Inter', color: '#00d4ff' },
      { text: 'SOUTHERN OCEAN', lon: 0.0, lat: -60.0, height: 8000, font: 'bold 24px Inter', color: '#00d4ff' },
      { text: 'ARCTIC OCEAN', lon: 0.0, lat: 80.0, height: 8000, font: 'bold 24px Inter', color: '#00d4ff' }
    ]
  }
};
