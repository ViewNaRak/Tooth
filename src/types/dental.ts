export type LessonMode = 'brushing' | 'flossing' | 'rinsing';

export type ToolType = 'brush' | 'floss' | 'rinse';

export type ToothClassification = 'incisor' | 'canine' | 'premolar' | 'molar';

export type ToothSurface = 'buccal' | 'lingual' | 'occlusal' | 'interdental';

export interface ToothInfo {
  id: string;
  fdaNumber: number; // FDI World Dental Federation notation (e.g., 31 to 48 for lower arch)
  name: string;
  thaiName: string;
  classification: ToothClassification;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface PlaqueSpot {
  id: string;
  toothId: string;
  position: [number, number, number];
  normal: [number, number, number];
  surface: ToothSurface;
  severity: number; // 0.0 to 1.0
  cleaned: boolean;
}

export interface DebrisSpot {
  id: string;
  interdentalSpace: string;
  position: [number, number, number];
  cleaned: boolean;
  size: number;
}

export interface LessonStep {
  id: string;
  stepNumber: number;
  title: string;
  motionType: 'vibrate_sweep' | 'c_shape_stroke' | 'swish_spit' | 'chewing_surface';
  targetAngleText?: string;
  shortDescription: string;
  clinicalRationale: string;
  tip: string;
  recommendedTool: ToolType;
  recommendedSurface: ToothSurface;
}

export interface DentalLesson {
  id: LessonMode;
  title: string;
  thaiTitle: string;
  subtitle: string;
  badge: string;
  description: string;
  metrics: {
    duration: string;
    frequency: string;
    techniqueName: string;
  };
  steps: LessonStep[];
  warnings: {
    title: string;
    description: string;
    consequence: string;
  }[];
  clinicalBenefits: string[];
}

export type CameraPreset = 'overview' | 'anterior' | 'left-molars' | 'right-molars' | 'occlusal-top' | 'demo-focus';
