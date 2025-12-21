
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  isLightOn: boolean;
  onToggle: () => void;
}

export const SwingingLight: React.FC<Props> = ({ isLightOn, onToggle }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const swingStrength = hovered ? 0.3 : 0.15;
    groupRef.current.rotation.z = Math.sin(time * 1.2) * swingStrength;
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, 4.8, 0]} 
      onClick={onToggle}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Optimized Wire */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 4.5, 8]} />
        <meshStandardMaterial color={isLightOn ? "#ffaa00" : "#333"} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -4.4, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 12]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
      </mesh>

      {/* Bulb Glass Shell (The "Outline") */}
      <mesh position={[0, -4.8, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshPhysicalMaterial 
          color={isLightOn ? "#ffffff" : "#888"}
          transparent
          opacity={isLightOn ? 0.2 : 0.4}
          roughness={0}
          metalness={0.2}
          transmission={0.95}
          thickness={0.5}
          ior={1.5}
          reflectivity={0.5}
        />
      </mesh>

      {/* Optimized Bulb Core / Light Source Area */}
      <mesh position={[0, -4.8, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial 
          color={isLightOn ? "#ffffff" : "#222"}
          emissive={isLightOn ? "#ffaa00" : "#000"}
          emissiveIntensity={isLightOn ? 12 : 0}
          transparent
          opacity={0.8}
        />
        
        {isLightOn && (
          <pointLight intensity={15} color="#ffcc33" distance={15} decay={2} />
        )}
      </mesh>

      {/* Internal Filament (Detail inside the bulb) */}
      <mesh position={[0, -4.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.006, 8, 20]} />
        <meshStandardMaterial 
          color={isLightOn ? "#fff" : "#111"} 
          emissive={isLightOn ? "#ffaa00" : "#000"}
          emissiveIntensity={isLightOn ? 30 : 0}
        />
      </mesh>

      {/* Halo Overlay (Ambient glow shell) */}
      {isLightOn && (
        <mesh position={[0, -4.8, 0]} scale={[1.9, 1.9, 1.9]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial 
            color="#ff8800" 
            transparent 
            opacity={0.12} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Interaction Surface */}
      <mesh position={[0, -4.8, 0]} visible={false}>
        <sphereGeometry args={[0.8]} />
      </mesh>
    </group>
  );
};
