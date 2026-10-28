import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DebrisSpot } from '../../types/dental';

interface DebrisModelProps {
  debrisSpots: DebrisSpot[];
}

const SingleDebrisMesh: React.FC<{ debris: DebrisSpot }> = ({ debris }) => {
  const ref = useRef<THREE.Group>(null);
  const currentScale = useRef(debris.cleaned ? 0 : 1);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = debris.cleaned ? 0.001 : 1;
    currentScale.current = THREE.MathUtils.damp(currentScale.current, target, 7, delta);
    ref.current.scale.setScalar(currentScale.current);
    ref.current.visible = currentScale.current > 0.01;
  });

  return (
    <group ref={ref} position={debris.position}>
      {/* Irregular fibrous food particle */}
      <mesh castShadow>
        <dodecahedronGeometry args={[debris.size, 0]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.9}
          metalness={0.05}
          bumpScale={0.05}
        />
      </mesh>
      {/* Secondary fibrous attachment */}
      <mesh position={[0.02, -0.02, 0.03]} rotation={[0.4, 0.2, 0.8]}>
        <cylinderGeometry args={[0.015, 0.02, 0.09, 6]} />
        <meshStandardMaterial color="#b45309" roughness={0.95} />
      </mesh>
    </group>
  );
};

export const DebrisModel: React.FC<DebrisModelProps> = ({ debrisSpots }) => {
  return (
    <group name="food-debris-assembly">
      {debrisSpots.map((spot) => (
        <SingleDebrisMesh key={spot.id} debris={spot} />
      ))}
    </group>
  );
};
