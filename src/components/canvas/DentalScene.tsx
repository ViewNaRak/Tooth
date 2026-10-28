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
import type { PlaqueSpot, DebrisSpot, ToolType, LessonStep } from '../../types/dental';

interface DentalSceneProps {
  plaqueSpots: PlaqueSpot[];
  debrisSpots: DebrisSpot[];
  disclosingAgentEnabled: boolean;
  activeTool: ToolType;
  brushAngle: number;
  isAnimating: boolean;
  currentStep?: LessonStep;
  cameraPreset: 'front' | 'top' | 'close-interdental' | 'side';
  onCleanPlaque?: (id: string) => void;
}

// Controller to smoothly animate OrbitControls and Camera position when preset changes
const CameraController: React.FC<{ preset: 'front' | 'top' | 'close-interdental' | 'side' }> = ({
  preset,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    let targetPos = new THREE.Vector3(0, 0.4, 4.2);
    let targetLook = new THREE.Vector3(0, 0, 0);

    switch (preset) {
      case 'front':
        targetPos = new THREE.Vector3(0, 0.3, 3.8);
        targetLook = new THREE.Vector3(0, 0.1, 0);
        break;
      case 'top':
        targetPos = new THREE.Vector3(0, 3.8, 0.8);
        targetLook = new THREE.Vector3(0, 0.2, 0);
        break;
      case 'close-interdental':
        targetPos = new THREE.Vector3(0.0, 0.35, 2.2);
        targetLook = new THREE.Vector3(0, 0.2, 0);
        break;
      case 'side':
        targetPos = new THREE.Vector3(3.4, 0.5, 1.8);
        targetLook = new THREE.Vector3(0, 0.1, 0);
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
      maxDistance={7.5}
      maxPolarAngle={Math.PI / 2 + 0.12} // Prevent camera from dropping under the gum base
      target={[0, 0.1, 0]}
    />
  );
};

export const DentalScene: React.FC<DentalSceneProps> = ({
  plaqueSpots,
  debrisSpots,
  disclosingAgentEnabled,
  activeTool,
  brushAngle,
  isAnimating,
  currentStep,
  cameraPreset,
  onCleanPlaque,
}) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.4, 4.0], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Balanced Clinical Studio Lighting */}
        <ambientLight intensity={0.7} color="#f8fafc" />
        
        {/* Main Key Light */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-bias={-0.0001}
          color="#ffffff"
        />

        {/* Cool Fill Light */}
        <directionalLight
          position={[-4, 3, 3]}
          intensity={0.65}
          color="#bae6fd"
        />

        {/* Warm Enamel Rim Light (Gives teeth translucent glow) */}
        <directionalLight
          position={[0, 4, -4]}
          intensity={0.9}
          color="#fef08a"
        />

        {/* Soft Underneath Ambient */}
        <pointLight position={[0, -2, 2]} intensity={0.3} color="#fbcfe8" />

        {/* Camera and Interactive Controls */}
        <CameraController preset={cameraPreset} />

        {/* Core Dental Anatomical Scene Assembly */}
        <group position={[0, -0.15, 0]}>
          <TeethModel />
          <GumsModel />
          <PlaqueModel
            plaqueSpots={plaqueSpots}
            disclosingAgentEnabled={disclosingAgentEnabled}
            onCleanPlaque={onCleanPlaque}
          />
          <DebrisModel debrisSpots={debrisSpots} />
          <ToolsModel
            activeTool={activeTool}
            brushAngle={brushAngle}
            isAnimating={isAnimating}
            currentStep={currentStep}
          />

          {/* Contact Shadows on Base Plane */}
          <ContactShadows
            position={[0, -1.32, 0]}
            opacity={0.45}
            scale={6}
            blur={2}
            far={3}
            color="#0f172a"
          />
        </group>
      </Canvas>
    </div>
  );
};
