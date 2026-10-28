import React, { useState, useMemo, useCallback } from 'react';
import { Navigation } from 'lucide-react';
import { DentalScene } from './components/canvas/DentalScene';
import { TopBar } from './components/ui/TopBar';
import { BottomDock } from './components/ui/BottomDock';
import { GuidePopover } from './components/ui/GuidePopover';
import {
  COMPACT_DENTAL_LESSONS,
  INITIAL_ARCH_PLAQUE,
  INITIAL_ARCH_DEBRIS,
} from './data/dentalLessons';
import type {
  LessonMode,
  ToolType,
  PlaqueSpot,
  DebrisSpot,
  CameraPreset,
} from './types/dental';

export const App: React.FC = () => {
  // Current Lesson & Active Tool
  const [currentLessonId, setCurrentLessonId] = useState<LessonMode>('brushing');
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [brushAngle, setBrushAngle] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [disclosingAgentEnabled, setDisclosingAgentEnabled] = useState<boolean>(false);

  // 3D Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');

  // Biofilm & Debris State across the Full Dental Arch
  const [plaqueSpots, setPlaqueSpots] = useState<PlaqueSpot[]>(INITIAL_ARCH_PLAQUE);
  const [debrisSpots, setDebrisSpots] = useState<DebrisSpot[]>(INITIAL_ARCH_DEBRIS);

  const currentLesson = COMPACT_DENTAL_LESSONS[currentLessonId];

  // Calculate Cleanliness Score
  const totalPlaqueCount = plaqueSpots.length;
  const plaqueCleanedCount = plaqueSpots.filter((s) => s.cleaned).length;
  const totalDebrisCount = debrisSpots.length;
  const debrisCleanedCount = debrisSpots.filter((s) => s.cleaned).length;

  const cleanlinessScore = useMemo(() => {
    const total = totalPlaqueCount + totalDebrisCount;
    if (total === 0) return 100;
    const cleaned = plaqueCleanedCount + debrisCleanedCount;
    return Math.round((cleaned / total) * 100);
  }, [totalPlaqueCount, plaqueCleanedCount, totalDebrisCount, debrisCleanedCount]);

  // Handle Tool Selection
  const handleSelectTool = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    if (tool === 'brush') {
      setCurrentLessonId('brushing');
      setCameraPreset('anterior');
    } else if (tool === 'floss') {
      setCurrentLessonId('flossing');
      setCameraPreset('anterior');
    } else if (tool === 'rinse') {
      setCurrentLessonId('rinsing');
      setCameraPreset('overview');
    }
  }, []);

  // Handle Lesson Selection from Guide Popover
  const handleSelectLesson = useCallback((mode: LessonMode) => {
    setCurrentLessonId(mode);
    if (mode === 'brushing') {
      setActiveTool('brush');
      setCameraPreset('anterior');
    } else if (mode === 'flossing') {
      setActiveTool('floss');
      setCameraPreset('anterior');
    } else if (mode === 'rinsing') {
      setActiveTool('rinse');
      setCameraPreset('overview');
    }
  }, []);

  // Toggle Brush Angle (45° vs 90°)
  const handleToggleBrushAngle = useCallback(() => {
    setBrushAngle((prev) => (prev === 45 ? 90 : 45));
  }, []);

  // Reset Plaque & Debris
  const handleResetPlaque = useCallback(() => {
    setPlaqueSpots(INITIAL_ARCH_PLAQUE);
    setDebrisSpots(INITIAL_ARCH_DEBRIS);
  }, []);

  // Start Simulation & Clean Arch
  const handleStartSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);

    const timer = setTimeout(() => {
      if (activeTool === 'brush') {
        // Modified Bass cleans buccal cervical gumline and occlusal grooves
        setPlaqueSpots((prev) =>
          prev.map((s) => (s.surface === 'buccal' || s.surface === 'occlusal' ? { ...s, cleaned: true } : s))
        );
      } else if (activeTool === 'floss') {
        // C-Shape Floss cleans interdental plaque and removes debris
        setPlaqueSpots((prev) =>
          prev.map((s) => (s.surface === 'interdental' ? { ...s, cleaned: true } : s))
        );
        setDebrisSpots((prev) => prev.map((d) => ({ ...d, cleaned: true })));
      } else if (activeTool === 'rinse') {
        // Therapeutic Rinse cleans remaining loosened biofilm
        setPlaqueSpots((prev) => prev.map((s) => ({ ...s, cleaned: true })));
      }

      setIsSimulating(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [isSimulating, activeTool]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b12] text-slate-100 select-none font-sans">
      {/* 1. Fullscreen 3D Canvas (100vw / 100vh) */}
      <div className="absolute inset-0 w-full h-full">
        <DentalScene
          plaqueSpots={plaqueSpots}
          debrisSpots={debrisSpots}
          disclosingAgentEnabled={disclosingAgentEnabled}
          activeTool={activeTool}
          brushAngle={brushAngle}
          isAnimating={isSimulating}
          currentStep={currentLesson.steps[0]}
          cameraPreset={cameraPreset}
          onCleanPlaque={(id) =>
            setPlaqueSpots((prev) =>
              prev.map((s) => (s.id === id ? { ...s, cleaned: true } : s))
            )
          }
        />
      </div>

      {/* 2. Floating Top Bar */}
      <TopBar
        cleanlinessScore={cleanlinessScore}
        plaqueCleanedCount={plaqueCleanedCount}
        totalPlaqueCount={totalPlaqueCount}
        disclosingAgentEnabled={disclosingAgentEnabled}
        onToggleDisclosingAgent={() => setDisclosingAgentEnabled((prev) => !prev)}
        cameraPreset={cameraPreset}
        onChangeCameraPreset={setCameraPreset}
      />

      {/* 3. Floating Bottom Dock */}
      <BottomDock
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        brushAngle={brushAngle}
        onToggleBrushAngle={handleToggleBrushAngle}
        isSimulating={isSimulating}
        onStartSimulation={handleStartSimulation}
        onResetPlaque={handleResetPlaque}
      />

      {/* 4. Floating Clinical Guide Popover */}
      <GuidePopover
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
      />

      {/* 5. Minimalist 3D Navigation Tip (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[11px] text-slate-400 border border-white/5 backdrop-blur-md">
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span>คลิกซ้าย + ลากเพื่อหมุน 360° | สกอลล์เพื่อซูม</span>
      </div>
    </div>
  );
};

export default App;
