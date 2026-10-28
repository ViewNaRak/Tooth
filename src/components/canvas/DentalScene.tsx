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
import type {
  PlaqueSpot,
  DebrisSpot,
  ToolType,
  LessonStep,
  CameraPreset,
} from '../../types/dental';

interface DentalSceneProps {
  plaqueSpots: PlaqueSpot[];
  debrisSpots: DebrisSpot[];
  disclosingAgentEnabled: boolean;
  activeTool: ToolType;
  brushAngle: number;
  isAnimating: boolean;
  currentStep?: LessonStep;
  cameraPreset: CameraPreset;
  onCleanPlaque?: (id: string) => void;
}

const CameraController: React.FC<{ preset: CameraPreset }> = ({ preset }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    let targetPos = new THREE.Vector3(0, 3.6, 4.8);
    let targetLook = new THREE.Vector3(0, 0.1, 0.1);

    switch (preset) {
      case 'overview':
        targetPos = new THREE.Vector3(0, 3.5, 4.8);
        targetLook = new THREE.Vector3(0, 0.1, 0.2);
        break;
      case 'anterior':
        targetPos = new THREE.Vector3(0, 0.7, 3.6);
        targetLook = new THREE.Vector3(0, 0.25, 1.2);
        break;
      case 'occlusal-top':
        targetPos = new THREE.Vector3(0, 5.2, 0.05);
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
      maxPolarAngle={Math.PI / 2 + 0.12} // Allow viewing all angles without dropping below the floor
      target={[0, 0.1, 0.2]}
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
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 3.5, 4.8], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* Soft Clinical Ambient Light */}
        <ambientLight intensity={0.65} color="#f8fafc" />

        {/* Studio Key Light (Front-Right overhead) */}
        <directionalLight
          position={[5, 7, 5]}
          intensity={1.5}
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
          color="#ffffff"
        />

        {/* Left Cool Fill Light */}
        <directionalLight
          position={[-5, 4, 3]}
          intensity={0.7}
          color="#bae6fd"
        />

        {/* Back Rim Light (Separates molars from background) */}
        <directionalLight
          position={[0, 5, -5]}
          intensity={0.85}
          color="#fef08a"
        />

        {/* Underneath Soft Warm Light */}
        <pointLight position={[0, -2, 1]} intensity={0.35} color="#fda4af" />

        {/* Smooth 360 Orbit Controller */}
        <CameraController preset={cameraPreset} />

        {/* Full Mandibular Dental Arch Assembly */}
        <group position={[0, -0.1, 0]}>
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
            position={[0, -0.96, 0]}
            opacity={0.4}
            scale={8}
            blur={2.2}
            far={4}
            color="#020617"
          />
        </group>
      </Canvas>
    </div>
  );
};
