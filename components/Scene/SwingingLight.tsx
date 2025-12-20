
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fix for JSX intrinsic element errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const PointLight = 'pointLight' as any;
const TorusGeometry = 'torusGeometry' as any;

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
    <Group 
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
      <Mesh position={[0, -2.2, 0]}>
        <CylinderGeometry args={[0.02, 0.02, 4.5]} />
        <MeshStandardMaterial 
          color={isLightOn ? "#ffd27d" : "#ffffff"} 
          roughness={0.1} 
          metalness={0.9}
          emissive={isLightOn ? "#ffaa00" : "#ffffff"}
          emissiveIntensity={isLightOn ? 0.8 : 0.4}
        />
      </Mesh>

      {/* Industrial Bulb Base */}
      <Mesh position={[0, -4.4, 0]}>
        <CylinderGeometry args={[0.18, 0.15, 0.35]} />
        <MeshStandardMaterial color="#222" metalness={1} roughness={0.05} />
      </Mesh>

      {/* --- BULB CORE --- */}
      <Mesh position={[0, -4.8, 0]}>
        <SphereGeometry args={[0.35, 32, 32]} />
        <MeshPhysicalMaterial 
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
            <PointLight intensity={150} color="#ffcc33" distance={20} decay={2} castShadow />
            <PointLight intensity={30} color="#ffffff" distance={6} position={[0, -0.1, 0]} />
            <PointLight intensity={5} color="#ff9900" distance={40} position={[0, 3, 0]} />
          </>
        )}
      </Mesh>

      {/* --- BULB OUTLINE (The requested Rim effect) --- */}
      <Mesh position={[0, -4.8, 0]} scale={[1.05, 1.05, 1.05]}>
        <SphereGeometry args={[0.35, 32, 32]} />
        <MeshBasicMaterial 
          color={isLightOn ? "#ffcc00" : (hovered ? "#ff0000" : "#ffffff")} 
          side={THREE.BackSide} 
          transparent 
          opacity={isLightOn ? 0.6 : 0.15}
        />
      </Mesh>

      {/* Internal Filament (Adds to the lit aesthetic) */}
      {isLightOn && (
        <Mesh position={[0, -4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <TorusGeometry args={[0.08, 0.005, 8, 24]} />
          <MeshBasicMaterial color="#ffffff" />
        </Mesh>
      )}

      {/* Atmospheric Volumetric Halo */}
      {isLightOn && (
        <Mesh position={[0, -4.8, 0]} scale={[1.6, 1.6, 1.6]}>
          <SphereGeometry args={[0.35, 32, 32]} />
          <MeshStandardMaterial 
            color="#ff8800" 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </Mesh>
      )}
      
      {/* Interaction Surface */}
      <Mesh position={[0, -4.8, 0]} visible={false}>
        <SphereGeometry args={[1.2]} />
      </Mesh>
    </Group>
  );
};
