import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(t * 1.5) * 0.02 - 0.2;
    const targetRY = state.mouse.x * 0.5;
    const targetRX = -state.mouse.y * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY * 0.1, 0.05);
    
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRX, 0.1);
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.01;
    }

    if (armRef.current) {
      if (hovered) {
        armRef.current.rotation.z = -2.8 + Math.sin(t * 12) * 0.15;
        armRef.current.rotation.x = 0.9 + Math.cos(t * 6) * 0.08;
      } else {
        armRef.current.rotation.z = -0.45 + Math.sin(t * 1.2) * 0.02;
        armRef.current.rotation.x = 0.25;
      }
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.45 - Math.sin(t * 1.2) * 0.02;
      leftArmRef.current.rotation.x = 0.25;
    }
  });

  const redSuit = {
    color: "#8b0000",
    roughness: 0.55,
    metalness: 0.2,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    sheen: 0.7,
    sheenColor: "#ff4444",
  };

  const blueSuit = {
    color: "#000b33",
    roughness: 0.35,
    metalness: 0.4,
    clearcoat: 0.5,
  };

  const whiteLogo = {
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: hovered ? 1.0 : 0.15,
    roughness: 0.1,
    metalness: 0.6,
  };

  return (
    <group ref={groupRef} scale={[0.55, 0.55, 0.55]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <group ref={headRef} position={[0, 2.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 64, 64]} scale={[1, 1.18, 1.08]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
        <mesh position={[0, -0.09, 0.03]}>
          <sphereGeometry args={[0.23, 32, 32]} scale={[0.95, 1, 0.9]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
        
        <group position={[0, 0.02, 0.08]}>
          <mesh position={[-0.13, 0.07, 0.19]} rotation={[0.12, 0.45, 0.1]}>
            <boxGeometry args={[0.16, 0.23, 0.04]} />
            <meshStandardMaterial color="#020202" roughness={0.1} />
          </mesh>
          <mesh position={[0.13, 0.07, 0.19]} rotation={[0.12, -0.45, -0.1]}>
            <boxGeometry args={[0.16, 0.23, 0.04]} />
            <meshStandardMaterial color="#020202" roughness={0.1} />
          </mesh>
          
          <mesh position={[-0.13, 0.07, 0.21]} rotation={[0.12, 0.45, 0.1]} scale={hovered ? [1.15, 0.8, 1] : [1, 1, 1]}>
            <boxGeometry args={[0.13, 0.18, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0.13, 0.07, 0.21]} rotation={[0.12, -0.45, -0.1]} scale={hovered ? [1.15, 0.8, 1] : [1, 1, 1]}>
            <boxGeometry args={[0.13, 0.18, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
        </group>

        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.13, 0.18, 0.38, 32]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
      </group>

      <group position={[0, 1.35, 0]}>
        <mesh position={[0.18, 0.22, 0.08]} castShadow>
          <sphereGeometry args={[0.19, 32, 32]} scale={[1, 0.85, 0.6]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
        <mesh position={[-0.18, 0.22, 0.08]} castShadow>
          <sphereGeometry args={[0.19, 32, 32]} scale={[1, 0.85, 0.6]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
        
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.45, 64, 64]} scale={[1, 1, 0.75]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>
        
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.3, 0.7, 32]} />
          <meshPhysicalMaterial {...redSuit} />
        </mesh>

        <group position={[0, 0.18, 0.36]}>
          <mesh scale={[1.1, 1.3, 1]}>
            <boxGeometry args={[0.08, 0.18, 0.03]} />
            <meshPhysicalMaterial {...whiteLogo} />
          </mesh>
          {[-1, 1].map(side => (
            <group key={`logo-side-${side}`}>
              <mesh position={[side * 0.2, 0.25, -0.05]} rotation={[0, 0, side * 0.9]}>
                <boxGeometry args={[0.32, 0.05, 0.02]} />
                <meshPhysicalMaterial {...whiteLogo} />
              </mesh>
              <mesh position={[side * 0.2, -0.15, -0.05]} rotation={[0, 0, side * -0.75]}>
                <boxGeometry args={[0.25, 0.05, 0.02]} />
                <meshPhysicalMaterial {...whiteLogo} />
              </mesh>
            </group>
          ))}
        </group>

        <mesh position={[0.34, -0.05, 0]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.22, 0.95, 0.42]} />
          <meshPhysicalMaterial {...blueSuit} />
        </mesh>
        <mesh position={[-0.34, -0.05, 0]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.22, 0.95, 0.42]} />
          <meshPhysicalMaterial {...blueSuit} />
        </mesh>
      </group>

      <group ref={armRef} position={[0.52, 1.7, 0]}>
        <mesh><sphereGeometry args={[0.2]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.13, 0.11, 0.65]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <group position={[0.15, -0.6, 0]}>
          <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.12, 0.09, 0.75]} /><meshPhysicalMaterial {...redSuit} /></mesh>
          <mesh position={[0, -0.85, 0]}><sphereGeometry args={[0.1]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        </group>
      </group>

      <group ref={leftArmRef} position={[-0.52, 1.7, 0]}>
        <mesh><sphereGeometry args={[0.2]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.13, 0.11, 0.65]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <group position={[-0.15, -0.6, 0]}>
          <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.12, 0.09, 0.75]} /><meshPhysicalMaterial {...redSuit} /></mesh>
          <mesh position={[0, -0.85, 0]}><sphereGeometry args={[0.1]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        </group>
      </group>

      <group position={[-0.24, 0.55, 0]}>
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.19, 0.16, 1.15]} /><meshPhysicalMaterial {...blueSuit} /></mesh>
        <mesh position={[0, -1.5, 0]}><cylinderGeometry args={[0.17, 0.14, 1.05]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <mesh position={[0, -2.1, 0.12]}><boxGeometry args={[0.23, 0.16, 0.48]} /><meshPhysicalMaterial {...redSuit} /></mesh>
      </group>
      <group position={[0.24, 0.55, 0]}>
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.19, 0.16, 1.15]} /><meshPhysicalMaterial {...blueSuit} /></mesh>
        <mesh position={[0, -1.5, 0]}><cylinderGeometry args={[0.17, 0.14, 1.05]} /><meshPhysicalMaterial {...redSuit} /></mesh>
        <mesh position={[0, -2.1, 0.12]}><boxGeometry args={[0.23, 0.16, 0.48]} /><meshPhysicalMaterial {...redSuit} /></mesh>
      </group>

      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.05} />
      </mesh>
    </group>
  );
};