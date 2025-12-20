import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wavingArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural Blinking Logic for realistic mechanical eyes
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
    metalness: 0.15,
    roughness: 0.45,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    sheen: 1,
    sheenColor: "#ff3333",
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050a1a",
    metalness: 0.3,
    roughness: 0.3,
    sheen: 0.5,
    sheenColor: "#0044ff",
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.8,
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

    // 1. Center Floating & Subtle Breathing
    const breath = Math.sin(t * 1.2);
    groupRef.current.position.y = breath * 0.02 - 1.2; // Centering vertically in About container
    
    // 2. Head Tracking (Follows mouse cursor)
    if (headRef.current) {
      const targetRY = state.mouse.x * 0.5;
      const targetRX = -state.mouse.y * 0.25;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRX, 0.1);
    }

    // 3. Hover-Triggered "Hello" Animation (Waving only when mouse points)
    if (wavingArmRef.current) {
      if (hovered) {
        // High waving motion
        const wave = Math.sin(t * 8) * 0.35;
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -1.8 + wave, 0.1);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, -0.6, 0.1);
        wavingArmRef.current.rotation.y = THREE.MathUtils.lerp(wavingArmRef.current.rotation.y, -0.3, 0.1);
      } else {
        // Relaxed heroic stance
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -0.2, 0.05);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, 0.1, 0.05);
        wavingArmRef.current.rotation.y = THREE.MathUtils.lerp(wavingArmRef.current.rotation.y, 0, 0.05);
      }
    }

    // 4. Lens Shutter Shuttering (Squints on hover, blinks randomly)
    const targetEyeScaleY = isBlinking ? 0.05 : (hovered ? 0.45 : 0.95);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.25);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.25);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.8, 0.8, 0.8]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- REALISTIC ANATOMY HEAD --- */}
      <group ref={headRef} position={[0, 2.8, 0]}>
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.26, 32, 32]} scale={[1, 1.12, 1.05]} />
        </mesh>
        
        {/* Cinematic Mechanical Lenses */}
        <group position={[0, 0.04, 0.22]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.12, 0.02, 0]} rotation={[0.08, side * -0.25, side * -0.05]}>
              <mesh material={blackTech}>
                <sphereGeometry args={[0.16, 16, 16]} scale={[1.1, 1.2, 0.15]} />
              </mesh>
              <mesh position={[0, 0, 0.015]} material={lensWhite}>
                <sphereGeometry args={[0.14, 16, 16]} scale={[1, 1.1, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Neck */}
        <mesh position={[0, -0.32, 0]} material={suitRed}>
          <cylinderGeometry args={[0.12, 0.16, 0.3, 32]} />
        </mesh>
      </group>

      {/* --- HEROIC TORSO --- */}
      <group position={[0, 1.7, 0]}>
        {/* Chest Plate */}
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.45, 32, 32]} scale={[1.1, 1.3, 0.75]} />
        </mesh>
        
        {/* Navy Side Panels */}
        <group scale={[1.15, 1.1, 1.1]}>
          <mesh position={[0.4, -0.15, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.28, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
          <mesh position={[-0.4, -0.15, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.28, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
        </group>

        {/* Integrated Gold Spider Logo */}
        <group position={[0, 0.1, 0.38]}>
          <mesh material={goldTrim} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.03]} />
          </mesh>
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, 0.7]} material={goldTrim}>
                <boxGeometry args={[0.3, 0.015, 0.01]} />
              </mesh>
              <mesh position={[0.15, -0.12, 0]} rotation={[0, 0, -0.7]} material={goldTrim}>
                <boxGeometry args={[0.3, 0.015, 0.01]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Relaxed) */}
      <group position={[-0.55, 2.3, 0]} rotation={[0, 0, 0.25]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 12]} />
        </mesh>
        <group position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.15]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          <mesh position={[0, -0.35, 0]} material={suitRed}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.2, 0.8]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm (Waving - Hover Triggered) */}
      <group ref={wavingArmRef} position={[0.55, 2.3, 0]} rotation={[0, 0, -0.2]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 12]} />
        </mesh>
        <group position={[0.05, -0.6, 0]} rotation={[0, 0, -0.15]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          {/* Hand with Shooter Detail */}
          <mesh position={[0, -0.35, 0]} material={suitRed}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.2, 0.8]} />
          </mesh>
          <mesh position={[0, -0.3, 0.08]} material={blackTech}>
            <boxGeometry args={[0.05, 0.04, 0.02]} />
          </mesh>
        </group>
      </group>

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 0.8, 0]}>
          <mesh material={suitBlue} castShadow>
            <capsuleGeometry args={[0.16, 0.8, 4, 12]} />
          </mesh>
          <group position={[0, -0.9, 0]}>
            <mesh material={suitRed}>
              <capsuleGeometry args={[0.13, 0.8, 4, 12]} />
            </mesh>
            <mesh position={[0, -0.45, 0.15]} material={suitRed}>
              <boxGeometry args={[0.2, 0.15, 0.45]} />
            </mesh>
            {/* Tech Sole Detail */}
            <mesh position={[0, -0.52, 0.15]} material={blackTech}>
              <boxGeometry args={[0.22, 0.04, 0.48]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Rim Lighting for Suit Detail */}
      <pointLight position={[2, 3, 2]} intensity={8} color="#ffffff" />
      <pointLight position={[-2, 2, 2]} intensity={4} color="#4477ff" />
    </group>
  );
};