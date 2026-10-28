import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';
import type { ToothInfo, ToothClassification } from '../../types/dental';

// Helper to create anatomically differentiated tooth crowns
function createToothGeometry(classification: ToothClassification): THREE.BufferGeometry {
  if (classification === 'incisor') {
    // Chisel / spade shape (flat incisal edge, thin anteroposteriorly)
    const geom = new THREE.BoxGeometry(0.85, 1.25, 0.55, 12, 12, 12);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.625) / 1.25; // 0 at neck, 1 at incisal edge

      // Taper towards the neck (cervical constriction)
      if (hNorm < 0.4) {
        v.x *= 0.85;
        v.z *= 0.9;
      }
      // Thinning out towards incisal bite edge
      if (hNorm > 0.6) {
        const factor = (hNorm - 0.6) / 0.4;
        v.z *= 1.0 - factor * 0.45;
        v.x *= 1.0 + factor * 0.08; // slightly wider fan at incisal edge
      }
      // Labial curvature (convex front)
      if (v.z > 0) {
        v.z += 0.04 * Math.sin(hNorm * Math.PI);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  if (classification === 'canine') {
    // Diamond contour with prominent pointed cusp and labial ridge
    const geom = new THREE.CylinderGeometry(0.25, 0.45, 1.35, 16, 12);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.675) / 1.35;

      // Slight flattening in labial-lingual axis
      v.z *= 0.9;

      // Sharp pointed incisal cusp at apex
      if (hNorm > 0.7) {
        const apexFactor = (hNorm - 0.7) / 0.3;
        v.x *= 1.0 - apexFactor * 0.6;
        v.z *= 1.0 - apexFactor * 0.6;
        v.y += apexFactor * 0.12;
      }
      // Labial ridge prominence
      if (v.z > 0) {
        v.z += (1 - Math.abs(v.x) / 0.4) * 0.06;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  if (classification === 'premolar') {
    // Bicuspid (2 cusps: buccal and lingual with central groove)
    const geom = new THREE.BoxGeometry(0.95, 1.15, 0.9, 14, 12, 14);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.575) / 1.15;

      // Rounded corners
      const r = Math.sqrt(v.x * v.x + v.z * v.z);
      if (r > 0.4) {
        v.x *= 0.92;
        v.z *= 0.92;
      }
      // Cervical constriction
      if (hNorm < 0.35) {
        v.x *= 0.88;
        v.z *= 0.88;
      }
      // Occlusal table (2 cusps separated by central fissure)
      if (v.y > 0.25) {
        const cuspFactor = (v.y - 0.25) / 0.325;
        // Central groove dip
        if (Math.abs(v.z) < 0.18) {
          v.y -= 0.12 * (1 - Math.abs(v.z) / 0.18) * cuspFactor;
        } else {
          // Cusps elevation
          v.y += 0.08 * cuspFactor;
        }
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  // Molar (Multi-cusps: 4-5 cusps and occlusal grooves)
  const geom = new THREE.BoxGeometry(1.15, 1.15, 1.1, 16, 14, 16);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const hNorm = (v.y + 0.575) / 1.15;

    // Cervical constriction at base
    if (hNorm < 0.35) {
      v.x *= 0.88;
      v.z *= 0.88;
    }

    // Occlusal surface anatomy (4 cusps + central pit)
    if (v.y > 0.25) {
      const cuspFactor = (v.y - 0.25) / 0.325;
      const distFromCenter = Math.sqrt(v.x * v.x + v.z * v.z);

      // Central fossa indentation
      if (distFromCenter < 0.32) {
        v.y -= 0.14 * (1 - distFromCenter / 0.32) * cuspFactor;
      }

      // 4 Cusps (MB, DB, ML, DL)
      const absX = Math.abs(v.x);
      const absZ = Math.abs(v.z);
      if (absX > 0.18 && absZ > 0.18) {
        const cuspPeak = Math.sin((absX - 0.18) * 3.5) * Math.sin((absZ - 0.18) * 3.5);
        v.y += Math.max(0, cuspPeak) * 0.12 * cuspFactor;
      }
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

const SingleToothMesh: React.FC<{
  tooth: ToothInfo;
  geometries: Record<ToothClassification, THREE.BufferGeometry>;
  material: THREE.Material;
}> = ({ tooth, geometries, material }) => {
  const geom = geometries[tooth.classification];

  return (
    <group
      name={tooth.id}
      position={tooth.position}
      rotation={tooth.rotation}
      scale={tooth.scale}
    >
      {/* Crown */}
      <mesh geometry={geom} material={material} castShadow receiveShadow />

      {/* Internal warm dentin glow */}
      <mesh position={[0, -0.05, 0]} scale={[0.82, 0.9, 0.82]}>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial
          color="#fdf4db"
          roughness={0.8}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
};

export const TeethModel: React.FC = () => {
  // Enamel Physical Material (Pearly white, translucent clearcoat)
  const enamelMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#fdfbf7',
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 0.75,
      clearcoatRoughness: 0.08,
      reflectivity: 0.7,
      transmission: 0.06,
      ior: 1.62,
      attenuationColor: new THREE.Color('#fff0d4'),
      attenuationDistance: 1.5,
    });
  }, []);

  // Pre-generate shared geometries for each tooth classification
  const geometries = useMemo(() => {
    return {
      incisor: createToothGeometry('incisor'),
      canine: createToothGeometry('canine'),
      premolar: createToothGeometry('premolar'),
      molar: createToothGeometry('molar'),
    };
  }, []);

  return (
    <group name="full-dental-arch-teeth">
      {FULL_DENTAL_ARCH_TEETH.map((tooth) => (
        <SingleToothMesh
          key={tooth.id}
          tooth={tooth}
          geometries={geometries}
          material={enamelMaterial}
        />
      ))}
    </group>
  );
};
