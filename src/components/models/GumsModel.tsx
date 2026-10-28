import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';

export const GumsModel: React.FC = () => {
  // Generate a continuous U-shaped parabolic mandibular alveolar ridge
  const gumsGeometry = useMemo(() => {
    // Generate an anatomical curved band following the 16 tooth positions
    // We create a ribbon along the dental curve, lofting from inner (lingual) to outer (buccal)
    const segments = 64;
    const radialSegments = 16;
    const geom = new THREE.BufferGeometry();

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Helper curve for arch centerline: U-shaped parabola
    // Incisors at (0, 1.55), Canines at (+-0.9, 1.2), Molars at (+-2.0, -1.6)
    const getArchCenter = (t: number): { x: number; z: number; tangentX: number; tangentZ: number } => {
      // t from -1 (right 3rd molar) to +1 (left 3rd molar)
      const u = t * Math.PI * 0.46; // angle parameter
      const sinU = Math.sin(u);
      const cosU = Math.cos(u);

      const x = sinU * 2.05;
      const z = cosU * 1.8 - 0.25 - (1 - cosU) * 1.5;

      // Numerical tangent
      const dt = 0.001;
      const uNext = (t + dt) * Math.PI * 0.46;
      const xNext = Math.sin(uNext) * 2.05;
      const zNext = Math.cos(uNext) * 1.8 - 0.25 - (1 - Math.cos(uNext)) * 1.5;

      const dx = xNext - x;
      const dz = zNext - z;
      const len = Math.sqrt(dx * dx + dz * dz) || 1;

      return { x, z, tangentX: dx / len, tangentZ: dz / len };
    };

    // Build grid of vertices along curve
    for (let i = 0; i <= segments; i++) {
      const t = -1 + (i / segments) * 2; // -1 to +1
      const { x: cx, z: cz, tangentX, tangentZ } = getArchCenter(t);

      // Normal perpendicular to tangent (pointing outward / buccal)
      const nx = -tangentZ;
      const nz = tangentX;

      // For each radial slice: from lingual sulcus -> ridge crest -> buccal collar -> alveolar base
      for (let j = 0; j <= radialSegments; j++) {
        const s = j / radialSegments; // 0 (lingual) to 1 (buccal base)

        // Radial offset from arch center line
        const widthOffset = -0.45 + s * 1.1; // -0.45 to +0.65

        // Height profile: crest at s=0.35, dropping down into base
        let y = 0.08 - Math.pow(s - 0.35, 2) * 1.8;
        if (s > 0.6) {
          y -= (s - 0.6) * 1.6; // downward alveolar drop
        }

        // Add scalloped wave along gingival margin (around teeth collars)
        const scallopWave = Math.sin(t * Math.PI * 8) * 0.06 * Math.sin(s * Math.PI);
        y += scallopWave;

        const vx = cx + nx * widthOffset;
        const vz = cz + nz * widthOffset;

        vertices.push(vx, y, vz);
        uvs.push(i / segments, j / radialSegments);
      }
    }

    // Build quad indices
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }, []);

  return (
    <group name="mandibular-gingiva">
      {/* Main Gingival Mesh with healthy vascularized pink tone */}
      <mesh geometry={gumsGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#e57388"
          roughness={0.55}
          metalness={0.03}
          bumpScale={0.02}
        />
      </mesh>

      {/* Anatomical Alveolar Bone Base (Underneath Jaw Support) */}
      <mesh position={[0, -0.65, 0.0]}>
        <cylinderGeometry args={[2.1, 2.3, 0.6, 32, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial
          color="#d95d75"
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>

      {/* Sulcular Shadow Accents at tooth emergence points */}
      {FULL_DENTAL_ARCH_TEETH.map((tooth) => (
        <mesh
          key={`collar-${tooth.id}`}
          position={[tooth.position[0], 0.02, tooth.position[2]]}
          rotation={[-Math.PI / 2, 0, tooth.rotation[1]]}
        >
          <ringGeometry args={[0.22, 0.35, 16]} />
          <meshBasicMaterial
            color="#991b1b"
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
