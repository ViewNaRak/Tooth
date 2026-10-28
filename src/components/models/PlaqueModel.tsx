import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlaqueSpot } from '../../types/dental';

interface PlaqueModelProps {
  plaqueSpots: PlaqueSpot[];
  disclosingAgentEnabled: boolean;
  onCleanPlaque?: (id: string) => void;
}

interface SinglePlaqueMeshProps {
  spot: PlaqueSpot;
  disclosingAgentEnabled: boolean;
}

const SinglePlaqueMesh: React.FC<SinglePlaqueMeshProps> = ({ spot, disclosingAgentEnabled }) => {
  const meshRef = useRef<THREE.Group>(null);
  const currentScale = useRef(spot.cleaned ? 0 : 1);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = spot.cleaned ? 0.001 : 1;
    currentScale.current = THREE.MathUtils.damp(currentScale.current, targetScale, 6, delta);
    meshRef.current.scale.setScalar(currentScale.current);
    meshRef.current.visible = currentScale.current > 0.01;
  });

  const baseColor = disclosingAgentEnabled ? '#d946ef' : '#eab308';
  const emissiveColor = disclosingAgentEnabled ? '#c026d3' : '#a16207';

  return (
    <group ref={meshRef} position={spot.position}>
      {/* Primary bacterial biofilm nodule */}
      <mesh castShadow>
        <sphereGeometry args={[0.075 * spot.severity, 12, 12]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.8}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Satellite micro-colonies */}
      <mesh position={[0.04, 0.02, 0.02]}>
        <sphereGeometry args={[0.045 * spot.severity, 8, 8]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.85}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh position={[-0.035, -0.025, 0.015]}>
        <sphereGeometry args={[0.038 * spot.severity, 8, 8]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.85}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
};

export const PlaqueModel: React.FC<PlaqueModelProps> = ({
  plaqueSpots,
  disclosingAgentEnabled,
}) => {
  return (
    <group name="plaque-colonies">
      {plaqueSpots.map((spot) => (
        <SinglePlaqueMesh
          key={spot.id}
          spot={spot}
          disclosingAgentEnabled={disclosingAgentEnabled}
        />
      ))}
    </group>
  );
};
