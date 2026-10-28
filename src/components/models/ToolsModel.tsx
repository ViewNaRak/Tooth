import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ToolType, LessonStep } from '../../types/dental';

interface ToolsModelProps {
  activeTool: ToolType;
  brushAngle: number; // degrees, default 45
  isAnimating: boolean;
  currentStep?: LessonStep;
}

export const ToolsModel: React.FC<ToolsModelProps> = ({
  activeTool,
  brushAngle,
  isAnimating,
  currentStep,
}) => {
  const brushGroupRef = useRef<THREE.Group>(null);
  const flossGroupRef = useRef<THREE.Group>(null);
  const rinseGroupRef = useRef<THREE.Group>(null);

  // Procedural bristles array
  const bristlePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let row = -3; row <= 3; row++) {
      for (let col = -1; col <= 1; col++) {
        list.push([col * 0.08, row * 0.08, 0.1]);
      }
    }
    return list;
  }, []);

  // Curve for C-Shape Floss
  const flossCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.65, 0.4),
      new THREE.Vector3(-0.18, 0.25, 0.25),
      new THREE.Vector3(-0.02, 0.08, 0.05),
      new THREE.Vector3(0.18, 0.25, 0.25),
      new THREE.Vector3(0.35, 0.65, 0.4),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.018, 8, false);
  }, []);

  // Animate tools according to clinical movements
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Toothbrush Animation
    if (brushGroupRef.current) {
      if (isAnimating) {
        if (currentStep?.motionType === 'chewing_surface') {
          // Horizontal scrubbing on occlusal surface
          brushGroupRef.current.position.y = 1.05;
          brushGroupRef.current.position.z = Math.sin(t * 14) * 0.12;
          brushGroupRef.current.rotation.x = 0;
          brushGroupRef.current.rotation.z = Math.PI / 2;
        } else {
          // Modified Bass: 45 degree placement + micro-vibration (2-3mm) + periodic sweep
          const cycle = (t * 2) % 3; // 3 second cycle: 2s vibrate, 1s sweep
          const radAngle = (brushAngle * Math.PI) / 180;

          if (cycle < 2.0) {
            // Rapid micro-vibration / circular agitation
            const vibX = Math.cos(t * 28) * 0.035;
            const vibY = Math.sin(t * 28) * 0.025;
            brushGroupRef.current.position.set(-0.62 + vibX, -0.05 + vibY, 0.95);
            brushGroupRef.current.rotation.set(-radAngle, 0, Math.sin(t * 20) * 0.05);
          } else {
            // Sweep motion (coronal flick away from gingiva)
            const sweepProgress = (cycle - 2.0); // 0 to 1
            const sweepY = THREE.MathUtils.lerp(-0.05, 0.45, sweepProgress);
            const sweepZ = THREE.MathUtils.lerp(0.95, 1.15, Math.sin(sweepProgress * Math.PI));
            brushGroupRef.current.position.set(-0.62, sweepY, sweepZ);
            brushGroupRef.current.rotation.set(-radAngle + sweepProgress * 0.5, 0, 0);
          }
        }
      } else {
        // Idle pose resting at 45 degrees along the gumline
        const radAngle = (brushAngle * Math.PI) / 180;
        brushGroupRef.current.position.set(-0.62, -0.05, 0.98);
        brushGroupRef.current.rotation.set(-radAngle, 0, 0);
      }
    }

    // 2. Dental Floss Animation
    if (flossGroupRef.current) {
      if (isAnimating) {
        // Stroke up and down against proximal wall
        const stroke = Math.sin(t * 6) * 0.22;
        flossGroupRef.current.position.set(0, stroke + 0.1, 0);
      } else {
        flossGroupRef.current.position.set(0, 0.15, 0);
      }
    }

    // 3. Rinse Particles Animation
    if (rinseGroupRef.current && isAnimating) {
      rinseGroupRef.current.rotation.y = t * 1.5;
      rinseGroupRef.current.rotation.x = Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group name="clinical-tools">
      {/* TOOTHBRUSH MODEL */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Brush Head */}
          <mesh position={[0, 0, 0.06]} castShadow>
            <boxGeometry args={[0.34, 0.72, 0.09]} />
            <meshStandardMaterial
              color="#0ea5e9"
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>

          {/* Ergonomic Neck */}
          <mesh position={[0, -0.75, 0.03]} rotation={[-0.1, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.9, 16]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>

          {/* Ergonomic Handle */}
          <mesh position={[0, -1.8, 0.0]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 1.4, 16]} />
            <meshStandardMaterial color="#0369a1" roughness={0.35} />
          </mesh>

          {/* Rubber Grip Inlay */}
          <mesh position={[0, -1.6, 0.11]}>
            <boxGeometry args={[0.1, 0.6, 0.03]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.8} />
          </mesh>

          {/* Bristles Tufts (Pointing towards tooth/sulcus) */}
          <group position={[0, 0, -0.05]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], -0.1]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#ffffff' : '#38bdf8'}
                  roughness={0.3}
                  transparent
                  opacity={0.92}
                />
              </mesh>
            ))}
          </group>

          {/* 45-degree Alignment Indicator Arrow */}
          <group position={[0.26, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <mesh>
              <coneGeometry args={[0.04, 0.1, 8]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          </group>
        </group>
      )}

      {/* DENTAL FLOSS MODEL (C-SHAPE) */}
      {activeTool === 'floss' && (
        <group ref={flossGroupRef}>
          {/* C-Shape Tube Strand */}
          <mesh geometry={flossCurve} castShadow>
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.2}
              emissive="#38bdf8"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Finger/Holder Guide Indicators */}
          <mesh position={[-0.38, 0.72, 0.42]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fda4af" roughness={0.6} />
          </mesh>
          <mesh position={[0.38, 0.72, 0.42]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fda4af" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* RINSE / HYDRO-WASH BUBBLES */}
      {activeTool === 'rinse' && (
        <group ref={rinseGroupRef}>
          {isAnimating ? (
            <group>
              {/* Swirling fluid boundary */}
              <mesh>
                <sphereGeometry args={[1.7, 24, 24]} />
                <meshPhysicalMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.2}
                  roughness={0.05}
                  transmission={0.8}
                />
              </mesh>
              {/* Dynamic aeration micro-bubbles */}
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const r = 1.1 + (i % 3) * 0.2;
                const y = ((i % 5) - 2) * 0.25;
                return (
                  <mesh
                    key={i}
                    position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}
                  >
                    <sphereGeometry args={[0.04 + (i % 3) * 0.02, 8, 8]} />
                    <meshStandardMaterial
                      color="#bae6fd"
                      roughness={0.1}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                );
              })}
            </group>
          ) : (
            /* Gentle dispenser / Cup icon representation */
            <group position={[0, 1.4, 0.4]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.16, 0.4, 16]} />
                <meshStandardMaterial
                  color="#0284c7"
                  transparent
                  opacity={0.4}
                  roughness={0.1}
                />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
};
