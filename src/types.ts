export type ArtifactType = 
  | 'bell' 
  | 'diya' 
  | 'gada' 
  | 'flowers' 
  | 'aarti' 
  | 'chandan' 
  | 'lore' 
  | 'murti'
  | 'sanctum';

export interface TempleArtifact {
  id: string;
  type: ArtifactType;
  name: string;
  traditionalTitle?: string;
  description: string;
  position: [number, number, number];
  actionLabel: string;
  loreTitle?: string;
  loreContent?: string;
  mantra?: string;
}

export interface DiyaLamp {
  id: string;
  position: [number, number, number];
  isLit: boolean;
  intensity: number;
  color: string;
}

export interface ChalisaVerse {
  id: number;
  type: 'doha_opening' | 'chaupai' | 'doha_closing';
  verseNumber?: number;
  title: string;
  sanskrit: string; // Stored as Romanized English chant
  transliteration: string;
  meaning: string;
  timestamp: number; // Seconds offset into YouTube video AETFvQonfV8
}

export type AtmospherePreset = 'sunny' | 'golden_hour' | 'mountain_mist';

export interface CameraViewpoint {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  yaw: number; // in radians
  pitch: number; // in radians
}
