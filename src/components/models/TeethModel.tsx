import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { FULL_DENTAL_ARCH_TEETH } from '../../data/dentalLessons';
import type { ToothInfo } from '../../types/dental';

interface ToothProps {
  tooth: ToothInfo;
  material: THREE.Material;
}

// 1. Incisor: Smooth Rounded Blade
const IncisorTooth: React.FC<ToothProps> = ({ tooth, material }) => {
  return (
    <group position={tooth.position} rotation={tooth.rotation} scale={tooth.scale}>
      <RoundedBox args={[0.33, 0.60, 0.25]} radius={0.06} smoothness={6} material={material} castShadow receiveShadow />
    </group>
  );
};

// 2. Canine: Smooth Rounded Bullet / Cone
const CanineTooth: React.FC<ToothProps> = ({ tooth, material }) => {
  return (
    <group position={tooth.position} rotation={tooth.rotation} scale={tooth.scale}>
      <RoundedBox args={[0.36, 0.68, 0.36]} radius={0.14} smoothness={6} material={material} castShadow receiveShadow />
    </group>
  );
};

// 3. Premolar: Smooth Pillowy Bicuspid
const PremolarTooth: React.FC<ToothProps> = ({ tooth, material }) => {
  return (
    <group position={tooth.position} rotation={tooth.rotation} scale={tooth.scale}>
      {/* Main Crown Body */}
      <RoundedBox args={[0.42, 0.56, 0.44]} radius={0.10} smoothness={6} material={material} castShadow receiveShadow />
      {/* Soft rounded buccal and lingual cusps */}
      <mesh position={[0, 0.28, 0.1]} material={material}>
        <sphereGeometry args={[0.11, 10, 10]} />
      </mesh>
      <mesh position={[0, 0.28, -0.1]} material={material}>
        <sphereGeometry args={[0.11, 10, 10]} />
      </mesh>
    </group>
  );
};

// 4. Molar: Soft Rounded Occlusal Table with 4 pillowy cusps
const MolarTooth: React.FC<ToothProps> = ({ tooth, material }) => {
  return (
    <group position={tooth.position} rotation={tooth.rotation} scale={tooth.scale}>
      {/* Main Molar Block with soft rounded corners */}
      <RoundedBox args={[0.54, 0.54, 0.56]} radius={0.12} smoothness={6} material={material} castShadow receiveShadow />
      
      {/* 4 Soft Pillowy Cusps (Mesiobuccal, Distobuccal, Mesiolingual, Distolingual) */}
      <mesh position={[-0.14, 0.27, 0.14]} material={material}>
        <sphereGeometry args={[0.12, 10, 10]} />
      </mesh>
      <mesh position={[0.14, 0.27, 0.14]} material={material}>
        <sphereGeometry args={[0.12, 10, 10]} />
      </mesh>
      <mesh position={[-0.14, 0.27, -0.14]} material={material}>
        <sphereGeometry args={[0.12, 10, 10]} />
      </mesh>
      <mesh position={[0.14, 0.27, -0.14]} material={material}>
        <sphereGeometry args={[0.12, 10, 10]} />
      </mesh>
    </group>
  );
};

export const TeethModel: React.FC = () => {
  // Pearly White Clay Material: Smooth, friendly, subtle clean shine
  const toothMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#FFFDF9',     // Natural Pearly Warm White
      roughness: 0.22,      // Smooth porcelain / clay sheen
      metalness: 0.02,
      clearcoat: 0.35,      // Light gloss varnish
      clearcoatRoughness: 0.12,
    });
  }, []);

  return (
    <group name="smooth-stylized-teeth">
      {FULL_DENTAL_ARCH_TEETH.map((tooth) => {
        if (tooth.classification === 'incisor') {
          return <IncisorTooth key={tooth.id} tooth={tooth} material={toothMaterial} />;
        }
        if (tooth.classification === 'canine') {
          return <CanineTooth key={tooth.id} tooth={tooth} material={toothMaterial} />;
        }
        if (tooth.classification === 'premolar') {
          return <PremolarTooth key={tooth.id} tooth={tooth} material={toothMaterial} />;
        }
        return <MolarTooth key={tooth.id} tooth={tooth} material={toothMaterial} />;
      })}
    </group>
  );
};
