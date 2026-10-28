import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { TeethModel } from '../models/TeethModel';
import { GumsModel } from '../models/GumsModel';
import { PlaqueModel } from '../models/PlaqueModel';
import { DebrisModel } from '../models/DebrisModel';
import { ToolsModel } from '../models/ToolsModel';
import { ParticlesModel, type BurstEvent } from '../models/ParticlesModel';
import type {
  PlaqueSpot,
  DebrisSpot,
  ToolType,
  LessonStep,
  CameraPreset,
} from '../../types/dental';
import type { DemoPhase } from '../ui/LessonCard';

interface DentalSceneProps {
  plaqueSpots: PlaqueSpot[];
  debrisSpots: DebrisSpot[];
  bursts: BurstEvent[];
  disclosingAgentEnabled: boolean;
  activeTool: ToolType;
  brushAngle: number;
  isAnimating: boolean;
  currentStep?: LessonStep;
  cameraPreset: CameraPreset;
  onCleanPlaqueSpot: (id: string, position: [number, number, number]) => void;
  onPhaseChange?: (phase: DemoPhase) => void;
}

const CameraController: React.FC<{ preset: CameraPreset }> = ({ preset }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    let targetPos = new THREE.Vector3(0, 3.4, 4.7);
    let targetLook = new THREE.Vector3(0, 0.1, 0.1);

    switch (preset) {
      case 'overview':
        targetPos = new THREE.Vector3(0, 3.4, 4.7);
        targetLook = new THREE.Vector3(0, 0.1, 0.2);
        break;
      case 'demo-focus':
        // 3/4 Side Profile Perspective: Clearly shows bristle tips contacting the cervical margin at 45°
        targetPos = new THREE.Vector3(1.15, 0.52, 2.45);
        targetLook = new THREE.Vector3(0.05, 0.28, 1.62);
        break;
      case 'anterior':
        targetPos = new THREE.Vector3(0, 0.65, 3.6);
        targetLook = new THREE.Vector3(0, 0.25, 1.2);
        break;
      case 'occlusal-top':
        targetPos = new THREE.Vector3(0, 5.0, 0.05);
        targetLook = new THREE.Vector3(0, 0, 0);
        break;
      case 'left-molars':
        targetPos = new THREE.Vector3(3.8, 1.6, 0.4);
        targetLook = new THREE.Vector3(1.7, 0.2, -0.4);
        break;
      case 'right-molars':
        targetPos = new THREE.Vector3(-3.8, 1.6, 0.4);
        targetLook = new THREE.Vector3(-1.7, 0.2, -0.4);
        break;
    }

    camera.position.copy(targetPos);
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLook);
      controlsRef.current.update();
    }
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.8}
      maxDistance={9.5}
      maxPolarAngle={Math.PI / 2 + 0.1}
      target={[0, 0.1, 0.2]}
    />
  );
};

export const DentalScene: React.FC<DentalSceneProps> = ({
  plaqueSpots,
  debrisSpots,
  bursts,
  disclosingAgentEnabled,
  activeTool,
  brushAngle,
  isAnimating,
  currentStep,
  cameraPreset,
  onCleanPlaqueSpot,
  onPhaseChange,
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 3.4, 4.7], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* Soft Warm Ambient Light (Removes harsh dark shadows for Clay look) */}
        <ambientLight intensity={1.1} color="#FFFBF0" />

        {/* Studio Key Light: Warm soft cream */}
        <directionalLight
          position={[4, 7, 5]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={18}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
          color="#FFFDF7"
        />

        {/* Soft Peach/Sand Fill Light */}
        <directionalLight
          position={[-4, 4, 3]}
          intensity={0.75}
          color="#FFE8DB"
        />

        {/* Top-Back Warm Highlight */}
        <directionalLight
          position={[0, 5, -4]}
          intensity={0.65}
          color="#FFF2D6"
        />

        {/* Camera Controller */}
        <CameraController preset={cameraPreset} />

        {/* Full Dental Arch Assembly */}
        <group position={[0, -0.1, 0]}>
          <TeethModel />
          <GumsModel />
          <PlaqueModel
            plaqueSpots={plaqueSpots}
            disclosingAgentEnabled={disclosingAgentEnabled}
          />
          <DebrisModel debrisSpots={debrisSpots} />
          <ToolsModel
            activeTool={activeTool}
            brushAngle={brushAngle}
            isAnimating={isAnimating}
            currentStep={currentStep}
            plaqueSpots={plaqueSpots}
            onCleanPlaqueSpot={onCleanPlaqueSpot}
            onPhaseChange={onPhaseChange}
          />
          <ParticlesModel bursts={bursts} />

          {/* Gentle Soft Contact Shadows */}
          <ContactShadows
            position={[0, -0.96, 0]}
            opacity={0.22}
            scale={8}
            blur={2.8}
            far={4}
            color="#785B49"
          />
        </group>
      </Canvas>
    </div>
  );
};
