import React, { useMemo } from 'react';
import * as THREE from 'three';

export const GumsModel: React.FC = () => {
  // Generate anatomically contoured gingiva with scalloped margins and interdental papilla
  const gumsGeometry = useMemo(() => {
    const width = 3.4;
    const height = 1.3;
    const depth = 2.4;
    const geom = new THREE.BoxGeometry(width, height, depth, 32, 16, 24);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);

      // We only contour the top half of the gum ridge where teeth emerge
      if (v.y > -0.2) {
        // Interdental papilla rises between the two teeth (around x = 0)
        const distFromCenter = Math.abs(v.x);
        
        // Collar depressions around Tooth 1 (center x = -0.62) and Tooth 2 (center x = 0.62)
        const dTooth1 = Math.sqrt(Math.pow(v.x - (-0.62), 2) + Math.pow(v.z, 2));
        const dTooth2 = Math.sqrt(Math.pow(v.x - 0.62, 2) + Math.pow(v.z, 2));

        // Gingival sulcular collar indentations
        if (dTooth1 < 0.68) {
          const dip = (1 - dTooth1 / 0.68) * 0.45;
          v.y -= dip;
        }
        if (dTooth2 < 0.68) {
          const dip = (1 - dTooth2 / 0.68) * 0.45;
          v.y -= dip;
        }

        // Interdental Papilla: triangular peak in the embrasure space between teeth
        if (distFromCenter < 0.32 && Math.abs(v.z) < 0.5) {
          const papillaPeak = (1 - distFromCenter / 0.32) * (1 - Math.abs(v.z) / 0.5) * 0.28;
          v.y += papillaPeak;
        }

        // Scalloped marginal contouring on facial (buccal z > 0.4) and lingual (z < -0.4)
        if (Math.abs(v.z) > 0.4) {
          const scallopWave = Math.sin(v.x * 3.5) * 0.08;
          v.y += scallopWave;
        }
      }

      // Smooth rounding of alveolar base
      const r = Math.sqrt(v.x * v.x + v.z * v.z);
      if (v.y < -0.4 && r > 1.2) {
        v.x *= 0.95;
        v.z *= 0.95;
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, -0.65, 0]} name="gums-assembly">
      {/* Gingival tissue mesh with healthy vascularized appearance */}
      <mesh geometry={gumsGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#e57388"
          roughness={0.6}
          metalness={0.04}
          bumpScale={0.03}
        />
      </mesh>

      {/* Subtle darker sulcular shadow ring inside sulcus */}
      <mesh position={[-0.62, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.66, 32]} />
        <meshBasicMaterial color="#b91c1c" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh position={[0.62, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.66, 32]} />
        <meshBasicMaterial color="#b91c1c" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
};
