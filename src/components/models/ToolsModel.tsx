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
        list.push([col * 0.07, row * 0.07, 0.08]);
      }
    }
    return list;
  }, []);

  // Curve for C-Shape Floss embracing central tooth
  const flossCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.55, 1.75),
      new THREE.Vector3(-0.12, 0.28, 1.62),
      new THREE.Vector3(0.0, 0.15, 1.52),
      new THREE.Vector3(0.12, 0.28, 1.62),
      new THREE.Vector3(0.25, 0.55, 1.75),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
  }, []);

  // Dynamic animation loop for tools on the full dental arch
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Toothbrush Animation
    if (brushGroupRef.current) {
      if (isAnimating) {
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface (Molar Occlusal table)
          brushGroupRef.current.position.set(-1.72, 0.95, -0.28);
          brushGroupRef.current.position.z += Math.sin(t * 14) * 0.15;
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
        } else {
          // Modified Bass: Traveling along the arch at 45° with micro-vibration
          const cycle = (t * 2) % 3; // 2s vibrate, 1s sweep
          const radAngle = (brushAngle * Math.PI) / 180;

          // Slow travel along anterior teeth
          const archSweepX = Math.sin(t * 1.2) * 0.4;
          const archSweepZ = 1.82 - Math.abs(archSweepX) * 0.15;

          if (cycle < 2.0) {
            // Rapid micro-vibration (2-3mm)
            const vibX = Math.cos(t * 28) * 0.035;
            const vibY = Math.sin(t * 28) * 0.025;
            brushGroupRef.current.position.set(archSweepX + vibX, 0.08 + vibY, archSweepZ);
            brushGroupRef.current.rotation.set(-radAngle, archSweepX * 0.5, Math.sin(t * 20) * 0.04);
          } else {
            // Sweep motion (coronal sweep away from gumline)
            const sweepProgress = (cycle - 2.0); // 0 to 1
            const sweepY = THREE.MathUtils.lerp(0.08, 0.55, sweepProgress);
            const sweepZ = THREE.MathUtils.lerp(archSweepZ, archSweepZ + 0.18, Math.sin(sweepProgress * Math.PI));
            brushGroupRef.current.position.set(archSweepX, sweepY, sweepZ);
            brushGroupRef.current.rotation.set(-radAngle + sweepProgress * 0.5, archSweepX * 0.5, 0);
          }
        }
      } else {
        // Idle pose at central anterior arch
        const radAngle = (brushAngle * Math.PI) / 180;
        brushGroupRef.current.position.set(0, 0.08, 1.85);
        brushGroupRef.current.rotation.set(-radAngle, 0, 0);
      }
    }

    // 2. Dental Floss Animation
    if (flossGroupRef.current) {
      if (isAnimating) {
        const stroke = Math.sin(t * 6) * 0.18;
        flossGroupRef.current.position.set(0, stroke, 0);
      } else {
        flossGroupRef.current.position.set(0, 0.05, 0);
      }
    }

    // 3. Rinse Fluid Waves
    if (rinseGroupRef.current && isAnimating) {
      rinseGroupRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group name="clinical-tools">
      {/* TOOTHBRUSH MODEL */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Brush Head */}
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.3, 0.65, 0.08]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>

          {/* Neck */}
          <mesh position={[0, -0.65, 0.02]} rotation={[-0.1, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.8, 16]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} />
          </mesh>

          {/* Handle */}
          <mesh position={[0, -1.6, 0.0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.3, 16]} />
            <meshStandardMaterial color="#075985" roughness={0.35} />
          </mesh>

          {/* Grip Inlay */}
          <mesh position={[0, -1.4, 0.1]}>
            <boxGeometry args={[0.08, 0.5, 0.02]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.8} />
          </mesh>

          {/* Bristles Tufts */}
          <group position={[0, 0, -0.04]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], -0.09]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.2, 6]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#ffffff' : '#38bdf8'}
                  roughness={0.3}
                  transparent
                  opacity={0.94}
                />
              </mesh>
            ))}
          </group>

          {/* 45-degree Guide Arrow */}
          <group position={[0.24, 0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <mesh>
              <coneGeometry args={[0.035, 0.09, 8]} />
              <meshBasicMaterial color="#10b981" />
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
              roughness={0.15}
              emissive="#38bdf8"
              emissiveIntensity={0.35}
            />
          </mesh>

          {/* Guide Hold Nodes */}
          <mesh position={[-0.26, 0.58, 1.76]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#fda4af" roughness={0.6} />
          </mesh>
          <mesh position={[0.26, 0.58, 1.76]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#fda4af" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* RINSE / HYDRAULIC SWIRL PARTICLES */}
      {activeTool === 'rinse' && (
        <group ref={rinseGroupRef}>
          {isAnimating ? (
            <group>
              {/* Elliptical fluid volume wrapping full dental arch */}
              <mesh scale={[2.4, 0.9, 2.2]} position={[0, 0.1, 0]}>
                <sphereGeometry args={[1.0, 24, 24]} />
                <meshPhysicalMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.18}
                  roughness={0.05}
                  transmission={0.85}
                  ior={1.33}
                />
              </mesh>

              {/* Dynamic aerated micro-bubbles along full arch */}
              {[...Array(32)].map((_, i) => {
                const angle = (i / 32) * Math.PI * 2;
                const rx = 1.9 + (i % 3) * 0.2;
                const rz = 1.6 + (i % 4) * 0.2;
                const y = ((i % 5) - 2) * 0.18;
                return (
                  <mesh
                    key={i}
                    position={[Math.sin(angle) * rx, y, Math.cos(angle) * rz]}
                  >
                    <sphereGeometry args={[0.045 + (i % 3) * 0.02, 8, 8]} />
                    <meshStandardMaterial
                      color="#e0f2fe"
                      roughness={0.1}
                      transparent
                      opacity={0.75}
                    />
                  </mesh>
                );
              })}
            </group>
          ) : (
            <group position={[0, 1.6, 1.2]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.18, 0.38, 16]} />
                <meshStandardMaterial
                  color="#0284c7"
                  transparent
                  opacity={0.5}
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
