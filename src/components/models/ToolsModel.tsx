import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../../utils/soundEffects';
import { MANDIBULAR_ARCH_SPLINE } from '../../data/dentalLessons';
import type { ToolType, LessonStep, PlaqueSpot } from '../../types/dental';
import type { DemoPhase } from '../ui/LessonCard';

interface ToolsModelProps {
  activeTool: ToolType;
  brushAngle: number; // degrees, default 45
  isAnimating: boolean;
  currentStep?: LessonStep;
  plaqueSpots?: PlaqueSpot[];
  onCleanPlaqueSpot?: (id: string, position: [number, number, number]) => void;
  onPhaseChange?: (phase: DemoPhase) => void;
}

export const ToolsModel: React.FC<ToolsModelProps> = ({
  activeTool,
  brushAngle,
  isAnimating,
  currentStep,
  plaqueSpots,
  onCleanPlaqueSpot,
  onPhaseChange,
}) => {
  const brushGroupRef = useRef<THREE.Group>(null);
  const flossGroupRef = useRef<THREE.Group>(null);
  const rinseGroupRef = useRef<THREE.Group>(null);

  const currentPos = useRef(new THREE.Vector3(0, 0.12, 2.0));
  const currentQuat = useRef(new THREE.Quaternion());
  const targetPos = useRef(new THREE.Vector3(0, 0.12, 2.0));
  const targetQuat = useRef(new THREE.Quaternion());

  const lastReportedPhase = useRef<DemoPhase>(null);

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
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      samples.push({ t: u, point: pt, tangent, normal });
    }
    return samples;
  }, []);

  // Brushing Physics & Authentic Modified Bass Motion Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // --- 1. TOOTHBRUSH PHYSICS (MODIFIED BASS ROUTINE) ---
    if (brushGroupRef.current && activeTool === 'brush') {
      if (isAnimating) {
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface mode (on molar occlusal tables)
          currentPos.current.set(-1.75, 0.72, -0.28 + Math.sin(t * 14) * 0.14);
          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          soundEffects.playScrubSound();
        } else {
          // AUTHENTIC 3-PHASE DEMO ROUTINE (Focus on Lower Anterior Teeth)
          const cycleDuration = 5.8; // seconds per full cycle
          const cycle = t % cycleDuration;

          // Focus explicitly on the front lower teeth (#41, #31, #42)
          const targetPoint = new THREE.Vector3(0, 0.08, 1.62); // anterior tooth curve center
          const normal = new THREE.Vector3(0, 0, 1);            // facing straight outward to viewer
          const tangent = new THREE.Vector3(1, 0, 0);           // horizontal handle along X
          const upVector = new THREE.Vector3(0, 1, 0);

          // Horizontal handle orientation
          const basisMatrix = new THREE.Matrix4().makeBasis(tangent, upVector, normal);
          const baseOrientation = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

          // Strict collision offset: brush head sits outside tooth enamel, bristles touch sulcus gently
          const safeOffset = 0.44;
          const sulcusHeight = 0.08;
          const radBassAngle = (brushAngle * Math.PI) / 180; // 45 degrees

          let currentPhase: DemoPhase = 'position';

          if (cycle < 1.2) {
            // === จังหวะที่ 1 (Position/Approach): ค่อยๆ แตะเข้าที่คอฟัน ทำมุม 45 องศา ===
            currentPhase = 'position';
            const easeIn = THREE.MathUtils.smoothstep(cycle, 0, 1.2);
            const brushPos = targetPoint.clone().addScaledVector(normal, safeOffset + (1 - easeIn) * 0.15);
            brushPos.y = sulcusHeight + (1 - easeIn) * 0.2;

            const tiltAngle = radBassAngle * easeIn;
            const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tiltAngle);
            targetQuat.current.copy(baseOrientation).multiply(tiltQuat);
            targetPos.current.copy(brushPos);
          } else if (cycle < 4.6) {
            // === จังหวะที่ 2 (Vibrate/Jiggle): สั่นวนสั้นๆ 1-2 มม. ต่อเนื่อง 3.4 วินาที ===
            currentPhase = 'vibrate';
            const jiggleFreq = 36;
            const jiggleX = Math.sin(t * jiggleFreq) * 0.022; // 1-2 mm horizontal micro-vibration
            const jiggleY = Math.cos(t * jiggleFreq) * 0.010; // tiny vertical sulcular flex

            const brushPos = targetPoint.clone().addScaledVector(normal, safeOffset);
            brushPos.x += jiggleX;
            brushPos.y = sulcusHeight + jiggleY;

            const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), radBassAngle);
            targetQuat.current.copy(baseOrientation).multiply(tiltQuat);
            targetPos.current.copy(brushPos);

            soundEffects.playScrubSound();

            // Clear plaque around front teeth with soft foam bursting
            if (plaqueSpots && onCleanPlaqueSpot) {
              for (const spot of plaqueSpots) {
                if (!spot.cleaned) {
                  const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                  if (targetPos.current.distanceTo(spotVec) < 0.6) {
                    onCleanPlaqueSpot(spot.id, spot.position);
                    soundEffects.playPopSound(1.0 + Math.random() * 0.25);
                    break;
                  }
                }
              }
            }
          } else {
            // === จังหวะที่ 3 (Sweep/Roll): บิดข้อมือปัดขนแปรงขึ้นด้านบนผ่านหน้าฟัน ===
            currentPhase = 'sweep';
            const sweepProg = (cycle - 4.6) / 1.2; // 0 to 1
            const easeSweep = Math.sin(sweepProg * Math.PI * 0.5);

            // Wrist roll angle
            const rollAngle = THREE.MathUtils.lerp(radBassAngle, radBassAngle + 0.65, easeSweep);
            const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rollAngle);
            targetQuat.current.copy(baseOrientation).multiply(rollQuat);

            // Sweep upward from sulcus (0.08) to incisal tip (0.50)
            const sweepY = THREE.MathUtils.lerp(sulcusHeight, 0.50, easeSweep);
            const sweepOut = safeOffset + Math.sin(sweepProg * Math.PI) * 0.10;

            const brushPos = targetPoint.clone().addScaledVector(normal, sweepOut);
            brushPos.y = sweepY;
            targetPos.current.copy(brushPos);
          }

          // Report real-time phase change to UI
          if (onPhaseChange && currentPhase !== lastReportedPhase.current) {
            lastReportedPhase.current = currentPhase;
            onPhaseChange(currentPhase);
          }

          // Smooth Lerp/Slerp
          currentPos.current.lerp(targetPos.current, 1 - Math.pow(0.001, dt));
          currentQuat.current.slerp(targetQuat.current, 1 - Math.pow(0.001, dt));

          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.quaternion.copy(currentQuat.current);
        }
      } else {
        // --- INTERACTIVE MOUSE-GUIDED MODE (HORIZONTAL TANGENT ALIGNMENT) ---
        if (lastReportedPhase.current !== null && onPhaseChange) {
          lastReportedPhase.current = null;
          onPhaseChange(null);
        }

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

        const tangent = bestSample.tangent;
        const normal = bestSample.normal;
        const upVector = new THREE.Vector3(0, 1, 0);

        const handleDir = bestSample.point.x > 0 ? tangent.clone().negate() : tangent.clone();
        const basisMatrix = new THREE.Matrix4().makeBasis(handleDir, upVector, normal);
        const baseOrientation = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

        // Anti-Collision Offset
        const safeOffset = 0.42;
        const mappedY = THREE.MathUtils.clamp(py * 0.75 + 0.16, -0.05, 0.75);

        const goal = bestSample.point.clone().addScaledVector(normal, safeOffset);
        goal.y = mappedY;
        targetPos.current.copy(goal);

        const isNearSulcus = Math.abs(mappedY - 0.08) < 0.20;
        const radBassAngle = (brushAngle * Math.PI) / 180;

        if (isNearSulcus) {
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
          const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), radBassAngle * 0.5);
          targetQuat.current.copy(baseOrientation).multiply(tiltQuat);
        }

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
        Handle extends HORIZONTALLY along local +X axis (Tangent to jaw arch curve)
        Bristles point in -Z (Inward against teeth) and angled 45° into sulcus.
      */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Head: Spans 2-3 teeth horizontally */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.62, 0.22, 0.08]} />
            <meshStandardMaterial
              color="#38BDF8"
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

      {/* 
        RINSE SWIRL:
        ONLY rendered during active animation! (Completely removes any idle blue cylinder hovering in the teeth!)
      */}
      {activeTool === 'rinse' && isAnimating && (
        <group ref={rinseGroupRef}>
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
      )}
    </group>
  );
};
