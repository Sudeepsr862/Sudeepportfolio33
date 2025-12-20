
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wavingArmRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural Blinking Logic
  useEffect(() => {
    const blinkCycle = () => {
      const delay = Math.random() * 4000 + 2000;
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkCycle();
        }, 120);
      }, delay);
    };
    blinkCycle();
  }, []);

  // --- CINEMATIC SUIT MATERIALS ---
  const suitRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#a00000",
    metalness: 0.2,
    roughness: 0.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    sheen: 1,
    sheenColor: "#ff3333",
    // We simulate the texture with a high-detail physical material
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050a1a",
    metalness: 0.4,
    roughness: 0.3,
    sheen: 0.5,
    sheenColor: "#0044ff",
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.5,
    roughness: 0,
  }), []);

  const blackTech = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#080808",
    roughness: 0.1,
    metalness: 0.8,
  }), []);

  const goldTrim = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d4af37",
    metalness: 1,
    roughness: 0.2,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Center Floating & Breathing
    const breath = Math.sin(t * 1.2);
    groupRef.current.position.y = breath * 0.03 - 0.5; // Centered vertically
    
    if (chestRef.current) {
      chestRef.current.scale.set(1 + breath * 0.01, 1 + breath * 0.01, 1 + breath * 0.01);
    }

    // 2. Head Tracking
    if (headRef.current) {
      const targetRY = state.mouse.x * 0.6;
      const targetRX = -state.mouse.y * 0.3;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRX, 0.1);
    }

    // 3. Hover-Triggered "Hello" Animation
    if (wavingArmRef.current) {
      if (hovered) {
        // High waving motion
        const wave = Math.sin(t * 8) * 0.4;
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -1.8 + wave, 0.1);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, -0.8, 0.1);
      } else {
        // Relaxed natural stance
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -0.3, 0.05);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, 0.1, 0.05);
      }
    }

    // 4. Shutter Lens Animation (Realistic mechanical eyes)
    const targetEyeScaleY = isBlinking ? 0.05 : (hovered ? 0.6 : 1);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.25);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.25);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.85, 0.85, 0.85]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- REALISTIC ANATOMY HEAD --- */}
      <group ref={headRef} position={[0, 2.8, 0]}>
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.26, 32, 32]} scale={[1, 1.15, 1.05]} />
        </mesh>
        
        {/* Cinematic Mechanical Lenses */}
        <group position={[0, 0.05, 0.2]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.12, 0.02, 0]} rotation={[0.1, side * -0.25, 0]}>
              <mesh material={blackTech}>
                <sphereGeometry args={[0.16, 16, 16]} scale={[1.1, 1.2, 0.1]} />
              </mesh>
              <mesh position={[0, 0, 0.01]} material={lensWhite}>
                <sphereGeometry args={[0.14, 16, 16]} scale={[1, 1.1, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Neck */}
        <mesh position={[0, -0.35, 0]} material={suitRed}>
          <cylinderGeometry args={[0.12, 0.16, 0.3]} />
        </mesh>
      </group>

      {/* --- HEROIC TORSO --- */}
      <group ref={chestRef} position={[0, 1.8, 0]}>
        {/* Chest Plate */}
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.45, 32, 32]} scale={[1.1, 1.3, 0.7]} />
        </mesh>
        
        {/* Blue Side Panels */}
        <group scale={[1.15, 1.1, 1.05]}>
          <mesh position={[0.35, -0.2, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.3, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
          <mesh position={[-0.35, -0.2, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.3, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
        </group>

        {/* Integrated Gold Spider Logo */}
        <mesh position={[0, 0.1, 0.35]} material={goldTrim} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.03]} />
        </mesh>
        {/* Spider Legs Trim */}
        {[1, -1].map(side => (
          <group key={side} position={[side * 0.2, 0.15, 0.3]} rotation={[0, 0, side * 0.5]}>
            <mesh material={goldTrim}>
              <boxGeometry args={[0.3, 0.01, 0.01]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Relaxed) */}
      <group position={[-0.55, 2.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
        </mesh>
        <group position={[-0.1, -0.6, 0]} rotation={[0, 0, 0.2]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.07, 0.5, 4, 12]} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.35, 0]} material={suitRed}>
            <sphereGeometry args={[0.09, 16, 16]} scale={[1, 1.2, 0.8]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm (Waving - Interaction Triggered) */}
      <group ref={wavingArmRef} position={[0.55, 2.3, 0]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
        </mesh>
        <group position={[0.1, -0.6, 0]} rotation={[0, 0, -0.2]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.07, 0.5, 4, 12]} />
          </mesh>
          {/* Hand with Web Shooter Detail */}
          <mesh position={[0, -0.35, 0]} material={suitRed}>
            <sphereGeometry args={[0.09, 16, 16]} scale={[1, 1.2, 0.8]} />
          </mesh>
          <mesh position={[0, -0.3, 0.08]} material={blackTech}>
            <boxGeometry args={[0.04, 0.04, 0.02]} />
          </mesh>
        </group>
      </group>

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 1.0, 0]}>
          {/* Thigh */}
          <mesh material={suitBlue} castShadow>
            <capsuleGeometry args={[0.14, 0.8, 4, 12]} />
          </mesh>
          {/* Lower Leg */}
          <group position={[0, -0.9, 0]}>
            <mesh material={suitRed}>
              <capsuleGeometry args={[0.11, 0.8, 4, 12]} />
            </mesh>
            {/* Foot */}
            <mesh position={[0, -0.45, 0.15]} material={suitRed}>
              <boxGeometry args={[0.18, 0.12, 0.4]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Cinematic Studio Lights on the Suit */}
      <spotLight position={[2, 5, 5]} intensity={10} color="#ff3333" />
      <pointLight position={[-2, 2, 2]} intensity={5} color="#4488ff" />
    </group>
  );
};
