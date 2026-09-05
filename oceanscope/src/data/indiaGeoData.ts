// GeoJSON-like coordinate data for India and surrounding regions
export const INDIA_BOUNDARY = [
  [68.7, 7.9],
  [97.4, 7.9],
  [97.4, 35.5],
  [68.7, 35.5],
  [68.7, 7.9]
];

// Simplified India shape (more accurate than bounding box)
export const INDIA_SHAPE = [
  [68.7, 8.0],
  [72.0, 8.5],
  [74.5, 12.0],
  [77.0, 15.5],
  [78.5, 18.0],
  [80.0, 21.0],
  [82.0, 23.5],
  [84.0, 26.0],
  [86.0, 28.0],
  [88.0, 27.5],
  [90.0, 26.0],
  [92.0, 24.0],
  [94.0, 22.0],
  [95.5, 20.0],
  [97.0, 17.0],
  [97.0, 10.0],
  [94.0, 8.0],
  [90.0, 7.5],
  [85.0, 8.0],
  [80.0, 9.0],
  [75.0, 8.5],
  [70.0, 8.0],
  [68.7, 8.0]
];

// Sri Lanka
export const SRI_LANKA = {
  center: [80.7, 7.9],
  boundary: [
    [79.5, 6.0],
    [81.5, 6.0],
    [82.0, 9.5],
    [80.0, 9.8],
    [79.0, 8.5],
    [79.5, 6.0]
  ]
};

// Maldives
export const MALDIVES = {
  center: [73.2, 3.2],
  boundary: [
    [72.5, 2.5],
    [74.0, 2.5],
    [74.0, 4.0],
    [72.5, 4.0],
    [72.5, 2.5]
  ]
};

// Lakshadweep
export const LAKSHADWEEP = {
  center: [72.6, 11.2],
  boundary: [
    [72.0, 10.5],
    [73.2, 10.5],
    [73.2, 12.0],
    [72.0, 12.0],
    [72.0, 10.5]
  ]
};

// Andaman & Nicobar Islands
export const ANDAMAN_NICOBAR = {
  center: [92.7, 11.7],
  boundary: [
    [92.0, 10.0],
    [93.5, 10.0],
    [93.5, 13.5],
    [92.0, 13.5],
    [92.0, 10.0]
  ]
};

// Geographic labels
export const GEOGRAPHIC_LABELS = [
  { name: 'INDIA', position: [78.0, 22.0], type: 'country' },
  { name: 'Sri Lanka', position: [80.7, 7.9], type: 'island' },
  { name: 'Maldives', position: [73.2, 3.2], type: 'island' },
  { name: 'Lakshadweep', position: [72.6, 11.2], type: 'island' },
  { name: 'Andaman & Nicobar', position: [92.7, 11.7], type: 'island' },
  { name: 'Arabian Sea', position: [65.0, 15.0], type: 'ocean' },
  { name: 'Bay of Bengal', position: [90.0, 15.0], type: 'ocean' },
  { name: 'Indian Ocean', position: [78.0, 0.0], type: 'ocean' },
  { name: 'Pakistan', position: [69.0, 28.0], type: 'country' },
  { name: 'Bangladesh', position: [90.0, 24.0], type: 'country' },
  { name: 'Myanmar', position: [95.0, 21.0], type: 'country' }
];

// Grid lines for lat/lon
export const GRID_LINES = {
  latitude: [5, 10, 15, 20, 25, 30],
  longitude: [65, 70, 75, 80, 85, 90, 95]
};