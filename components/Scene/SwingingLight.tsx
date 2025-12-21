
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

      {/* Optimized Bulb Core */}
      <mesh position={[0, -4.8, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial 
          color={isLightOn ? "#ffffff" : "#222"}
          emissive={isLightOn ? "#ffaa00" : "#000"}
          emissiveIntensity={isLightOn ? 5 : 0}
          transparent
          opacity={0.9}
        />
        
        {isLightOn && (
          <pointLight intensity={10} color="#ffcc33" distance={15} decay={2} />
        )}
      </mesh>

      {/* Halo Overlay (Low Cost) */}
      {isLightOn && (
        <mesh position={[0, -4.8, 0]} scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial 
            color="#ff8800" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      <mesh position={[0, -4.8, 0]} visible={false}>
        <sphereGeometry args={[0.8]} />
      </mesh>
    </group>
  );
};
