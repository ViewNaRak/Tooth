import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../../utils/soundEffects';
import { MANDIBULAR_ARCH_SPLINE } from '../../data/dentalLessons';
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

  const currentPos = useRef(new THREE.Vector3(0, 0.18, 2.0));
  const targetPos = useRef(new THREE.Vector3(0, 0.18, 2.0));

  // Bristles matrix
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
      new THREE.Vector3(-0.25, 0.52, 1.76),
      new THREE.Vector3(-0.12, 0.26, 1.62),
      new THREE.Vector3(0.0, 0.14, 1.52),
      new THREE.Vector3(0.12, 0.26, 1.62),
      new THREE.Vector3(0.25, 0.52, 1.76),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
  }, []);

  // Pre-sampled points on the spline for fast distance / normal calculation
  const splineSamples = useMemo(() => {
    const samples: { t: number; point: THREE.Vector3; tangent: THREE.Vector3; normal: THREE.Vector3 }[] = [];
    const count = 48;
    for (let i = 0; i <= count; i++) {
      const u = i / count;
      const pt = MANDIBULAR_ARCH_SPLINE.getPoint(u);
      const tangent = MANDIBULAR_ARCH_SPLINE.getTangent(u).normalize();
      // Outward buccal normal perpendicular to tangent and up vector
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      samples.push({ t: u, point: pt, tangent, normal });
    }
    return samples;
  }, []);

  // Brushing Physics & Modified Bass Motion Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // --- 1. TOOTHBRUSH PHYSICS ---
    if (brushGroupRef.current && activeTool === 'brush') {
      if (isAnimating) {
        // Clinical Demonstration Mode
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface (Molar Occlusal table)
          currentPos.current.set(-1.75, 0.72, -0.28 + Math.sin(t * 14) * 0.15);
          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          soundEffects.playScrubSound();
        } else {
          // Modified Bass along anterior & premolars
          const cycle = (t * 1.8) % 3.0; // 3-second cycle (2.2s vibrating, 0.8s sweep)
          const travelT = (Math.sin(t * 0.8) + 1) * 0.5; // oscillate between right & left
          const sample = MANDIBULAR_ARCH_SPLINE.getPoint(travelT);
          const tangent = MANDIBULAR_ARCH_SPLINE.getTangent(travelT).normalize();
          const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

          // Safe offset so brush head never sinks into tooth enamel
          const safeOffset = 0.44;
          const radAngle = (brushAngle * Math.PI) / 180;
          const yaw = Math.atan2(normal.x, normal.z);

          if (cycle < 2.2) {
            // Rapid micro-vibration in the sulcus (2-3mm amplitude)
            const vib = Math.sin(t * 26) * 0.025;
            const vibPos = sample.clone().addScaledVector(normal, safeOffset);
            vibPos.y = 0.08 + vib;
            currentPos.current.copy(vibPos);
            brushGroupRef.current.position.copy(currentPos.current);
            brushGroupRef.current.rotation.set(-radAngle, yaw, vib * 3);
            soundEffects.playScrubSound();
          } else {
            // Smooth Coronal Sweep flick away from gums towards incisal edges
            const sweepProg = (cycle - 2.2) / 0.8; // 0 to 1
            const sweepPos = sample.clone().addScaledVector(normal, safeOffset + sweepProg * 0.12);
            sweepPos.y = THREE.MathUtils.lerp(0.08, 0.52, sweepProg);
            currentPos.current.copy(sweepPos);
            brushGroupRef.current.position.copy(currentPos.current);
            brushGroupRef.current.rotation.set(-radAngle + sweepProg * 0.45, yaw, 0);
          }
        }
      } else {
        // Interactive Mouse-Guided Mode with Smooth Lerp & Anti-Collision
        const px = state.pointer.x * 2.5;
        const py = state.pointer.y * 1.5;

        // Find nearest sample on the U-arch curve
        let nearestDist = Infinity;
        let bestSample = splineSamples[24]; // default anterior

        for (const s of splineSamples) {
          const dx = px - s.point.x;
          const dz = state.pointer.y * -1.5 - s.point.z;
          const d = dx * dx + dz * dz;
          if (d < nearestDist) {
            nearestDist = d;
            bestSample = s;
          }
        }

        // Collision Offset: Prevent sinking into tooth body
        const minDistance = 0.42; // safe distance outside tooth crown
        const mappedY = THREE.MathUtils.clamp(py * 0.8 + 0.18, -0.05, 0.85);

        // Position brush outside the tooth arch along the normal vector
        const goal = bestSample.point.clone().addScaledVector(bestSample.normal, minDistance);
        goal.y = mappedY;
        targetPos.current.copy(goal);

        // Smooth Lerp Interpolation
        currentPos.current.lerp(targetPos.current, 1 - Math.pow(0.001, dt));
        brushGroupRef.current.position.copy(currentPos.current);

        // Automatic 45° angle orientation towards the sulcus
        const yaw = Math.atan2(bestSample.normal.x, bestSample.normal.z);
        const radAngle = (brushAngle * Math.PI) / 180;

        // When near gumline (sulcular zone y in [0.0, 0.28]):
        const isNearSulcus = Math.abs(currentPos.current.y - 0.08) < 0.22;
        if (isNearSulcus) {
          // Automatic 45-degree angle tilt into the sulcus
          const vib = Math.sin(t * 24) * 0.02;
          brushGroupRef.current.position.y += vib;
          brushGroupRef.current.rotation.set(-radAngle, yaw, vib * 2);
          soundEffects.playScrubSound();

          // Check proximity to plaque spots to trigger soft foam burst
          if (plaqueSpots && onCleanPlaqueSpot) {
            for (const spot of plaqueSpots) {
              if (!spot.cleaned) {
                const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                const dist = currentPos.current.distanceTo(spotVec);
                if (dist < 0.48) {
                  onCleanPlaqueSpot(spot.id, spot.position);
                  soundEffects.playPopSound(1.0 + Math.random() * 0.3);
                  break;
                }
              }
            }
          }
        } else {
          brushGroupRef.current.rotation.set(-radAngle * 0.6, yaw, 0);
        }
      }
    }

    // --- 2. DENTAL FLOSS PHYSICS ---
    if (flossGroupRef.current && activeTool === 'floss') {
      if (isAnimating) {
        const stroke = Math.sin(t * 6) * 0.16;
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
      {/* TOOTHBRUSH MODEL: Soft Pastel Clay/Toy Aesthetic with Rounded Parts */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Rounded Brush Head: Soft Pastel Sky/Cyan */}
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.30, 0.64, 0.08]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.32}
              metalness={0.04}
            />
          </mesh>

          {/* Ergonomic Neck */}
          <mesh position={[0, -0.62, 0.02]} rotation={[-0.08, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.075, 0.75, 16]} />
            <meshStandardMaterial color="#0EA5E9" roughness={0.3} />
          </mesh>

          {/* Friendly Rounded Handle */}
          <mesh position={[0, -1.5, 0.0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 1.25, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.35} />
          </mesh>

          {/* Soft Rubber Grip Inlay: Pastel Peach */}
          <mesh position={[0, -1.35, 0.09]}>
            <boxGeometry args={[0.075, 0.45, 0.02]} />
            <meshStandardMaterial color="#FDA4AF" roughness={0.6} />
          </mesh>

          {/* Soft Bristles Tufts: Soft White & Light Sky Blue */}
          <group position={[0, 0, -0.04]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], -0.085]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.19, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#FFFFFF' : '#BAE6FD'}
                  roughness={0.35}
                />
              </mesh>
            ))}
          </group>

          {/* 45-degree Alignment Indicator Arrow */}
          <group position={[0.22, 0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
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
          <mesh geometry={flossCurve} castShadow>
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.18}
              emissive="#38BDF8"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Holding Nodes */}
          <mesh position={[-0.26, 0.55, 1.76]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color="#F9ABA2" roughness={0.4} />
          </mesh>
          <mesh position={[0.26, 0.55, 1.76]}>
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
            <group position={[0, 1.5, 1.2]}>
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
