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

  const currentPos = useRef(new THREE.Vector3(0, 0.12, 2.0));
  const currentQuat = useRef(new THREE.Quaternion());
  const targetPos = useRef(new THREE.Vector3(0, 0.12, 2.0));
  const targetQuat = useRef(new THREE.Quaternion());

  // Procedural bristles matrix: 6 tufts along length (X), 3 tufts along height (Y)
  const bristlePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let col = -3; col <= 2; col++) {
      for (let row = -1; row <= 1; row++) {
        list.push([col * 0.09 + 0.045, row * 0.06, -0.09]);
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
    const count = 64;
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

  // Smooth Brushing Physics & Authentic Modified Bass Motion Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // --- 1. TOOTHBRUSH PHYSICS (MODIFIED BASS TECHNIQUE) ---
    if (brushGroupRef.current && activeTool === 'brush') {
      if (isAnimating) {
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface mode (on molar occlusal tables)
          currentPos.current.set(-1.75, 0.72, -0.28 + Math.sin(t * 14) * 0.14);
          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          soundEffects.playScrubSound();
        } else {
          // AUTHENTIC 2-PHASE MODIFIED BASS CYCLE (Jiggle & Sweep)
          const cycleDuration = 3.2; // seconds
          const cycle = t % cycleDuration;

          // Tooth section index progresses across the arch
          const sectionCount = 6;
          const sectionIndex = Math.floor((t / cycleDuration) % sectionCount);
          // Distribute u across arch: anterior to premolars/molars
          const sectionUValues = [0.44, 0.56, 0.32, 0.68, 0.20, 0.80];
          const currentU = sectionUValues[sectionIndex];

          const samplePoint = MANDIBULAR_ARCH_SPLINE.getPoint(currentU);
          const tangent = MANDIBULAR_ARCH_SPLINE.getTangent(currentU).normalize();
          const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
          const upVector = new THREE.Vector3(0, 1, 0);

          // Horizontal alignment: handle follows tangent T, bristles face inward -N
          // If on left side (x > 0), reverse handle direction so it points outwards naturally
          const handleDir = samplePoint.x > 0 ? tangent.clone().negate() : tangent.clone();
          const basisMatrix = new THREE.Matrix4().makeBasis(handleDir, upVector, normal);
          const baseOrientation = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

          // Safe offset from tooth enamel surface (Anti-collision guard)
          const safeOffset = 0.38;
          const sulcusHeight = 0.08; // gingival margin height

          const radBassAngle = (brushAngle * Math.PI) / 180; // default 45°

          if (cycle < 2.2) {
            // --- JIGGLE PHASE (Vibrate 1-2mm in the sulcus for 10 counts) ---
            const jiggleFreq = 38; // ~19 Hz micro-vibration
            const jiggleX = Math.sin(t * jiggleFreq) * 0.022; // 1-2 mm back-and-forth along tangent
            const jiggleY = Math.cos(t * jiggleFreq) * 0.012; // tiny vertical sulcular flex

            const brushPos = samplePoint.clone().addScaledVector(normal, safeOffset);
            brushPos.addScaledVector(handleDir, jiggleX);
            brushPos.y = sulcusHeight + jiggleY;

            // 45° angle pointing downward into sulcus
            const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), radBassAngle);
            targetQuat.current.copy(baseOrientation).multiply(tiltQuat);

            targetPos.current.copy(brushPos);
            soundEffects.playScrubSound();

            // Clear plaque around this tooth section
            if (plaqueSpots && onCleanPlaqueSpot) {
              for (const spot of plaqueSpots) {
                if (!spot.cleaned) {
                  const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                  if (targetPos.current.distanceTo(spotVec) < 0.52) {
                    onCleanPlaqueSpot(spot.id, spot.position);
                    soundEffects.playPopSound(1.0 + Math.random() * 0.25);
                    break;
                  }
                }
              }
            }
          } else {
            // --- SWEEP PHASE (Roll wrist upward away from gums towards crown) ---
            const sweepProgress = (cycle - 2.2) / 0.8; // 0.0 to 1.0
            const easeSweep = Math.sin(sweepProgress * Math.PI * 0.5);

            // Wrist roll angle rotates from 45° sulcular to 85° coronal roll
            const rollAngle = THREE.MathUtils.lerp(radBassAngle, radBassAngle + 0.65, easeSweep);
            const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rollAngle);
            targetQuat.current.copy(baseOrientation).multiply(rollQuat);

            // Sweeps vertically from gumline (0.08) up to occlusal crown tip (0.48)
            const sweepY = THREE.MathUtils.lerp(sulcusHeight, 0.48, easeSweep);
            const sweepOut = safeOffset + Math.sin(sweepProgress * Math.PI) * 0.08;

            const brushPos = samplePoint.clone().addScaledVector(normal, sweepOut);
            brushPos.y = sweepY;
            targetPos.current.copy(brushPos);
          }

          // Smooth Lerp
          currentPos.current.lerp(targetPos.current, 1 - Math.pow(0.001, dt));
          currentQuat.current.slerp(targetQuat.current, 1 - Math.pow(0.001, dt));

          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.quaternion.copy(currentQuat.current);
        }
      } else {
        // --- INTERACTIVE MOUSE-GUIDED MODE (HORIZONTAL TANGENT ALIGNMENT) ---
        const px = state.pointer.x * 2.5;
        const py = state.pointer.y * 1.5;

        // Find nearest sample on the U-arch curve
        let nearestDist = Infinity;
        let bestSample = splineSamples[32]; // default anterior

        for (const s of splineSamples) {
          const dx = px - s.point.x;
          const dz = state.pointer.y * -1.5 - s.point.z;
          const d = dx * dx + dz * dz;
          if (d < nearestDist) {
            nearestDist = d;
            bestSample = s;
          }
        }

        // Horizontal Handle Alignment: Handle follows tangent of the arch
        const tangent = bestSample.tangent;
        const normal = bestSample.normal;
        const upVector = new THREE.Vector3(0, 1, 0);

        const handleDir = bestSample.point.x > 0 ? tangent.clone().negate() : tangent.clone();
        const basisMatrix = new THREE.Matrix4().makeBasis(handleDir, upVector, normal);
        const baseOrientation = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

        // Anti-Collision Offset: Keep brush head securely outside tooth geometry
        const safeOffset = 0.38;
        const mappedY = THREE.MathUtils.clamp(py * 0.75 + 0.16, -0.05, 0.75);

        const goal = bestSample.point.clone().addScaledVector(normal, safeOffset);
        goal.y = mappedY;
        targetPos.current.copy(goal);

        // When near gumline (sulcus zone y in [0.0, 0.24]):
        const isNearSulcus = Math.abs(mappedY - 0.08) < 0.20;
        const radBassAngle = (brushAngle * Math.PI) / 180;

        if (isNearSulcus) {
          // Automatic 45° angle alignment into sulcus + micro-vibrating jiggle
          const jiggle = Math.sin(t * 36) * 0.018;
          targetPos.current.addScaledVector(handleDir, jiggle);
          targetPos.current.y += Math.cos(t * 36) * 0.01;

          const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), radBassAngle);
          targetQuat.current.copy(baseOrientation).multiply(tiltQuat);
          soundEffects.playScrubSound();

          // Plaque cleaning via contact
          if (plaqueSpots && onCleanPlaqueSpot) {
            for (const spot of plaqueSpots) {
              if (!spot.cleaned) {
                const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                if (currentPos.current.distanceTo(spotVec) < 0.50) {
                  onCleanPlaqueSpot(spot.id, spot.position);
                  soundEffects.playPopSound(1.0 + Math.random() * 0.25);
                  break;
                }
              }
            }
          }
        } else {
          // Relaxed angle when away from sulcus
          const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), radBassAngle * 0.5);
          targetQuat.current.copy(baseOrientation).multiply(tiltQuat);
        }

        // Smooth Lerp Interpolation
        currentPos.current.lerp(targetPos.current, 1 - Math.pow(0.001, dt));
        currentQuat.current.slerp(targetQuat.current, 1 - Math.pow(0.001, dt));

        brushGroupRef.current.position.copy(currentPos.current);
        brushGroupRef.current.quaternion.copy(currentQuat.current);
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
      {/* 
        TOOTHBRUSH MODEL:
        Handle lies HORIZONTALLY along local X-axis (Tangent to jaw arch curve!)
        Bristles sprout in -Z (Inward against teeth) and angled 45° into sulcus.
      */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Head: Spans 2-3 teeth horizontally (Length along X = 0.62, Height Y = 0.22, Depth Z = 0.08) */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.62, 0.22, 0.08]} />
            <meshStandardMaterial
              color="#38BDF8" // Pastel Sky Blue
              roughness={0.28}
              metalness={0.04}
            />
          </mesh>

          {/* Ergonomic Neck extending horizontally along +X */}
          <mesh position={[0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.065, 0.44, 16]} />
            <meshStandardMaterial color="#0EA5E9" roughness={0.3} />
          </mesh>

          {/* Friendly Rounded Handle extending horizontally along +X */}
          <mesh position={[1.44, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.095, 1.4, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.32} />
          </mesh>

          {/* Rounded End Cap */}
          <mesh position={[2.14, 0, 0]}>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.32} />
          </mesh>

          {/* Soft Rubber Grip Inlay (Pastel Peach) */}
          <mesh position={[1.35, 0, 0.07]}>
            <boxGeometry args={[0.6, 0.07, 0.025]} />
            <meshStandardMaterial color="#FDA4AF" roughness={0.6} />
          </mesh>

          {/* Soft Bristles: Sprouting from Head towards -Z (Into tooth/sulcus) */}
          <group position={[0, 0, 0]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], pos[2]]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.18, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#FFFFFF' : '#BAE6FD'}
                  roughness={0.35}
                />
              </mesh>
            ))}
          </group>

          {/* 45° Angle Indicator Arrow on the Brush Back */}
          <group position={[0, 0.15, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <mesh>
              <coneGeometry args={[0.035, 0.08, 8]} />
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
