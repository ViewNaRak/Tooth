import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MANDIBULAR_ARCH_SPLINE } from '../../data/dentalLessons';

export const GumsModel: React.FC = () => {
  // 1. Marginal Gingival Collar Tube (Top layer hugging tooth roots)
  const collarGeometry = useMemo(() => {
    // 64 tubular segments, radius 0.34, 20 radial segments for round smoothness
    return new THREE.TubeGeometry(MANDIBULAR_ARCH_SPLINE, 64, 0.34, 20, false);
  }, []);

  // 2. Attached Gingival Alveolar Tube (Lower layer forming jaw arch contour)
  const baseRidgeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(MANDIBULAR_ARCH_SPLINE, 64, 0.44, 20, false);
  }, []);

  return (
    <group name="anatomical-u-arch-gums">
      {/* Upper Marginal Gingiva Collar: Hugs tooth roots snugly */}
      <mesh
        geometry={collarGeometry}
        position={[0, 0.02, 0]}
        scale={[1.0, 0.8, 1.0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#F4978E" // Soft Pastel Peach
          roughness={0.4}  // Clay semi-gloss
          metalness={0.02}
        />
      </mesh>

      {/* Lower Attached Gingiva Base: Smoothly curves along the jawline without any flat disc */}
      <mesh
        geometry={baseRidgeGeometry}
        position={[0, -0.22, 0]}
        scale={[1.04, 0.82, 1.04]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#EE887F" // Slightly deeper peach tone for natural depth
          roughness={0.42}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
};
