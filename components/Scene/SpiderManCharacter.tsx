
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fix for JSX intrinsic element errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const CircleGeometry = 'circleGeometry' as any;

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural athletic breathing/idle - slightly more subtle
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.02 - 0.2;
    
    // Smooth tracking of the mouse cursor with weight
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
        // High-energy interaction
        armRef.current.rotation.z = -2.8 + Math.sin(t * 12) * 0.15;
        armRef.current.rotation.x = 0.9 + Math.cos(t * 6) * 0.08;
      } else {
        // Calm heroic stance
        armRef.current.rotation.z = -0.45 + Math.sin(t * 1.2) * 0.02;
        armRef.current.rotation.x = 0.25;
      }
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.45 - Math.sin(t * 1.2) * 0.02;
      leftArmRef.current.rotation.x = 0.25;
    }
  });

  // Physical material properties for high-end look
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
    <Group ref={groupRef} scale={[0.55, 0.55, 0.55]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* --- HEAD (Refined Silhouette) --- */}
      <Group ref={headRef} position={[0, 2.3, 0]}>
        <Mesh castShadow>
          <SphereGeometry args={[0.26, 64, 64]} scale={[1, 1.18, 1.08]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
        {/* Jaw definition */}
        <Mesh position={[0, -0.09, 0.03]}>
          <SphereGeometry args={[0.23, 32, 32]} scale={[0.95, 1, 0.9]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
        
        {/* Lenses */}
        <Group position={[0, 0.02, 0.08]}>
          {/* Outer Black Frame */}
          <Mesh position={[-0.13, 0.07, 0.19]} rotation={[0.12, 0.45, 0.1]}>
            <BoxGeometry args={[0.16, 0.23, 0.04]} />
            <MeshStandardMaterial color="#020202" roughness={0.1} />
          </Mesh>
          <Mesh position={[0.13, 0.07, 0.19]} rotation={[0.12, -0.45, -0.1]}>
            <BoxGeometry args={[0.16, 0.23, 0.04]} />
            <MeshStandardMaterial color="#020202" roughness={0.1} />
          </Mesh>
          
          {/* Glowing Lens Surface */}
          <Mesh position={[-0.13, 0.07, 0.21]} rotation={[0.12, 0.45, 0.1]} scale={hovered ? [1.15, 0.8, 1] : [1, 1, 1]}>
            <BoxGeometry args={[0.13, 0.18, 0.02]} />
            <MeshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </Mesh>
          <Mesh position={[0.13, 0.07, 0.21]} rotation={[0.12, -0.45, -0.1]} scale={hovered ? [1.15, 0.8, 1] : [1, 1, 1]}>
            <BoxGeometry args={[0.13, 0.18, 0.02]} />
            <MeshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </Mesh>
        </Group>

        {/* Neck Attachment */}
        <Mesh position={[0, -0.32, 0]}>
          <CylinderGeometry args={[0.13, 0.18, 0.38, 32]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
      </Group>

      {/* --- TORSO (Muscle Mapping) --- */}
      <Group position={[0, 1.35, 0]}>
        {/* Chest and Pectorals */}
        <Mesh position={[0.18, 0.22, 0.08]} castShadow>
          <SphereGeometry args={[0.19, 32, 32]} scale={[1, 0.85, 0.6]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
        <Mesh position={[-0.18, 0.22, 0.08]} castShadow>
          <SphereGeometry args={[0.19, 32, 32]} scale={[1, 0.85, 0.6]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
        
        {/* Core Torso */}
        <Mesh position={[0, 0.1, 0]} castShadow>
          <SphereGeometry args={[0.45, 64, 64]} scale={[1, 1, 0.75]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>
        
        {/* Abs / Waist */}
        <Mesh position={[0, -0.25, 0]} castShadow>
          <CylinderGeometry args={[0.36, 0.3, 0.7, 32]} />
          <MeshPhysicalMaterial {...redSuit} />
        </Mesh>

        {/* The Advanced Suit Logo (Detailed) */}
        <Group position={[0, 0.18, 0.36]}>
          <Mesh scale={[1.1, 1.3, 1]}>
            <BoxGeometry args={[0.08, 0.18, 0.03]} />
            <MeshPhysicalMaterial {...whiteLogo} />
          </Mesh>
          {[-1, 1].map(side => (
            <React.Fragment key={`logo-side-${side}`}>
              {/* Upper Leg of Spider */}
              <Mesh position={[side * 0.2, 0.25, -0.05]} rotation={[0, 0, side * 0.9]}>
                <BoxGeometry args={[0.32, 0.05, 0.02]} />
                <MeshPhysicalMaterial {...whiteLogo} />
              </Mesh>
              {/* Lower Leg of Spider */}
              <Mesh position={[side * 0.2, -0.15, -0.05]} rotation={[0, 0, side * -0.75]}>
                <BoxGeometry args={[0.25, 0.05, 0.02]} />
                <MeshPhysicalMaterial {...whiteLogo} />
              </Mesh>
            </React.Fragment>
          ))}
        </Group>

        {/* Tactical Blue Panels (Lateral Muscles) */}
        <Mesh position={[0.34, -0.05, 0]} rotation={[0, 0, 0.08]}>
          <BoxGeometry args={[0.22, 0.95, 0.42]} />
          <MeshPhysicalMaterial {...blueSuit} />
        </Mesh>
        <Mesh position={[-0.34, -0.05, 0]} rotation={[0, 0, -0.08]}>
          <BoxGeometry args={[0.22, 0.95, 0.42]} />
          <MeshPhysicalMaterial {...blueSuit} />
        </Mesh>
      </Group>

      {/* --- ARMS --- */}
      <Group ref={armRef} position={[0.52, 1.7, 0]}>
        <Mesh><SphereGeometry args={[0.2]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.1]}><CylinderGeometry args={[0.13, 0.11, 0.65]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Group position={[0.15, -0.6, 0]}>
          <Mesh position={[0, -0.35, 0]}><CylinderGeometry args={[0.12, 0.09, 0.75]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
          <Mesh position={[0, -0.85, 0]}><SphereGeometry args={[0.1]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        </Group>
      </Group>

      <Group ref={leftArmRef} position={[-0.52, 1.7, 0]}>
        <Mesh><SphereGeometry args={[0.2]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.1]}><CylinderGeometry args={[0.13, 0.11, 0.65]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Group position={[-0.15, -0.6, 0]}>
          <Mesh position={[0, -0.35, 0]}><CylinderGeometry args={[0.12, 0.09, 0.75]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
          <Mesh position={[0, -0.85, 0]}><SphereGeometry args={[0.1]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        </Group>
      </Group>

      {/* --- LEGS --- */}
      <Group position={[-0.24, 0.55, 0]}>
        <Mesh position={[0, -0.5, 0]}><CylinderGeometry args={[0.19, 0.16, 1.15]} /><MeshPhysicalMaterial {...blueSuit} /></Mesh>
        <Mesh position={[0, -1.5, 0]}><CylinderGeometry args={[0.17, 0.14, 1.05]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Mesh position={[0, -2.1, 0.12]}><BoxGeometry args={[0.23, 0.16, 0.48]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
      </Group>
      <Group position={[0.24, 0.55, 0]}>
        <Mesh position={[0, -0.5, 0]}><CylinderGeometry args={[0.19, 0.16, 1.15]} /><MeshPhysicalMaterial {...blueSuit} /></Mesh>
        <Mesh position={[0, -1.5, 0]}><CylinderGeometry args={[0.17, 0.14, 1.05]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
        <Mesh position={[0, -2.1, 0.12]}><BoxGeometry args={[0.23, 0.16, 0.48]} /><MeshPhysicalMaterial {...redSuit} /></Mesh>
      </Group>

      {/* Heroic Base Glow */}
      <Mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <CircleGeometry args={[1.5, 32]} />
        <MeshStandardMaterial color="#ff0000" transparent opacity={0.05} />
      </Mesh>
    </Group>
  );
};
