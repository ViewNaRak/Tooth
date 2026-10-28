import React, { useState, useMemo, useCallback } from 'react';
import { Navigation } from 'lucide-react';
import { DentalScene } from './components/canvas/DentalScene';
import { TopBar } from './components/ui/TopBar';
import { BottomDock } from './components/ui/BottomDock';
import { GuidePopover } from './components/ui/GuidePopover';
import type { BurstEvent } from './components/models/ParticlesModel';
import { soundEffects } from './utils/soundEffects';
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
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 3D Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');

  // Biofilm & Debris State across the Full Dental Arch
  const [plaqueSpots, setPlaqueSpots] = useState<PlaqueSpot[]>(INITIAL_ARCH_PLAQUE);
  const [debrisSpots, setDebrisSpots] = useState<DebrisSpot[]>(INITIAL_ARCH_DEBRIS);

  // Burst Particles State
  const [bursts, setBursts] = useState<BurstEvent[]>([]);

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

  // Handle Mute Toggle
  const handleToggleMute = useCallback(() => {
    const newMuted = soundEffects.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundEffects.playPopSound(1.2);
    }
  }, []);

  // Trigger Burst Particle Effect and Clean a Specific Spot
  const handleCleanPlaqueSpot = useCallback(
    (id: string, position: [number, number, number]) => {
      setPlaqueSpots((prev) => {
        const spot = prev.find((s) => s.id === id);
        if (!spot || spot.cleaned) return prev;
        return prev.map((s) => (s.id === id ? { ...s, cleaned: true } : s));
      });

      // Spawn sparkle/foam particle burst
      setBursts((prev) => [
        ...prev.slice(-20), // keep recent bursts only
        {
          id: `${id}-${Date.now()}`,
          position,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // Handle Tool Selection
  const handleSelectTool = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    soundEffects.playPopSound(1.1);
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
    soundEffects.playPopSound(1.1);
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
    setBrushAngle((prev) => {
      const next = prev === 45 ? 90 : 45;
      soundEffects.playPopSound(next === 45 ? 1.3 : 0.9);
      return next;
    });
  }, []);

  // Reset Plaque & Debris
  const handleResetPlaque = useCallback(() => {
    setPlaqueSpots(INITIAL_ARCH_PLAQUE);
    setDebrisSpots(INITIAL_ARCH_DEBRIS);
    soundEffects.playPopSound(0.8);
  }, []);

  // Start Simulation & Clean Arch with Sound & Particle Cascade
  const handleStartSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);

    const timer = setTimeout(() => {
      if (activeTool === 'brush') {
        // Clean buccal and occlusal
        setPlaqueSpots((prev) =>
          prev.map((s) => {
            if (s.surface === 'buccal' || s.surface === 'occlusal') {
              if (!s.cleaned) {
                setBursts((b) => [
                  ...b.slice(-20),
                  { id: `${s.id}-${Date.now()}`, position: s.position, timestamp: Date.now() },
                ]);
              }
              return { ...s, cleaned: true };
            }
            return s;
          })
        );
      } else if (activeTool === 'floss') {
        // Clean interdental plaque and food debris
        setPlaqueSpots((prev) =>
          prev.map((s) => {
            if (s.surface === 'interdental') {
              if (!s.cleaned) {
                setBursts((b) => [
                  ...b.slice(-20),
                  { id: `${s.id}-${Date.now()}`, position: s.position, timestamp: Date.now() },
                ]);
              }
              return { ...s, cleaned: true };
            }
            return s;
          })
        );
        setDebrisSpots((prev) => prev.map((d) => ({ ...d, cleaned: true })));
      } else if (activeTool === 'rinse') {
        // Therapeutic Rinse cleans remaining loosened biofilm
        setPlaqueSpots((prev) =>
          prev.map((s) => {
            if (!s.cleaned) {
              setBursts((b) => [
                ...b.slice(-20),
                { id: `${s.id}-${Date.now()}`, position: s.position, timestamp: Date.now() },
              ]);
            }
            return { ...s, cleaned: true };
          })
        );
      }

      soundEffects.playSparkleChime();
      setIsSimulating(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [isSimulating, activeTool]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FDFBF7] text-earth-dark select-none font-sans">
      {/* 1. Fullscreen 3D Canvas (Warm Cream / Pastel Mood) */}
      <div className="absolute inset-0 w-full h-full">
        <DentalScene
          plaqueSpots={plaqueSpots}
          debrisSpots={debrisSpots}
          bursts={bursts}
          disclosingAgentEnabled={disclosingAgentEnabled}
          activeTool={activeTool}
          brushAngle={brushAngle}
          isAnimating={isSimulating}
          currentStep={currentLesson.steps[0]}
          cameraPreset={cameraPreset}
          onCleanPlaqueSpot={handleCleanPlaqueSpot}
        />
      </div>

      {/* 2. Floating Top Bar with Sound Toggle */}
      <TopBar
        cleanlinessScore={cleanlinessScore}
        plaqueCleanedCount={plaqueCleanedCount}
        totalPlaqueCount={totalPlaqueCount}
        disclosingAgentEnabled={disclosingAgentEnabled}
        onToggleDisclosingAgent={() => {
          setDisclosingAgentEnabled((prev) => !prev);
          soundEffects.playPopSound(1.2);
        }}
        cameraPreset={cameraPreset}
        onChangeCameraPreset={(preset) => {
          setCameraPreset(preset);
          soundEffects.playPopSound(1.0);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 3. Floating Bottom Dock (Rounded-3xl, Pastel Pills) */}
      <BottomDock
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        brushAngle={brushAngle}
        onToggleBrushAngle={handleToggleBrushAngle}
        isSimulating={isSimulating}
        onStartSimulation={handleStartSimulation}
        onResetPlaque={handleResetPlaque}
      />

      {/* 4. Floating Clinical Guide Popover (Large Typography) */}
      <GuidePopover
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
      />

      {/* 5. Minimalist 3D Navigation Tip (Bottom Left, Warm Sand Tone) */}
      <div className="fixed bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-4 py-2 rounded-3xl glass-panel text-xs text-earth-muted border border-stone-200/80 shadow-sm backdrop-blur-xl">
        <Navigation className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-medium">ลากเมาส์เพื่อแปรงฟัน | หมุน 360° | สกอลล์เพื่อซูม</span>
      </div>
    </div>
  );
};

export default App;
