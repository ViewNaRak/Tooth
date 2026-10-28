import React, { useState, useMemo, useCallback } from 'react';
import { DentalScene } from './components/canvas/DentalScene';
import { Header } from './components/ui/Header';
import { LessonGuidePanel } from './components/ui/LessonGuidePanel';
import { ActionFeedbackPanel } from './components/ui/ActionFeedbackPanel';
import { HudOverlay } from './components/ui/HudOverlay';
import {
  DENTAL_LESSONS,
  INITIAL_PLAQUE_SPOTS,
  INITIAL_DEBRIS_SPOTS,
} from './data/dentalLessons';
import type {
  LessonMode,
  ToolType,
  PlaqueSpot,
  DebrisSpot,
} from './types/dental';

export const App: React.FC = () => {
  // Current Lesson & Step State
  const [currentLessonId, setCurrentLessonId] = useState<LessonMode>('brushing');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Tools & Simulation State
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [brushAngle, setBrushAngle] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [disclosingAgentEnabled, setDisclosingAgentEnabled] = useState<boolean>(false);

  // 3D Camera Preset State
  const [cameraPreset, setCameraPreset] = useState<'front' | 'top' | 'close-interdental' | 'side'>('front');

  // Biofilm & Debris State
  const [plaqueSpots, setPlaqueSpots] = useState<PlaqueSpot[]>(INITIAL_PLAQUE_SPOTS);
  const [debrisSpots, setDebrisSpots] = useState<DebrisSpot[]>(INITIAL_DEBRIS_SPOTS);

  const currentLesson = DENTAL_LESSONS[currentLessonId];
  const currentStep = currentLesson.steps[currentStepIndex];

  // Calculate Cleanliness Metrics
  const totalPlaqueCount = plaqueSpots.length;
  const plaqueCleanedCount = plaqueSpots.filter((s) => s.cleaned).length;

  const totalDebrisCount = debrisSpots.length;
  const debrisCleanedCount = debrisSpots.filter((s) => s.cleaned).length;

  const cleanlinessScore = useMemo(() => {
    const totalItems = totalPlaqueCount + totalDebrisCount;
    if (totalItems === 0) return 100;
    const cleanedItems = plaqueCleanedCount + debrisCleanedCount;
    return Math.round((cleanedItems / totalItems) * 100);
  }, [totalPlaqueCount, plaqueCleanedCount, totalDebrisCount, debrisCleanedCount]);

  // Handle Lesson Switching
  const handleSelectLesson = useCallback((lesson: LessonMode) => {
    setCurrentLessonId(lesson);
    setCurrentStepIndex(0);

    // Switch tool & camera according to standard clinical focus
    if (lesson === 'brushing') {
      setActiveTool('brush');
      setCameraPreset('front');
    } else if (lesson === 'flossing') {
      setActiveTool('floss');
      setCameraPreset('close-interdental');
    } else if (lesson === 'rinsing') {
      setActiveTool('rinse');
      setCameraPreset('front');
    }
  }, []);

  // Handle Step Navigation
  const handleSelectStep = useCallback((stepIdx: number) => {
    setCurrentStepIndex(stepIdx);
    const targetStep = currentLesson.steps[stepIdx];
    if (targetStep) {
      if (targetStep.recommendedSurface === 'occlusal') {
        setCameraPreset('top');
      } else if (targetStep.recommendedSurface === 'interdental') {
        setCameraPreset('close-interdental');
      } else {
        setCameraPreset('front');
      }
      setActiveTool(targetStep.recommendedTool);
    }
  }, [currentLesson]);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < currentLesson.steps.length - 1) {
      handleSelectStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, currentLesson, handleSelectStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      handleSelectStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, handleSelectStep]);

  // Clean a specific plaque spot directly
  const handleCleanPlaque = useCallback((id: string) => {
    setPlaqueSpots((prev) =>
      prev.map((spot) => (spot.id === id ? { ...spot, cleaned: true } : spot))
    );
  }, []);

  // Reset Plaque and Food Debris
  const handleResetPlaque = useCallback(() => {
    setPlaqueSpots(INITIAL_PLAQUE_SPOTS);
    setDebrisSpots(INITIAL_DEBRIS_SPOTS);
  }, []);

  // Global Simulation Reset
  const handleResetSimulation = useCallback(() => {
    handleResetPlaque();
    setCurrentStepIndex(0);
    setBrushAngle(45);
    setDisclosingAgentEnabled(false);
    setCameraPreset('front');
  }, [handleResetPlaque]);

  // Run Simulation Action with Clinical Cleaning Effect
  const handleStartSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Progressive cleaning during simulation
    const timer = setTimeout(() => {
      if (activeTool === 'brush') {
        if (currentStep?.recommendedSurface === 'occlusal') {
          // Clean occlusal grooves
          setPlaqueSpots((prev) =>
            prev.map((s) => (s.surface === 'occlusal' ? { ...s, cleaned: true } : s))
          );
        } else {
          // Clean buccal / sulcular margin
          setPlaqueSpots((prev) =>
            prev.map((s) => (s.surface === 'buccal' ? { ...s, cleaned: true } : s))
          );
        }
      } else if (activeTool === 'floss') {
        // Clean interdental plaque and food debris between teeth
        setPlaqueSpots((prev) =>
          prev.map((s) => (s.surface === 'interdental' ? { ...s, cleaned: true } : s))
        );
        setDebrisSpots((prev) => prev.map((d) => ({ ...d, cleaned: true })));
      } else if (activeTool === 'rinse') {
        // Therapeutic rinse loosens any remaining plaque
        setPlaqueSpots((prev) => prev.map((s) => ({ ...s, cleaned: true })));
      }

      setIsSimulating(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [isSimulating, activeTool, currentStep]);

  // Active motion caption for HUD
  const activeMotionCaption = useMemo(() => {
    if (isSimulating) {
      if (activeTool === 'brush') return 'กำลังสั่นวนและปัดตามเทคนิค Modified Bass (45°)';
      if (activeTool === 'floss') return 'กำลังโอบตัวฟันรูปตัว C และรูดขึ้น-ลงในร่องเหงือก';
      return 'กำลังกลั้วน้ำยาบ้วนปากทั่วถึงทุกซอกฟัน (Swishing Action)';
    }
    return `${currentLesson.thaiTitle} - Step ${currentStepIndex + 1}`;
  }, [isSimulating, activeTool, currentLesson, currentStepIndex]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 antialiased font-sans">
      {/* Top Header */}
      <Header
        currentLesson={currentLessonId}
        onSelectLesson={handleSelectLesson}
        disclosingAgentEnabled={disclosingAgentEnabled}
        onToggleDisclosingAgent={() => setDisclosingAgentEnabled((prev) => !prev)}
        onResetSimulation={handleResetSimulation}
      />

      {/* Main Workspace Layout (Left: Guide | Center: 3D Canvas | Right: Feedback) */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Left Educational Guide Panel */}
        <LessonGuidePanel
          lesson={currentLesson}
          currentStepIndex={currentStepIndex}
          onSelectStep={handleSelectStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />

        {/* Center 3D Viewport with HUD Overlay */}
        <main className="flex-1 relative h-[45vh] lg:h-full bg-radial from-slate-900/60 to-slate-950">
          <HudOverlay
            onResetCamera={() => setCameraPreset('front')}
            disclosingAgentEnabled={disclosingAgentEnabled}
            activeMotionText={activeMotionCaption}
          />

          <DentalScene
            plaqueSpots={plaqueSpots}
            debrisSpots={debrisSpots}
            disclosingAgentEnabled={disclosingAgentEnabled}
            activeTool={activeTool}
            brushAngle={brushAngle}
            isAnimating={isSimulating}
            currentStep={currentStep}
            cameraPreset={cameraPreset}
            onCleanPlaque={handleCleanPlaque}
          />
        </main>

        {/* Right Action & Feedback Panel */}
        <ActionFeedbackPanel
          lesson={currentLesson}
          cleanlinessScore={cleanlinessScore}
          plaqueCleanedCount={plaqueCleanedCount}
          totalPlaqueCount={totalPlaqueCount}
          debrisCleanedCount={debrisCleanedCount}
          totalDebrisCount={totalDebrisCount}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          brushAngle={brushAngle}
          onChangeBrushAngle={setBrushAngle}
          isSimulating={isSimulating}
          onStartSimulation={handleStartSimulation}
          onResetPlaque={handleResetPlaque}
          cameraPreset={cameraPreset}
          onChangeCameraPreset={setCameraPreset}
        />
      </div>
    </div>
  );
};

export default App;
