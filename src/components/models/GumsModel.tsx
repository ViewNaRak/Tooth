import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';

export const GumsModel: React.FC = () => {
  // Generate a continuous U-shaped parabolic mandibular alveolar ridge
  const gumsGeometry = useMemo(() => {
    const segments = 64;
    const radialSegments = 16;
    const geom = new THREE.BufferGeometry();

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const getArchCenter = (t: number): { x: number; z: number; tangentX: number; tangentZ: number } => {
      const u = t * Math.PI * 0.46;
      const sinU = Math.sin(u);
      const cosU = Math.cos(u);

      const x = sinU * 2.05;
      const z = cosU * 1.8 - 0.25 - (1 - cosU) * 1.5;

      const dt = 0.001;
      const uNext = (t + dt) * Math.PI * 0.46;
      const xNext = Math.sin(uNext) * 2.05;
      const zNext = Math.cos(uNext) * 1.8 - 0.25 - (1 - Math.cos(uNext)) * 1.5;

      const dx = xNext - x;
      const dz = zNext - z;
      const len = Math.sqrt(dx * dx + dz * dz) || 1;

      return { x, z, tangentX: dx / len, tangentZ: dz / len };
    };

    for (let i = 0; i <= segments; i++) {
      const t = -1 + (i / segments) * 2;
      const { x: cx, z: cz, tangentX, tangentZ } = getArchCenter(t);

      const nx = -tangentZ;
      const nz = tangentX;

      for (let j = 0; j <= radialSegments; j++) {
        const s = j / radialSegments;
        const widthOffset = -0.45 + s * 1.1;

        let y = 0.08 - Math.pow(s - 0.35, 2) * 1.8;
        if (s > 0.6) {
          y -= (s - 0.6) * 1.6;
        }

        const scallopWave = Math.sin(t * Math.PI * 8) * 0.05 * Math.sin(s * Math.PI);
        y += scallopWave;

        const vx = cx + nx * widthOffset;
        const vz = cz + nz * widthOffset;

        vertices.push(vx, y, vz);
        uvs.push(i / segments, j / radialSegments);
      }
    }

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
      {/* Friendly Soft Pastel Peach Gingival Tissue (non-intimidating, cozy) */}
      <mesh geometry={gumsGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#F9ABA2" // Soft Peach Pastel
          roughness={0.48}
          metalness={0.02}
        />
      </mesh>

      {/* Alveolar Bone Base */}
      <mesh position={[0, -0.65, 0.0]}>
        <cylinderGeometry args={[2.1, 2.3, 0.6, 32, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial
          color="#F09286" // Warm terracotta pastel
          roughness={0.55}
          metalness={0.02}
        />
      </mesh>

      {/* Subtle soft blush collar accents */}
      {FULL_DENTAL_ARCH_TEETH.map((tooth) => (
        <mesh
          key={`collar-${tooth.id}`}
          position={[tooth.position[0], 0.02, tooth.position[2]]}
          rotation={[-Math.PI / 2, 0, tooth.rotation[1]]}
        >
          <ringGeometry args={[0.22, 0.35, 16]} />
          <meshBasicMaterial
            color="#E07267"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
