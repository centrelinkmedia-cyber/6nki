// Sacred Geometry & Mathematical Constants for ENKI Architecture
// Subtle Esoteric Inspiration: Golden Ratio, Flower of Life, Frequency Ratios

export const PHI = 1.618033988749895; // Golden Ratio
export const HARMONIC_BASE_HZ = 432; // Fundamental acoustic constant
export const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

export interface SacredPoint {
  x: number;
  y: number;
}

export interface GeometricNode {
  id: string;
  label: string;
  frequency: number;
  description: string;
  discipline: string;
  coordinates: { x: number; y: number };
}

/**
 * Calculates Flower of Life node centers within a given radius
 */
export function getFlowerOfLifePoints(centerX: number, centerY: number, radius: number): SacredPoint[] {
  const points: SacredPoint[] = [{ x: centerX, y: centerY }];
  const angles = [0, 60, 120, 180, 240, 300];

  // First ring of 6 circles
  angles.forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    points.push({
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    });
  });

  // Second ring intersection points
  angles.forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    points.push({
      x: centerX + radius * 1.73205 * Math.cos(rad + Math.PI / 6),
      y: centerY + radius * 1.73205 * Math.sin(rad + Math.PI / 6),
    });
  });

  return points;
}

/**
 * Generates golden spiral coordinates for smooth geometric animation or grid layout
 */
export function getGoldenSpiralPoints(centerX: number, centerY: number, turns: number = 3, pointsPerTurn: number = 30): SacredPoint[] {
  const points: SacredPoint[] = [];
  const totalPoints = turns * pointsPerTurn;
  const growthRate = 0.3063489; // ln(PHI) / (Math.PI / 2)

  for (let i = 0; i < totalPoints; i++) {
    const theta = (i / pointsPerTurn) * 2 * Math.PI;
    const r = 4 * Math.exp(growthRate * theta);
    points.push({
      x: centerX + r * Math.cos(theta),
      y: centerY + r * Math.sin(theta),
    });
  }

  return points;
}

/**
 * The Codex Philosophical Pillars of ENKI
 */
export const ENKI_CODEX_NODES: GeometricNode[] = [
  {
    id: 'node-1',
    label: 'The Fundamental Frequency (432 Hz)',
    frequency: 432,
    discipline: 'Music & Acoustics',
    description: 'The natural harmonic resonance of organic structures. In ENKI, sound processing and spatial audio pathways are calibrated to preserve mathematical acoustic clarity.',
    coordinates: { x: 50, y: 50 },
  },
  {
    id: 'node-2',
    label: 'The Golden Ratio Architecture (1:1.618)',
    frequency: 528,
    discipline: 'Design & Visual Systems',
    description: 'Every interface proportion, typography step, and visual grid inside ENKI derives from the Fibonacci ratio, creating subconscious digital tranquility and focus.',
    coordinates: { x: 75, y: 30 },
  },
  {
    id: 'node-3',
    label: 'The Sumerian Codex of Creation',
    frequency: 618,
    discipline: 'Writing & Transmedia Lore',
    description: 'Named after Enki, the ancient deity of wisdom, crafts, water, and creation. ENKI treats creators not as content generators, but as architects of human myth.',
    coordinates: { x: 75, y: 70 },
  },
  {
    id: 'node-4',
    label: 'Vocal Resonance & Emotional Transfer',
    frequency: 342,
    discipline: 'Voice Acting & Direction',
    description: 'Voice is the oldest human technology. ENKI live studios prioritize uncompressed micro-harmonics and emotional fidelity over compression artifacts.',
    coordinates: { x: 25, y: 30 },
  },
  {
    id: 'node-5',
    label: 'Sovereign Value Exchange ($NKI)',
    frequency: 864,
    discipline: 'Business Consulting & Economy',
    description: 'A circular creator economy where knowledge, critique, stem packs, and executive strategy exchange directly between verified masters without parasitic intermediaries.',
    coordinates: { x: 25, y: 70 },
  },
];
