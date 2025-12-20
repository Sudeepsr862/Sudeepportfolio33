import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderRobot: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const wavingLegRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const legs = useMemo(() => [
    { rotation: [0, 0.4, 1.2], isWaving: false },
    { rotation: [0, 1.2, 1.2], isWaving: false },
    { rotation: [0, 2.0, 1.2], isWaving: false },
    { rotation: [0, 3.14, 1.2], isWaving: false },
    { rotation: [0, 4.2, 1.2], isWaving: false },
    { rotation: [0, 5.0, 1.2], isWaving: false },
    { rotation: [0, -0.6, 1.2], isWaving: false },
    { rotation: [0, 0.6, 1.2], isWaving: true },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;
    const targetRY = state.mouse.x * 0.3;
    const targetRX = -state.mouse.y * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRX, 0.1);

    if (wavingLegRef.current) {
      if (hovered) {
        wavingLegRef.current.rotation.z = -1.2 + Math.sin(t * 10) * 0.5;
        wavingLegRef.current.rotation.x = Math.sin(t * 5) * 0.2;
      } else {
        wavingLegRef.current.rotation.z = -1.0 + Math.sin(t * 2) * 0.1;
      }
    }

    if (eyesRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.2;
      eyesRef.current.scale.set(1, pulse, 1);
    }
  });

  // Added key to props type to avoid TS error in map call at line 104
  const Leg = ({ rotation, isWaving = false }: { rotation: any, isWaving?: boolean, key?: React.Key }) => {
    return (
      <group ref={isWaving ? wavingLegRef : null} rotation={rotation}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.06]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
        </mesh>
        <group position={[0, 0.8, 0]} rotation={[0, 0, 1]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>
    );
  };

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial 
          color="#080808" 
          metalness={1} 
          roughness={0.1} 
          clearcoat={1}
          reflectivity={1}
        />
      </mesh>

      <group position={[0, 0.2, 0.5]}>
        <group ref={eyesRef}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 5 : 2} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 5 : 2} />
          </mesh>
        </group>
        
        <mesh position={[0, -0.25, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={hovered ? 3 : 1} />
        </mesh>
      </group>

      {legs.map((leg, i) => (
        <Leg key={i} rotation={leg.rotation} isWaving={leg.isWaving} />
      ))}

      <pointLight position={[0, 0, 0]} intensity={2} color="#00f3ff" />
    </group>
  );
};
