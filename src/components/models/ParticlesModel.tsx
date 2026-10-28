import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BurstEvent {
  id: string;
  position: [number, number, number];
  timestamp: number;
}

interface ParticlesModelProps {
  bursts: BurstEvent[];
}

interface ParticleInstance {
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  initialScale: number;
  life: number; // 1.0 to 0.0
  color: string;
}

export const ParticlesModel: React.FC<ParticlesModelProps> = ({ bursts }) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeParticles = useRef<ParticleInstance[]>([]);
  const processedBursts = useRef<Set<string>>(new Set());

  const palette = useMemo(() => ['#ffffff', '#fef08a', '#a7f3d0', '#bae6fd'], []);

  // Update particles on each frame
  useFrame((_, delta) => {
    // 1. Check for new bursts
    bursts.forEach((burst) => {
      if (!processedBursts.current.has(burst.id)) {
        processedBursts.current.add(burst.id);

        // Spawn 12 particles per burst
        for (let i = 0; i < 12; i++) {
          const angle = Math.random() * Math.PI * 2;
          const elevation = (Math.random() - 0.2) * Math.PI;
          const speed = 0.6 + Math.random() * 0.9;

          const vx = Math.cos(angle) * Math.cos(elevation) * speed;
          const vy = Math.abs(Math.sin(elevation)) * speed * 1.2 + 0.3; // bias upwards
          const vz = Math.sin(angle) * Math.cos(elevation) * speed;

          const baseScale = 0.035 + Math.random() * 0.045;
          const col = palette[Math.floor(Math.random() * palette.length)];

          activeParticles.current.push({
            pos: new THREE.Vector3(burst.position[0], burst.position[1], burst.position[2]),
            velocity: new THREE.Vector3(vx, vy, vz),
            scale: baseScale,
            initialScale: baseScale,
            life: 1.0,
            color: col,
          });
        }
      }
    });

    // 2. Animate and prune active particles
    const dt = Math.min(delta, 0.1);
    for (let i = activeParticles.current.length - 1; i >= 0; i--) {
      const p = activeParticles.current[i];
      p.life -= dt * 1.5; // lifespan ~0.66s

      if (p.life <= 0) {
        activeParticles.current.splice(i, 1);
        continue;
      }

      // Physics: velocity + upward buoyant drift + drag
      p.velocity.y += 0.4 * dt; // gentle rise
      p.velocity.multiplyScalar(Math.pow(0.88, dt * 60)); // air friction
      p.pos.addScaledVector(p.velocity, dt);

      // Smooth shrink
      p.scale = p.initialScale * Math.sin(p.life * Math.PI);
    }

    // Sync mesh objects in groupRef
    if (groupRef.current) {
      const children = groupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i] as THREE.Mesh;
        if (i < activeParticles.current.length) {
          const p = activeParticles.current[i];
          mesh.position.copy(p.pos);
          mesh.scale.setScalar(p.scale);
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }
      }
    }
  });

  // Pre-allocate pool of 72 particle meshes
  const poolSize = 72;
  const particleMeshes = useMemo(() => {
    return Array.from({ length: poolSize }, (_, idx) => idx);
  }, []);

  return (
    <group ref={groupRef} name="foam-sparkle-particles">
      {particleMeshes.map((idx) => (
        <mesh key={idx} visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={palette[idx % palette.length]}
            roughness={0.2}
            metalness={0.0}
            emissive="#ffffff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
};
