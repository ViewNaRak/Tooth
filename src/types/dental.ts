export type LessonMode = 'brushing' | 'flossing' | 'rinsing';

export type ToolType = 'brush' | 'floss' | 'rinse';

export type ToothSurface = 'buccal' | 'lingual' | 'occlusal' | 'interdental';

export interface PlaqueSpot {
  id: string;
  position: [number, number, number];
  normal: [number, number, number];
  surface: ToothSurface;
  severity: number; // 0.0 to 1.0
  cleaned: boolean;
}

export interface DebrisSpot {
  id: string;
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
  description: string;
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

export interface SimulationState {
  currentLessonId: LessonMode;
  currentStepIndex: number;
  activeTool: ToolType;
  brushAngle: number; // in degrees, e.g. 45
  isAnimatingAction: boolean;
  actionProgress: number; // 0 to 1
  cameraPreset: 'front' | 'top' | 'close-interdental' | 'side';
}
