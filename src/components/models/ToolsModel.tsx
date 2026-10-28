import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../../utils/soundEffects';
import type { ToolType, LessonStep, PlaqueSpot } from '../../types/dental';

interface ToolsModelProps {
  activeTool: ToolType;
  brushAngle: number; // degrees, default 45
  isAnimating: boolean;
  currentStep?: LessonStep;
  plaqueSpots?: PlaqueSpot[];
  onCleanPlaqueSpot?: (id: string, position: [number, number, number]) => void;
}

export const ToolsModel: React.FC<ToolsModelProps> = ({
  activeTool,
  brushAngle,
  isAnimating,
  currentStep,
  plaqueSpots,
  onCleanPlaqueSpot,
}) => {
  const brushGroupRef = useRef<THREE.Group>(null);
  const flossGroupRef = useRef<THREE.Group>(null);
  const rinseGroupRef = useRef<THREE.Group>(null);

  // Smooth lerp coordinates for pointer tracking
  const targetPos = useRef(new THREE.Vector3(0, 0.2, 1.8));
  const currentPos = useRef(new THREE.Vector3(0, 0.2, 1.8));

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

  // Curve for C-Shape Floss
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

  // Smooth Brushing Physics & Interactive Movement Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // --- 1. TOOTHBRUSH PHYSICS ---
    if (brushGroupRef.current && activeTool === 'brush') {
      if (isAnimating) {
        // Clinical Demonstration Mode: Smooth sweeping traversal along the arch
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface on molars
          currentPos.current.set(-1.72, 0.95, -0.28 + Math.sin(t * 12) * 0.15);
          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          soundEffects.playScrubSound();
        } else {
          // Modified Bass along anterior/premolars
          const cycle = (t * 2) % 3;
          const radAngle = (brushAngle * Math.PI) / 180;
          const archSweepX = Math.sin(t * 1.2) * 0.6;
          const archSweepZ = 1.82 - Math.abs(archSweepX) * 0.25;

          if (cycle < 2.0) {
            // Rapid micro-vibration in the sulcus
            const vibX = Math.cos(t * 26) * 0.035;
            const vibY = Math.sin(t * 26) * 0.025;
            currentPos.current.set(archSweepX + vibX, 0.08 + vibY, archSweepZ);
            brushGroupRef.current.position.copy(currentPos.current);
            brushGroupRef.current.rotation.set(-radAngle, archSweepX * 0.45, Math.sin(t * 20) * 0.04);
            soundEffects.playScrubSound();
          } else {
            // Coronal sweep flick
            const sweepProgress = cycle - 2.0;
            const sweepY = THREE.MathUtils.lerp(0.08, 0.55, sweepProgress);
            const sweepZ = THREE.MathUtils.lerp(archSweepZ, archSweepZ + 0.18, Math.sin(sweepProgress * Math.PI));
            currentPos.current.set(archSweepX, sweepY, sweepZ);
            brushGroupRef.current.position.copy(currentPos.current);
            brushGroupRef.current.rotation.set(-radAngle + sweepProgress * 0.5, archSweepX * 0.45, 0);
          }
        }
      } else {
        // Interactive Mouse-Guided Mode with Silky Lerp
        const px = state.pointer.x;
        const py = state.pointer.y;

        // Map pointer to natural U-shaped dental boundary
        const clampedX = THREE.MathUtils.clamp(px * 2.4, -2.1, 2.1);
        const mappedZ = 1.85 - Math.pow(Math.abs(clampedX) / 2.1, 1.8) * 2.8;
        const mappedY = THREE.MathUtils.clamp(py * 1.2 + 0.1, -0.15, 0.95);

        targetPos.current.set(clampedX, mappedY, mappedZ + 0.15);

        // Smooth Lerp Interpolation (no jerkiness)
        currentPos.current.lerp(targetPos.current, 1 - Math.pow(0.001, dt));
        brushGroupRef.current.position.copy(currentPos.current);

        // Calculate rotation: face perpendicular to arch tangent and tilted at brushAngle
        const radAngle = (brushAngle * Math.PI) / 180;

        // Micro-vibration when near gumline (Bass sulcular zone)
        const isNearGumline = Math.abs(currentPos.current.y - 0.08) < 0.22;
        if (isNearGumline) {
          const vib = Math.sin(t * 24) * 0.02;
          brushGroupRef.current.position.y += vib;
          brushGroupRef.current.rotation.set(-radAngle, (clampedX / 2.1) * 0.8, vib * 2);
          soundEffects.playScrubSound();

          // Check for nearby plaque to clean via proximity!
          if (plaqueSpots && onCleanPlaqueSpot) {
            for (const spot of plaqueSpots) {
              if (!spot.cleaned) {
                const dist = currentPos.current.distanceTo(
                  new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2])
                );
                if (dist < 0.48) {
                  onCleanPlaqueSpot(spot.id, spot.position);
                  soundEffects.playPopSound(1.0 + Math.random() * 0.3);
                  break;
                }
              }
            }
          }
        } else {
          brushGroupRef.current.rotation.set(-radAngle, (clampedX / 2.1) * 0.8, 0);
        }
      }
    }

    // --- 2. DENTAL FLOSS PHYSICS ---
    if (flossGroupRef.current && activeTool === 'floss') {
      if (isAnimating) {
        const stroke = Math.sin(t * 6) * 0.18;
        flossGroupRef.current.position.set(0, stroke, 0);
        soundEffects.playScrubSound();
      } else {
        const pointerY = state.pointer.y * 0.25;
        flossGroupRef.current.position.y = THREE.MathUtils.damp(
          flossGroupRef.current.position.y,
          pointerY + 0.05,
          10,
          dt
        );
      }
    }

    // --- 3. RINSE PARTICLES PHYSICS ---
    if (rinseGroupRef.current && isAnimating) {
      rinseGroupRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group name="clinical-tools">
      {/* TOOTHBRUSH MODEL: Cute Vinyl/Toy Aesthetic */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Brush Head: Soft Rounded Pastel Cyan/Mint */}
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.32, 0.68, 0.09]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>

          {/* Neck: Ergonomic Slim Pastel */}
          <mesh position={[0, -0.65, 0.02]} rotation={[-0.1, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.075, 0.8, 16]} />
            <meshStandardMaterial color="#0EA5E9" roughness={0.3} />
          </mesh>

          {/* Handle: Rounded Friendly Toy Body */}
          <mesh position={[0, -1.6, 0.0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 1.3, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.35} />
          </mesh>

          {/* Soft Rubber Grip Inlay: Pastel Coral/Peach */}
          <mesh position={[0, -1.4, 0.1]}>
            <boxGeometry args={[0.08, 0.5, 0.02]} />
            <meshStandardMaterial color="#FDA4AF" roughness={0.6} />
          </mesh>

          {/* Bristles Tufts: Soft White & Sky Blue */}
          <group position={[0, 0, -0.04]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], -0.09]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.2, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#FFFFFF' : '#BAE6FD'}
                  roughness={0.4}
                />
              </mesh>
            ))}
          </group>

          {/* 45-degree Guide Arrow */}
          <group position={[0.24, 0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <mesh>
              <coneGeometry args={[0.035, 0.09, 8]} />
              <meshBasicMaterial color="#10B981" />
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
              color="#FFFFFF"
              roughness={0.2}
              emissive="#38BDF8"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Friendly Guide Holding Nodes: Pastel Peach */}
          <mesh position={[-0.26, 0.58, 1.76]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color="#F9ABA2" roughness={0.4} />
          </mesh>
          <mesh position={[0.26, 0.58, 1.76]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color="#F9ABA2" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* RINSE / HYDRAULIC SWIRL */}
      {activeTool === 'rinse' && (
        <group ref={rinseGroupRef}>
          {isAnimating ? (
            <group>
              {/* Elliptical fluid volume wrapping arch */}
              <mesh scale={[2.4, 0.9, 2.2]} position={[0, 0.1, 0]}>
                <sphereGeometry args={[1.0, 24, 24]} />
                <meshPhysicalMaterial
                  color="#BAE6FD"
                  transparent
                  opacity={0.22}
                  roughness={0.1}
                  transmission={0.8}
                />
              </mesh>

              {/* Friendly pastel aeration micro-bubbles */}
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
                      color="#FFFFFF"
                      roughness={0.2}
                      transparent
                      opacity={0.8}
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
                  color="#7DD3FC"
                  transparent
                  opacity={0.65}
                  roughness={0.2}
                />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
};
