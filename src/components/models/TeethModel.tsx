import React, { useMemo } from 'react';
import * as THREE from 'three';

interface SingleMolarProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  toothId: string;
  isHovered?: boolean;
}

const SingleMolar: React.FC<SingleMolarProps> = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  // Create procedural molar geometry with smooth contours
  const crownGeometry = useMemo(() => {
    // We create a rounded box with custom vertex deformation for anatomical tooth crown
    const geom = new THREE.BoxGeometry(1.05, 1.15, 1.05, 16, 16, 16);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);

      // Height factor (-0.575 to +0.575)
      const hNorm = (v.y + 0.575) / 1.15; // 0 at root base, 1 at occlusal table

      // Cervical constriction (narrower at the neck where it meets gums)
      const neckConstriction = 0.88 + 0.12 * Math.sin(hNorm * Math.PI * 0.9);
      v.x *= neckConstriction;
      v.z *= neckConstriction;

      // Slight buccal bulge (front face curved out)
      if (v.z > 0) {
        v.z += 0.05 * Math.sin(hNorm * Math.PI);
      }

      // Occlusal surface anatomy (cusps and central groove at top y > 0.35)
      if (v.y > 0.3) {
        const cuspFactor = (v.y - 0.3) / 0.275;
        // Central pit indentation
        const distFromCenter = Math.sqrt(v.x * v.x + v.z * v.z);
        if (distFromCenter < 0.28) {
          v.y -= 0.12 * (1 - distFromCenter / 0.28) * cuspFactor;
        }

        // 4 Cusps elevation (MB, DB, ML, DL)
        const cuspX = Math.abs(v.x);
        const cuspZ = Math.abs(v.z);
        if (cuspX > 0.18 && cuspZ > 0.18) {
          const cuspHeight = Math.sin((cuspX - 0.18) * 3) * Math.sin((cuspZ - 0.18) * 3);
          v.y += Math.max(0, cuspHeight) * 0.14 * cuspFactor;
        }
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Enamel Crown */}
      <mesh geometry={crownGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#fbfbf9"
          roughness={0.15}
          metalness={0.02}
          clearcoat={0.7}
          clearcoatRoughness={0.12}
          reflectivity={0.65}
          transmission={0.08}
          ior={1.62} // Hydroxyapatite enamel index of refraction
          attenuationColor="#fff4e0"
          attenuationDistance={1.2}
        />
      </mesh>

      {/* Internal Dentin Glow (Subtle natural warm tone) */}
      <mesh scale={[0.88, 0.95, 0.88]} position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#f7ecd0" roughness={0.7} transparent opacity={0.35} />
      </mesh>

      {/* Subgingival root anchors (hidden beneath gums for anatomical depth) */}
      <mesh position={[-0.22, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="#e8dcbe" roughness={0.6} />
      </mesh>
      <mesh position={[0.22, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="#e8dcbe" roughness={0.6} />
      </mesh>
    </group>
  );
};

export const TeethModel: React.FC = () => {
  return (
    <group name="teeth-assembly">
      {/* Tooth 1: First Molar (Left, Anatomical #46/30) */}
      <SingleMolar
        toothId="molar-1"
        position={[-0.62, 0.35, 0]}
        rotation={[0, 0.04, 0.02]}
        scale={[1, 1, 1]}
      />

      {/* Tooth 2: Second Molar (Right, Anatomical #47/31) */}
      <SingleMolar
        toothId="molar-2"
        position={[0.62, 0.35, 0]}
        rotation={[0, -0.04, -0.02]}
        scale={[0.96, 0.98, 0.98]}
      />
    </group>
  );
};
