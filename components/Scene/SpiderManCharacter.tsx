
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const TorusGeometry = 'torusGeometry' as any;
const CapsuleGeometry = 'capsuleGeometry' as any;

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural athletic idle sway
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.04 - 0.5;
    
    // Smooth tracking of the mouse cursor with "Weight"
    const targetRY = state.mouse.x * 0.45;
    const targetRX = -state.mouse.y * 0.15;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY * 0.08, 0.05);
    
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRX, 0.1);
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.01;
    }

    // Iconic "Spider-Pose" or Wave
    if (armRef.current) {
      if (hovered) {
        // Dynamic "Thwip" pose / wave combo
        armRef.current.rotation.z = -2.8 + Math.sin(t * 12) * 0.2;
        armRef.current.rotation.x = 0.8 + Math.cos(t * 6) * 0.1;
      } else {
        // Heroic idle
        armRef.current.rotation.z = -0.3 + Math.sin(t * 1.2) * 0.02;
        armRef.current.rotation.x = 0.2;
      }
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.3 - Math.sin(t * 1.2) * 0.02;
      leftArmRef.current.rotation.x = 0.2;
    }
  });

  // Materials with enhanced realism
  const redMatProps = {
    color: "#a00000",
    roughness: 0.65,
    metalness: 0.15,
    clearcoat: 0.1,
    clearcoatRoughness: 0.2,
    sheen: 0.6,
    sheenColor: "#ff4444",
    reflectivity: 0.3,
  };

  const blueMatProps = {
    color: "#001a66",
    roughness: 0.4,
    metalness: 0.25,
    clearcoat: 0.4,
    reflectivity: 0.6,
  };

  const whiteMatProps = {
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: hovered ? 0.6 : 0.1,
    roughness: 0.1,
    metalness: 0.5,
  };

  return (
    <Group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- HEAD (Insomniac Style) --- */}
      <Group ref={headRef} position={[0, 2.15, 0]}>
        {/* Skull definition */}
        <Mesh castShadow>
          <SphereGeometry args={[0.26, 32, 32]} scale={[1, 1.1, 1]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        {/* Jawline definition */}
        <Mesh position={[0, -0.08, 0.02]}>
          <SphereGeometry args={[0.22, 32, 32]} scale={[1, 1, 0.9]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        
        {/* Realistic Lenses */}
        <Group position={[0, 0.03, 0.06]}>
          {/* Black Carbon-Fiber Frames */}
          <Mesh position={[-0.13, 0.05, 0.18]} rotation={[0.1, 0.4, 0.1]}>
            <BoxGeometry args={[0.16, 0.2, 0.06]} />
            <MeshStandardMaterial color="#020202" roughness={0.1} />
          </Mesh>
          <Mesh position={[0.13, 0.05, 0.18]} rotation={[0.1, -0.4, -0.1]}>
            <BoxGeometry args={[0.16, 0.2, 0.06]} />
            <MeshStandardMaterial color="#020202" roughness={0.1} />
          </Mesh>
          
          {/* Glowing Lenses */}
          <Mesh position={[-0.13, 0.05, 0.21]} rotation={[0.1, 0.4, 0.1]} scale={hovered ? [1.1, 0.8, 1] : [1, 1, 1]}>
            <BoxGeometry args={[0.13, 0.16, 0.03]} />
            <MeshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </Mesh>
          <Mesh position={[0.13, 0.05, 0.21]} rotation={[0.1, -0.4, -0.1]} scale={hovered ? [1.1, 0.8, 1] : [1, 1, 1]}>
            <BoxGeometry args={[0.13, 0.16, 0.03]} />
            <MeshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </Mesh>
        </Group>

        {/* Neck with Trapezoid definition */}
        <Mesh position={[0, -0.32, 0]}>
          <CylinderGeometry args={[0.12, 0.16, 0.3]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
      </Group>

      {/* --- TORSO (Segmented Musculature) --- */}
      <Group position={[0, 1.25, 0]}>
        {/* Pectorals */}
        <Mesh position={[0, 0.25, 0.05]} castShadow>
          <SphereGeometry args={[0.42, 32, 32]} scale={[1, 0.7, 0.6]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        {/* Abdominal / Core */}
        <Mesh position={[0, -0.1, 0]} castShadow>
          <CylinderGeometry args={[0.34, 0.28, 0.7, 16]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>

        {/* The Advanced Suit White Spider (Precision Mesh) */}
        <Group position={[0, 0.15, 0.36]}>
          {/* Center Body */}
          <Mesh scale={[1, 1.2, 1]}>
            <BoxGeometry args={[0.08, 0.16, 0.03]} />
            <MeshPhysicalMaterial {...whiteMatProps} />
          </Mesh>
          {/* Detailed Legs (Insomniac Style) */}
          {[-1, 1].map(side => (
            <React.Fragment key={`u${side}`}>
              {/* Upper Leg */}
              <Mesh position={[side * 0.18, 0.22, -0.05]} rotation={[0, 0, side * 0.85]}>
                <BoxGeometry args={[0.3, 0.045, 0.02]} />
                <MeshPhysicalMaterial {...whiteMatProps} />
              </Mesh>
              {/* Mid Leg */}
              <Mesh position={[side * 0.24, 0.06, -0.05]} rotation={[0, 0, side * 0.3]}>
                <BoxGeometry args={[0.18, 0.04, 0.02]} />
                <MeshPhysicalMaterial {...whiteMatProps} />
              </Mesh>
              {/* Lower Leg */}
              <Mesh position={[side * 0.18, -0.1, -0.05]} rotation={[0, 0, side * -0.6]}>
                <BoxGeometry args={[0.22, 0.04, 0.02]} />
                <MeshPhysicalMaterial {...whiteMatProps} />
              </Mesh>
              <Mesh position={[side * 0.22, -0.22, -0.05]} rotation={[0, 0, side * -1.2]}>
                <BoxGeometry args={[0.2, 0.04, 0.02]} />
                <MeshPhysicalMaterial {...whiteMatProps} />
              </Mesh>
            </React.Fragment>
          ))}
        </Group>

        {/* Blue Tactical Accents (Sides) */}
        <Mesh position={[0.3, -0.05, 0]} rotation={[0, 0, 0.12]}>
          <BoxGeometry args={[0.22, 0.85, 0.4]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
        <Mesh position={[-0.3, -0.05, 0]} rotation={[0, 0, -0.12]}>
          <BoxGeometry args={[0.22, 0.85, 0.4]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
      </Group>

      {/* --- ARMS (Muscular Segments) --- */}
      {/* Right Arm */}
      <Group ref={armRef} position={[0.46, 1.6, 0]}>
        {/* Deltoid */}
        <Mesh>
          <SphereGeometry args={[0.18, 16, 16]} scale={[1, 1.1, 1.1]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        {/* Bicep/Tricep */}
        <Mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.15]}>
          <CylinderGeometry args={[0.12, 0.1, 0.65, 12]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        {/* Forearm (Gauntlet) */}
        <Group position={[0.15, -0.6, 0]} rotation={[0, 0, -0.08]}>
          <Mesh position={[0, -0.35, 0]}>
            <CylinderGeometry args={[0.11, 0.08, 0.75, 12]} />
            <MeshPhysicalMaterial {...redMatProps} />
          </Mesh>
          {/* White Carbon-Fiber Detail */}
          <Mesh position={[0, -0.2, 0.08]}>
            <BoxGeometry args={[0.08, 0.2, 0.04]} />
            <MeshPhysicalMaterial {...whiteMatProps} />
          </Mesh>
          {/* Web-Shooter Hub */}
          <Mesh position={[0, -0.6, 0.09]}>
            <BoxGeometry args={[0.05, 0.05, 0.05]} />
            <MeshStandardMaterial color="#222" metalness={0.9} />
          </Mesh>
          {/* Hand */}
          <Mesh position={[0, -0.85, 0]}>
            <SphereGeometry args={[0.09]} />
            <MeshPhysicalMaterial {...redMatProps} />
          </Mesh>
        </Group>
      </Group>

      {/* Left Arm */}
      <Group ref={leftArmRef} position={[-0.46, 1.6, 0]}>
        <Mesh>
          <SphereGeometry args={[0.18, 16, 16]} scale={[1, 1.1, 1.1]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        <Mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.15]}>
          <CylinderGeometry args={[0.12, 0.1, 0.65, 12]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        <Group position={[-0.15, -0.6, 0]} rotation={[0, 0, 0.08]}>
          <Mesh position={[0, -0.35, 0]}>
            <CylinderGeometry args={[0.11, 0.08, 0.75, 12]} />
            <MeshPhysicalMaterial {...redMatProps} />
          </Mesh>
          <Mesh position={[0, -0.2, 0.08]}>
            <BoxGeometry args={[0.08, 0.2, 0.04]} />
            <MeshPhysicalMaterial {...whiteMatProps} />
          </Mesh>
          <Mesh position={[0, -0.85, 0]}>
            <SphereGeometry args={[0.09]} />
            <MeshPhysicalMaterial {...redMatProps} />
          </Mesh>
        </Group>
      </Group>

      {/* --- LEGS --- */}
      <Group position={[-0.22, 0.45, 0]}>
        {/* Thigh */}
        <Mesh position={[0, -0.45, 0]}>
          <CylinderGeometry args={[0.18, 0.14, 1.0, 12]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
        {/* Knee Pad Detail */}
        <Mesh position={[0, -0.95, 0.08]}>
          <BoxGeometry args={[0.14, 0.14, 0.06]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
        {/* Boot (Upper) */}
        <Mesh position={[0, -1.5, 0]}>
          <CylinderGeometry args={[0.15, 0.12, 1.1, 12]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        {/* Foot */}
        <Mesh position={[0, -2.1, 0.1]}>
          <BoxGeometry args={[0.22, 0.15, 0.45]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
      </Group>

      <Group position={[0.22, 0.45, 0]}>
        <Mesh position={[0, -0.45, 0]}>
          <CylinderGeometry args={[0.18, 0.14, 1.0, 12]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
        <Mesh position={[0, -0.95, 0.08]}>
          <BoxGeometry args={[0.14, 0.14, 0.06]} />
          <MeshPhysicalMaterial {...blueMatProps} />
        </Mesh>
        <Mesh position={[0, -1.5, 0]}>
          <CylinderGeometry args={[0.15, 0.12, 1.1, 12]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
        <Mesh position={[0, -2.1, 0.1]}>
          <BoxGeometry args={[0.22, 0.15, 0.45]} />
          <MeshPhysicalMaterial {...redMatProps} />
        </Mesh>
      </Group>

      {/* Spider-Sense Radiating Pulse (Neon) */}
      {hovered && (
        <Group position={[0, 2.2, 0]}>
          {[1.2, 1.4, 1.6].map((sc, i) => (
            <Mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={[sc, sc, sc]}>
              <TorusGeometry args={[0.45, 0.005, 16, 128]} />
              <MeshStandardMaterial 
                color="#ff2200" 
                emissive="#ff0000" 
                emissiveIntensity={10} 
                transparent 
                opacity={0.9 - i * 0.3} 
              />
            </Mesh>
          ))}
        </Group>
      )}
    </Group>
  );
};
