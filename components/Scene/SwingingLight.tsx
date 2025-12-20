
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
    // Realistic swinging physics simulation
    const swingStrength = hovered ? 0.4 : 0.25;
    const frequency = hovered ? 1.6 : 1.2;
    groupRef.current.rotation.z = Math.sin(time * frequency) * swingStrength;
    groupRef.current.rotation.x = Math.cos(time * 0.7) * 0.1;
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, 4.8, 0]} 
      onClick={onToggle}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Heavy-duty Visible Wire/Rope */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4.5]} />
        <meshStandardMaterial 
          color={isLightOn ? "#ffd27d" : "#ffffff"} 
          roughness={0.1} 
          metalness={0.9}
          emissive={isLightOn ? "#ffaa00" : "#ffffff"}
          emissiveIntensity={isLightOn ? 0.8 : 0.4}
        />
      </mesh>

      {/* Industrial Bulb Base */}
      <mesh position={[0, -4.4, 0]}>
        <cylinderGeometry args={[0.18, 0.15, 0.35]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.05} />
      </mesh>

      {/* --- BULB CORE --- */}
      <mesh position={[0, -4.8, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial 
          color={isLightOn ? "#ffffff" : "#111"}
          emissive={isLightOn ? "#ffaa00" : "#050505"}
          emissiveIntensity={isLightOn ? 60 : 0.1}
          transparent
          opacity={isLightOn ? 1 : 0.9}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
          thickness={1.5}
        />
        
        {/* Dynamic Light Sources */}
        {isLightOn && (
          <>
            <pointLight intensity={150} color="#ffcc33" distance={20} decay={2} castShadow />
            <pointLight intensity={30} color="#ffffff" distance={6} position={[0, -0.1, 0]} />
            <pointLight intensity={5} color="#ff9900" distance={40} position={[0, 3, 0]} />
          </>
        )}
      </mesh>

      {/* --- BULB OUTLINE --- */}
      <mesh position={[0, -4.8, 0]} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial 
          color={isLightOn ? "#ffcc00" : (hovered ? "#ff0000" : "#ffffff")} 
          side={THREE.BackSide} 
          transparent 
          opacity={isLightOn ? 0.6 : 0.15}
        />
      </mesh>

      {/* Internal Filament */}
      {isLightOn && (
        <mesh position={[0, -4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.005, 8, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}

      {/* Atmospheric Volumetric Halo */}
      {isLightOn && (
        <mesh position={[0, -4.8, 0]} scale={[1.6, 1.6, 1.6]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial 
            color="#ff8800" 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Interaction Surface */}
      <mesh position={[0, -4.8, 0]} visible={false}>
        <sphereGeometry args={[1.2]} />
      </mesh>
    </group>
  );
};
