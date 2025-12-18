
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fix for JSX intrinsic element errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const PointLight = 'pointLight' as any;

export const SpiderRobot: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const wavingLegRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Leg configurations
  const legs = useMemo(() => [
    { rotation: [0, 0.4, 1.2], isWaving: false },
    { rotation: [0, 1.2, 1.2], isWaving: false },
    { rotation: [0, 2.0, 1.2], isWaving: false },
    { rotation: [0, 3.14, 1.2], isWaving: false },
    { rotation: [0, 4.2, 1.2], isWaving: false },
    { rotation: [0, 5.0, 1.2], isWaving: false },
    { rotation: [0, -0.6, 1.2], isWaving: false },
    { rotation: [0, 0.6, 1.2], isWaving: true }, // The special waving leg
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle breathing/floating motion
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;
    
    // Look at mouse cursor slightly
    const targetRY = state.mouse.x * 0.3;
    const targetRX = -state.mouse.y * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRX, 0.1);

    // Waving Animation
    if (wavingLegRef.current) {
      if (hovered) {
        // Hello wave!
        wavingLegRef.current.rotation.z = -1.2 + Math.sin(t * 10) * 0.5;
        wavingLegRef.current.rotation.x = Math.sin(t * 5) * 0.2;
      } else {
        // Idle twitch
        wavingLegRef.current.rotation.z = -1.0 + Math.sin(t * 2) * 0.1;
      }
    }

    // Eyes Pulse
    if (eyesRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.2;
      eyesRef.current.scale.set(1, pulse, 1);
    }
  });

  const Leg = ({ rotation, isWaving = false }: { rotation: any, isWaving?: boolean }) => {
    return (
      <Group ref={isWaving ? wavingLegRef : null} rotation={rotation}>
        {/* Upper leg */}
        <Mesh position={[0, 0.4, 0]}>
          <CylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
          <MeshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Mesh>
        {/* Joint */}
        <Mesh position={[0, 0.8, 0]}>
          <SphereGeometry args={[0.06]} />
          <MeshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
        </Mesh>
        {/* Lower leg */}
        <Group position={[0, 0.8, 0]} rotation={[0, 0, 1]}>
          <Mesh position={[0, 0.4, 0]}>
            <CylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
            <MeshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
          </Mesh>
        </Group>
      </Group>
    );
  };

  return (
    <Group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Spider Main Body */}
      <Mesh castShadow>
        <SphereGeometry args={[0.6, 32, 32]} />
        <MeshPhysicalMaterial 
          color="#080808" 
          metalness={1} 
          roughness={0.1} 
          clearcoat={1}
          reflectivity={1}
        />
      </Mesh>

      {/* Face/Eyes Section */}
      <Group position={[0, 0.2, 0.5]}>
        {/* Main Eyes */}
        <Group ref={eyesRef}>
          <Mesh position={[-0.2, 0, 0]}>
            <SphereGeometry args={[0.12, 16, 16]} />
            <MeshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 5 : 2} />
          </Mesh>
          <Mesh position={[0.2, 0, 0]}>
            <SphereGeometry args={[0.12, 16, 16]} />
            <MeshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 5 : 2} />
          </Mesh>
        </Group>
        
        {/* Friendly Digital Smile */}
        <Mesh position={[0, -0.25, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <CylinderGeometry args={[0.15, 0.15, 0.02, 32, 1, false, 0, Math.PI]} />
          <MeshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 3 : 1} />
        </Mesh>
      </Group>

      {/* Legs */}
      {legs.map((leg, i) => (
        <Leg key={i} rotation={leg.rotation} isWaving={leg.isWaving} />
      ))}

      {/* Internal Core Light - Fix for pointLight intrinsic element error */}
      <PointLight position={[0, 0, 0]} intensity={2} color="#00f3ff" />
    </Group>
  );
};
