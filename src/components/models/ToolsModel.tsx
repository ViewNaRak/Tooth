import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../../utils/soundEffects';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';
import type { ToolType, LessonStep, PlaqueSpot } from '../../types/dental';
import type { DemoPhase } from '../ui/LessonCard';

interface ToolsModelProps {
  activeTool: ToolType;
  brushAngle: number; // degrees (e.g. 45 for Modified Bass, 90 for perpendicular)
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

  const currentPos = useRef(new THREE.Vector3(0, 0.26, 1.98));
  const currentQuat = useRef(new THREE.Quaternion());
  const targetPos = useRef(new THREE.Vector3(0, 0.26, 1.98));
  const targetQuat = useRef(new THREE.Quaternion());

  const lastReportedPhase = useRef<DemoPhase>(null);

  // Procedural bristles matrix: 6 columns along X (length), 3 rows along Y (height)
  // Sprouting from head (Z=-0.02) into -Z direction (towards tooth)
  const bristlePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let col = -3; col <= 2; col++) {
      for (let row = -1; row <= 1; row++) {
        list.push([col * 0.09 + 0.045, row * 0.055, -0.13]);
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

  // Pre-calculated orthonormal tooth frames for all 16 teeth
  const toothFrames = useMemo(() => {
    return FULL_DENTAL_ARCH_TEETH.map((tooth) => {
      const pos = new THREE.Vector3(tooth.position[0], tooth.position[1], tooth.position[2]);
      
      // Outward normal in horizontal plane
      let normal = new THREE.Vector3(pos.x, 0, pos.z - 0.1).normalize();
      if (Math.abs(pos.x) < 0.3) {
        normal.set(0, 0, 1); // front teeth face straight outward
      }

      const up = new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(up, normal).normalize();

      // Orthonormal basis matrix: [T, U, N]
      const basisMatrix = new THREE.Matrix4().makeBasis(tangent, up, normal);
      const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

      return {
        id: tooth.id,
        pos,
        normal,
        up,
        tangent,
        baseQuat,
      };
    });
  }, []);

  // Helper to compute target pose for a specific tooth and angle
  // When angleDeg = 90°: bristles point directly into tooth (-N), tilt = 0°
  // When angleDeg = 45°: bristles tilt 45° DOWNWARD into sulcus (-Y direction)
  // cervicalHeight: elevated to 0.26 so bristles touch the bottom edge of white teeth without sinking into gums!
  const getToothBrushPose = (
    targetTooth: typeof toothFrames[0],
    angleDeg: number,
    offsetDist: number = 0.36,
    cervicalHeight: number = 0.26
  ) => {
    const pos = targetTooth.pos.clone().addScaledVector(targetTooth.normal, offsetDist);
    pos.y = cervicalHeight;

    // Tilt angle around local X (handle tangent T)
    // Negative rotation tilts -Z bristles DOWNWARDS into -Y (gingival sulcus)
    const tiltRad = -((90 - angleDeg) * Math.PI) / 180;
    const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tiltRad);
    const quat = targetTooth.baseQuat.clone().multiply(tiltQuat);

    return { pos, quat };
  };

  // Main Brushing Physics & Animation Frame Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // --- 1. TOOTHBRUSH PHYSICS ---
    if (brushGroupRef.current && activeTool === 'brush') {
      if (isAnimating) {
        if (currentStep?.motionType === 'chewing_surface') {
          // Chewing surface mode (on molar occlusal tables)
          const molarFrame = toothFrames[2]; // Right 1st molar
          currentPos.current.set(molarFrame.pos.x, 0.72, molarFrame.pos.z + Math.sin(t * 14) * 0.14);
          brushGroupRef.current.position.copy(currentPos.current);
          brushGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          soundEffects.playScrubSound();
        } else {
          // =========================================================================
          // AUTHENTIC 3-PHASE MODIFIED BASS ROUTINE (Focus on Lower Anterior Incisors)
          // =========================================================================
          const frontTooth = toothFrames[7]; // Central Incisor #41 / Midline
          const cycleDuration = 6.0; // seconds per cycle
          const cycle = t % cycleDuration;

          // Base position elevated at Cervical Line Y = 0.26 (Never sunken in gums!)
          const basePose = getToothBrushPose(frontTooth, brushAngle, 0.36, 0.26);
          let currentPhase: DemoPhase = 'position';

          if (cycle < 1.4) {
            // -----------------------------------------------------------------------
            // จังหวะที่ 1 (Position): ค่อยๆ แตะเข้าที่รอยต่อคอฟัน ทำมุม 45 องศาอย่างนุ่มนวล
            // -----------------------------------------------------------------------
            currentPhase = 'position';
            const easeIn = THREE.MathUtils.smoothstep(cycle, 0, 1.4);

            const startPos = basePose.pos.clone().addScaledVector(frontTooth.normal, 0.16);
            startPos.y += 0.10;

            targetPos.current.lerpVectors(startPos, basePose.pos, easeIn);

            const startPose = getToothBrushPose(frontTooth, 90, 0.36, 0.26);
            targetQuat.current.copy(startPose.quat).slerp(basePose.quat, easeIn);
          } else if (cycle < 4.8) {
            // -----------------------------------------------------------------------
            // จังหวะที่ 2 (Vibrate): สั่นวนสั้นๆ 1-2 มม. ซ้าย-ขวาตรงขอบฟันต่อเนื่อง 3.4 วินาที (Jiggle)
            // -----------------------------------------------------------------------
            currentPhase = 'vibrate';
            const jiggleFreq = 38;
            const jiggleX = Math.sin(t * jiggleFreq) * 0.020; // 1-2 mm along tangent T
            const jiggleY = Math.cos(t * jiggleFreq) * 0.005; // micro sulcular flex

            targetPos.current.copy(basePose.pos);
            targetPos.current.addScaledVector(frontTooth.tangent, jiggleX);
            targetPos.current.y += jiggleY;

            targetQuat.current.copy(basePose.quat);
            soundEffects.playScrubSound();

            // Clear plaque around front teeth with soft foam bursting
            if (plaqueSpots && onCleanPlaqueSpot) {
              for (const spot of plaqueSpots) {
                if (!spot.cleaned) {
                  const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                  if (targetPos.current.distanceTo(spotVec) < 0.65) {
                    onCleanPlaqueSpot(spot.id, spot.position);
                    soundEffects.playPopSound(1.0 + Math.random() * 0.25);
                    break;
                  }
                }
              }
            }
          } else {
            // -----------------------------------------------------------------------
            // จังหวะที่ 3 (Sweep): บิดหัวแปรงและยกตำแหน่งขึ้นตามแกน Y ปัดผ่านตัวฟันสีขาวขึ้นด้านบน (Sweep)
            // -----------------------------------------------------------------------
            currentPhase = 'sweep';
            const sweepProg = (cycle - 4.8) / 1.2; // 0 to 1
            const easeSweep = Math.sin(sweepProg * Math.PI * 0.5);

            // Wrist roll angle tilts from 45° up toward occlusal
            const sweepAngle = THREE.MathUtils.lerp(brushAngle, 95, easeSweep);
            const sweepPose = getToothBrushPose(frontTooth, sweepAngle, 0.36 + Math.sin(sweepProg * Math.PI) * 0.08, 0.26);

            // Elevate upward along crown (from cervical 0.26 to incisal crown tip 0.54!)
            sweepPose.pos.y = THREE.MathUtils.lerp(0.26, 0.54, easeSweep);

            targetPos.current.copy(sweepPose.pos);
            targetQuat.current.copy(sweepPose.quat);
          }

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
        // =========================================================================
        // INTERACTIVE MOUSE-GUIDED MODE (ELEVATED & AUTO-SNAP)
        // =========================================================================
        if (lastReportedPhase.current !== null && onPhaseChange) {
          lastReportedPhase.current = null;
          onPhaseChange(null);
        }

        const pointerX = state.pointer.x * 2.4;
        const pointerY = state.pointer.y * 1.5;

        // Find nearest tooth frame along the arch
        let nearestDist = Infinity;
        let nearestTooth = toothFrames[7]; // default central incisor

        for (const tf of toothFrames) {
          const dx = pointerX - tf.pos.x;
          const dz = state.pointer.y * -1.5 - tf.pos.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < nearestDist) {
            nearestDist = distSq;
            nearestTooth = tf;
          }
        }

        // Clamp height around cervical margin & crown (Never sink below Y = 0.22 into gums!)
        const mappedY = THREE.MathUtils.clamp(pointerY * 0.4 + 0.30, 0.22, 0.58);
        const isNearSulcus = Math.abs(mappedY - 0.26) < 0.12;

        const effectiveAngle = isNearSulcus ? brushAngle : 90;
        const brushPose = getToothBrushPose(nearestTooth, effectiveAngle, 0.36, mappedY);

        if (isNearSulcus) {
          // Jiggle at the cervical line
          const jiggle = Math.sin(t * 36) * 0.016;
          brushPose.pos.addScaledVector(nearestTooth.tangent, jiggle);
          brushPose.pos.y += Math.cos(t * 36) * 0.005;

          soundEffects.playScrubSound();

          // Plaque cleaning via interactive contact
          if (plaqueSpots && onCleanPlaqueSpot) {
            for (const spot of plaqueSpots) {
              if (!spot.cleaned) {
                const spotVec = new THREE.Vector3(spot.position[0], spot.position[1], spot.position[2]);
                if (brushPose.pos.distanceTo(spotVec) < 0.48) {
                  onCleanPlaqueSpot(spot.id, spot.position);
                  soundEffects.playPopSound(1.0 + Math.random() * 0.25);
                  break;
                }
              }
            }
          }
        }

        targetPos.current.copy(brushPose.pos);
        targetQuat.current.copy(brushPose.quat);

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
        flossGroupRef.current.position.set(0, stroke + 0.12, 0);
        soundEffects.playScrubSound();
      } else {
        const pointerY = state.pointer.y * 0.25;
        flossGroupRef.current.position.y = THREE.MathUtils.damp(
          flossGroupRef.current.position.y,
          pointerY + 0.15,
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
        TOOTHBRUSH 3D MODEL:
        - Handle extends along local +X axis (Tangent to jaw arch curve)
        - Bristles sprout from Z=-0.02 into -Z direction (Directly facing teeth)
        - Bristles are clearly visible, elevated at Y=0.26 (Cervical margin)
      */}
      {activeTool === 'brush' && (
        <group ref={brushGroupRef}>
          {/* Sleek Brush Head Backing (Thin 0.04 so bristles are prominent and unobstructed) */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.62, 0.20, 0.04]} />
            <meshStandardMaterial
              color="#38BDF8" // Pastel Sky Blue
              roughness={0.25}
              metalness={0.04}
            />
          </mesh>

          {/* Translucent Bristle Bed Layer */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.58, 0.18, 0.015]} />
            <meshStandardMaterial
              color="#E0F2FE"
              roughness={0.3}
            />
          </mesh>

          {/* Ergonomic Neck extending horizontally along +X */}
          <mesh position={[0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.055, 0.44, 16]} />
            <meshStandardMaterial color="#0EA5E9" roughness={0.28} />
          </mesh>

          {/* Friendly Rounded Handle extending horizontally along +X */}
          <mesh position={[1.44, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 1.4, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.3} />
          </mesh>

          {/* Rounded End Cap */}
          <mesh position={[2.14, 0, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.3} />
          </mesh>

          {/* Soft Rubber Grip Inlay (Pastel Peach) */}
          <mesh position={[1.35, 0, 0.045]}>
            <boxGeometry args={[0.6, 0.065, 0.02]} />
            <meshStandardMaterial color="#FDA4AF" roughness={0.6} />
          </mesh>

          {/* Prominent Visible Bristles: Sprouting from Z=-0.02 into -Z (Straight into tooth/sulcus) */}
          <group position={[0, 0, 0]}>
            {bristlePositions.map((pos, idx) => (
              <mesh key={idx} position={[pos[0], pos[1], pos[2]]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#FFFFFF' : '#BAE6FD'}
                  roughness={0.2}
                  emissive="#FFFFFF"
                  emissiveIntensity={0.15}
                />
              </mesh>
            ))}
          </group>

          {/* 45° Angle Indicator Arrow on the Brush Back pointing down towards sulcus */}
          <group position={[0, 0.02, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
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
        Rendered ONLY during active animation!
        (Completely eliminates any idle cylinder floating in the center of the arch!)
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
