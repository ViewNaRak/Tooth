import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';
import type { ToothInfo, ToothClassification } from '../../types/dental';

// Helper to create friendly, stylized soft Clay/Vinyl toy teeth geometries
function createFriendlyToothGeometry(classification: ToothClassification): THREE.BufferGeometry {
  if (classification === 'incisor') {
    // Friendly rounded spade/chisel crown
    const geom = new THREE.BoxGeometry(0.85, 1.25, 0.58, 16, 16, 16);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.625) / 1.25;

      // Soft cervical taper
      if (hNorm < 0.35) {
        v.x *= 0.88;
        v.z *= 0.9;
      }
      // Rounded incisal edge
      if (hNorm > 0.65) {
        const factor = (hNorm - 0.65) / 0.35;
        v.z *= 1.0 - factor * 0.4;
        v.x *= 1.0 + factor * 0.06;
      }
      // Gentle rounded labial puff
      if (v.z > 0) {
        v.z += 0.05 * Math.sin(hNorm * Math.PI);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  if (classification === 'canine') {
    // Friendly rounded cuspid (soft apex, no sharp threatening points)
    const geom = new THREE.CylinderGeometry(0.26, 0.46, 1.35, 20, 16);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.675) / 1.35;

      v.z *= 0.92;

      // Smooth soft apex (not needle-sharp)
      if (hNorm > 0.65) {
        const factor = (hNorm - 0.65) / 0.35;
        v.x *= 1.0 - factor * 0.45;
        v.z *= 1.0 - factor * 0.45;
        v.y += factor * 0.08;
      }
      // Soft labial curve
      if (v.z > 0) {
        v.z += 0.05 * Math.sin(hNorm * Math.PI);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  if (classification === 'premolar') {
    // Cute rounded bicuspid with smooth pillowy cusps
    const geom = new THREE.BoxGeometry(0.96, 1.15, 0.92, 16, 16, 16);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const hNorm = (v.y + 0.575) / 1.15;

      // Pillowy rounding of vertical edges
      const r = Math.sqrt(v.x * v.x + v.z * v.z);
      if (r > 0.38) {
        v.x *= 0.94;
        v.z *= 0.94;
      }
      if (hNorm < 0.35) {
        v.x *= 0.88;
        v.z *= 0.88;
      }
      // Smooth occlusal dip
      if (v.y > 0.25) {
        const factor = (v.y - 0.25) / 0.325;
        if (Math.abs(v.z) < 0.16) {
          v.y -= 0.1 * (1 - Math.abs(v.z) / 0.16) * factor;
        } else {
          v.y += 0.06 * factor;
        }
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  // Molar: Cute friendly multi-cusp crown with rounded pillowy forms
  const geom = new THREE.BoxGeometry(1.18, 1.15, 1.12, 18, 16, 18);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const hNorm = (v.y + 0.575) / 1.15;

    // Soft rounded corners
    const r = Math.sqrt(v.x * v.x + v.z * v.z);
    if (r > 0.44) {
      v.x *= 0.94;
      v.z *= 0.94;
    }

    if (hNorm < 0.35) {
      v.x *= 0.88;
      v.z *= 0.88;
    }

    // Occlusal smooth valleys & soft rounded cusps
    if (v.y > 0.25) {
      const factor = (v.y - 0.25) / 0.325;
      const d = Math.sqrt(v.x * v.x + v.z * v.z);

      if (d < 0.3) {
        v.y -= 0.12 * (1 - d / 0.3) * factor;
      }

      const absX = Math.abs(v.x);
      const absZ = Math.abs(v.z);
      if (absX > 0.16 && absZ > 0.16) {
        const bump = Math.sin((absX - 0.16) * 3.2) * Math.sin((absZ - 0.16) * 3.2);
        v.y += Math.max(0, bump) * 0.1 * factor;
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
      <mesh geometry={geom} material={material} castShadow receiveShadow />

      {/* Internal warm glow */}
      <mesh position={[0, -0.05, 0]} scale={[0.84, 0.9, 0.84]}>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial
          color="#fef3c7"
          roughness={0.8}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
};

export const TeethModel: React.FC = () => {
  // Friendly Clay / Vinyl Toy Material: Warm creamy ivory, soft satin finish
  const clayEnamelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FAF8F0', // Warm creamy natural ivory
      roughness: 0.35,  // As specified: Roughness 0.35
      metalness: 0.05,  // As specified: Metalness 0.05
    });
  }, []);

  const geometries = useMemo(() => {
    return {
      incisor: createFriendlyToothGeometry('incisor'),
      canine: createFriendlyToothGeometry('canine'),
      premolar: createFriendlyToothGeometry('premolar'),
      molar: createFriendlyToothGeometry('molar'),
    };
  }, []);

  return (
    <group name="full-dental-arch-teeth">
      {FULL_DENTAL_ARCH_TEETH.map((tooth) => (
        <SingleToothMesh
          key={tooth.id}
          tooth={tooth}
          geometries={geometries}
          material={clayEnamelMaterial}
        />
      ))}
    </group>
  );
};
