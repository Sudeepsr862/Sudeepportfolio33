
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

  // Realistic random blinking logic for the mechanical shutters
  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
      blinkTimeout = setTimeout(triggerBlink, Math.random() * 4000 + 1500);
    };
    triggerBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // --- PREMIUM INTEGRATED SUIT MATERIALS ---
  const suitRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#8a0000",
    metalness: 0.2,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    sheen: 1,
    sheenColor: "#ff4444",
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050b1a",
    metalness: 0.4,
    roughness: 0.25,
    sheen: 0.6,
    sheenColor: "#0055ff",
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 2.2,
    roughness: 0,
  }), []);

  const techBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#080808",
    roughness: 0.15,
    metalness: 0.85,
  }), []);

  const integratedGold = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d4af37",
    metalness: 1,
    roughness: 0.2,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Centering & Natural Floating Position
    // Spidey breathes and floats slightly
    const breath = Math.sin(t * 1.4);
    groupRef.current.position.y = (breath * 0.04) - 1.35; 
    
    // 2. Head Tracking (Stares at mouse/touch)
    if (headRef.current) {
      const targetRY = state.mouse.x * 0.7;
      const targetRX = -state.mouse.y * 0.35;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRX, 0.1);
    }

    // 3. Interactive "Hello" Wave (Right Arm)
    if (wavingArmRef.current) {
      if (hovered) {
        // High-energy Hello Wave
        const waveAngle = Math.sin(t * 9) * 0.45;
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -2.0 + waveAngle, 0.15);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, -0.9, 0.15);
        wavingArmRef.current.rotation.y = THREE.MathUtils.lerp(wavingArmRef.current.rotation.y, -0.4, 0.15);
      } else {
        // Heroic Relaxed Idle
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -0.3, 0.06);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, 0.15, 0.06);
        wavingArmRef.current.rotation.y = THREE.MathUtils.lerp(wavingArmRef.current.rotation.y, 0, 0.06);
      }
    }

    // 4. Shutter Lens Dynamics (The Spidey "Squint")
    // When hovered, Spidey squints slightly to show focus
    const targetEyeScaleY = isBlinking ? 0.05 : (hovered ? 0.45 : 0.95);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.25);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.25);
    }

    // 5. Breathing Expansion
    if (chestRef.current) {
      chestRef.current.scale.setScalar(1 + breath * 0.012);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.88, 0.88, 0.88]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- REALISTIC ANATOMY HEAD --- */}
      <group ref={headRef} position={[0, 2.8, 0]}>
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.26, 32, 32]} scale={[1, 1.14, 1.05]} />
        </mesh>
        
        {/* Cinematic Mechanical Lenses */}
        <group position={[0, 0.05, 0.22]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.12, 0.02, 0]} rotation={[0.08, side * -0.25, 0]}>
              <mesh material={techBlack}>
                <sphereGeometry args={[0.16, 16, 16]} scale={[1.15, 1.25, 0.15]} />
              </mesh>
              <mesh position={[0, 0, 0.01]} material={lensWhite}>
                <sphereGeometry args={[0.14, 16, 16]} scale={[1, 1.15, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Detailed Neck */}
        <mesh position={[0, -0.32, 0]} material={suitRed}>
          <cylinderGeometry args={[0.11, 0.16, 0.35, 32]} />
        </mesh>
      </group>

      {/* --- HEROIC CHEST & TORSO --- */}
      <group ref={chestRef} position={[0, 1.75, 0]}>
        {/* Muscular Chest Plate */}
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.48, 32, 32]} scale={[1.1, 1.35, 0.78]} />
        </mesh>
        
        {/* Integrated Gold Spider Logo (Cinematic Look) */}
        <group position={[0, 0.1, 0.4]}>
          <mesh material={integratedGold} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.12, 0.18, 0.04]} />
          </mesh>
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.25, 0.22, 0]} rotation={[0, 0, 0.65]} material={integratedGold}>
                <boxGeometry args={[0.45, 0.015, 0.015]} />
              </mesh>
              <mesh position={[0.25, -0.08, 0]} rotation={[0, 0, -0.65]} material={integratedGold}>
                <boxGeometry args={[0.45, 0.015, 0.015]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Tech Suit Navy Side Panels */}
        <group scale={[1.12, 1.1, 1.15]}>
          <mesh position={[0.42, -0.2, -0.05]} material={suitBlue}>
            <sphereGeometry args={[0.28, 16, 16]} scale={[0.5, 1.25, 0.5]} />
          </mesh>
          <mesh position={[-0.42, -0.2, -0.05]} material={suitBlue}>
            <sphereGeometry args={[0.28, 16, 16]} scale={[0.5, 1.25, 0.5]} />
          </mesh>
        </group>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Relaxed) */}
      <group position={[-0.55, 2.35, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.52, 4, 12]} />
        </mesh>
        <group position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.18]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          <mesh position={[0, -0.38, 0]} material={suitRed}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.3, 0.85]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm (The Interaction Arm) */}
      <group ref={wavingArmRef} position={[0.55, 2.35, 0]} rotation={[0, 0, -0.3]}>
        <mesh material={suitRed} castShadow>
          <capsuleGeometry args={[0.09, 0.52, 4, 12]} />
        </mesh>
        <group position={[0.05, -0.6, 0]} rotation={[0, 0, -0.18]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.08, 0.5, 4, 12]} />
          </mesh>
          {/* Detailed Hand with Integrated Web Shooter */}
          <group position={[0, -0.38, 0]}>
            <mesh material={suitRed}>
              <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.3, 0.85]} />
            </mesh>
            <mesh position={[0, -0.04, 0.09]} material={techBlack}>
              <boxGeometry args={[0.05, 0.05, 0.02]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 0.85, 0]}>
          {/* Muscular Thigh */}
          <mesh material={suitBlue} castShadow>
            <capsuleGeometry args={[0.16, 0.8, 4, 12]} />
          </mesh>
          {/* Boot Details */}
          <group position={[0, -0.9, 0]}>
            <mesh material={suitRed}>
              <capsuleGeometry args={[0.13, 0.82, 4, 12]} />
            </mesh>
            <mesh position={[0, -0.48, 0.16]} material={suitRed}>
              <boxGeometry args={[0.2, 0.15, 0.48]} />
            </mesh>
            <mesh position={[0, -0.56, 0.16]} material={techBlack}>
              <boxGeometry args={[0.22, 0.05, 0.52]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Accent Rim Lights on the Suit */}
      <pointLight position={[2, 4, 2]} intensity={6} color="#ffffff" />
      <pointLight position={[-2, 1, 1]} intensity={4} color="#0055ff" />
      <pointLight position={[0, 0.5, 2]} intensity={2} color="#ff0000" />
    </group>
  );
};
