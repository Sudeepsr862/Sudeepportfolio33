import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wavingArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Realistic random blinking logic
  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
      blinkTimeout = setTimeout(triggerBlink, Math.random() * 4000 + 2000);
    };
    triggerBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // --- PREMIUM SUIT MATERIALS ---
  const suitRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#900000",
    metalness: 0.15,
    roughness: 0.5,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    sheen: 1,
    sheenColor: "#ff4444",
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0a1530",
    metalness: 0.3,
    roughness: 0.3,
    sheen: 0.5,
    sheenColor: "#0044ff",
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 2.5,
    roughness: 0,
  }), []);

  const techBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    roughness: 0.1,
    metalness: 0.9,
  }), []);

  const integratedGold = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d4af37",
    metalness: 1,
    roughness: 0.25,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Hover-Triggered "Hello" Wave (Right Arm)
    if (wavingArmRef.current) {
      if (hovered) {
        // High Wave Animation
        const wave = Math.sin(t * 8) * 0.4;
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -1.8 + wave, 0.15);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, -0.8, 0.15);
      } else {
        // Natural Heroic Idle Stance
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -0.3, 0.05);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, 0.1, 0.05);
      }
    }

    // 2. Head Tracking (Look at cursor)
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.6, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.35, 0.1);
    }

    // 3. Shutter Lens Animation (Realistic mechanical eyes)
    // Squints when hovered, blinks randomly
    const targetEyeScaleY = isBlinking ? 0.05 : (hovered ? 0.5 : 1.0);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.2);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.2);
    }

    // 4. Subtle Breathing Idle (Torso and Position)
    const breath = Math.sin(t * 1.5);
    groupRef.current.position.y = (breath * 0.03) - 1.25; // Centered vertically in About frame
    if (chestRef.current) {
      chestRef.current.scale.setScalar(1 + breath * 0.008);
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
      <group ref={headRef} position={[0, 2.75, 0]}>
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.27, 32, 32]} scale={[1, 1.15, 1.05]} />
        </mesh>
        
        {/* Cinematic Mechanical Lenses */}
        <group position={[0, 0.05, 0.23]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.13, 0.02, 0]} rotation={[0.08, side * -0.3, 0]}>
              <mesh material={techBlack}>
                <sphereGeometry args={[0.16, 16, 16]} scale={[1.15, 1.2, 0.15]} />
              </mesh>
              <mesh position={[0, 0, 0.015]} material={lensWhite}>
                <sphereGeometry args={[0.14, 16, 16]} scale={[1, 1.1, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Neck Attachment */}
        <mesh position={[0, -0.3, 0]} material={suitRed}>
          <cylinderGeometry args={[0.12, 0.16, 0.3, 32]} />
        </mesh>
      </group>

      {/* --- HEROIC CHEST & TORSO --- */}
      <group ref={chestRef} position={[0, 1.7, 0]}>
        {/* Red Chest Plate */}
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.48, 32, 32]} scale={[1.05, 1.3, 0.75]} />
        </mesh>
        
        {/* Integrated Gold Spider Logo (Detailed) */}
        <group position={[0, 0.15, 0.38]}>
          <mesh material={integratedGold} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.1, 0.15, 0.04]} />
          </mesh>
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, 0.7]} material={integratedGold}>
                <boxGeometry args={[0.4, 0.02, 0.01]} />
              </mesh>
              <mesh position={[0.22, -0.1, 0]} rotation={[0, 0, -0.7]} material={integratedGold}>
                <boxGeometry args={[0.4, 0.02, 0.01]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Tech Belt */}
        <mesh position={[0, -0.65, 0]} material={techBlack}>
          <cylinderGeometry args={[0.38, 0.38, 0.1]} />
        </mesh>

        {/* Navy Side Panels */}
        <group scale={[1.1, 1.1, 1.1]}>
          <mesh position={[0.4, -0.2, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.3, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
          <mesh position={[-0.4, -0.2, -0.1]} material={suitBlue}>
            <sphereGeometry args={[0.3, 16, 16]} scale={[0.5, 1.2, 0.5]} />
          </mesh>
        </group>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Relaxed/Heroic) */}
      <group position={[-0.55, 2.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 12]} />
        </mesh>
        <group position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.2]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          <mesh position={[0, -0.35, 0]} material={suitRed}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.3, 0.8]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm (Waving - Interaction Triggered) */}
      <group ref={wavingArmRef} position={[0.55, 2.3, 0]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 12]} />
        </mesh>
        <group position={[0.05, -0.6, 0]} rotation={[0, 0, -0.2]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          {/* Hand with Mechanical Web Shooter */}
          <group position={[0, -0.35, 0]}>
            <mesh material={suitRed}>
              <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.3, 0.8]} />
            </mesh>
            <mesh position={[0, -0.05, 0.08]} material={techBlack}>
              <boxGeometry args={[0.05, 0.05, 0.02]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 0.8, 0]}>
          {/* Thigh */}
          <mesh material={suitBlue} castShadow>
            <capsuleGeometry args={[0.15, 0.8, 4, 12]} />
          </mesh>
          {/* Lower Leg & Boots */}
          <group position={[0, -0.9, 0]}>
            <mesh material={suitRed}>
              <capsuleGeometry args={[0.12, 0.8, 4, 12]} />
            </mesh>
            {/* Detailed Hero Boot */}
            <mesh position={[0, -0.45, 0.15]} material={suitRed}>
              <boxGeometry args={[0.18, 0.15, 0.45]} />
            </mesh>
            <mesh position={[0, -0.52, 0.15]} material={techBlack}>
              <boxGeometry args={[0.2, 0.05, 0.48]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Dynamic Lighting specifically for the character's materials */}
      <pointLight position={[2, 3, 2]} intensity={5} color="#ffffff" />
      <pointLight position={[-2, 1, 1]} intensity={3} color="#4477ff" />
    </group>
  );
};