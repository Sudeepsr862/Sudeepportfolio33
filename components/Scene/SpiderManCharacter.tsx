import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wavingArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural Blinking Logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Materials for the "Cute Suit"
  const chibiRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ff0000",
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), []);

  const chibiBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0055ff",
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.5,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 0.8,
  }), []);

  const blackDetails = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#080808",
    roughness: 0,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Cute floating/breathing
    groupRef.current.position.y = Math.sin(t * 2) * 0.08 - 0.2;
    
    // Head looks at mouse
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.5, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.3, 0.1);
    }

    // "Hello" Waving Animation
    if (wavingArmRef.current) {
      wavingArmRef.current.rotation.z = -0.5 + Math.sin(t * 4) * 0.4;
      wavingArmRef.current.rotation.x = Math.sin(t * 2) * 0.2;
    }

    // Blinking effect
    const eyeScaleY = isBlinking ? 0.05 : 1.0;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.3);
    }
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* --- BIG CUTE HEAD --- */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        <mesh castShadow material={chibiRed}>
          <sphereGeometry args={[0.55, 32, 32]} />
        </mesh>
        
        {/* Expressive Lenses */}
        <group position={[0, 0, 0.42]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.22, 0.05, 0]}>
              {/* Eye Border */}
              <mesh material={blackDetails}>
                <sphereGeometry args={[0.18, 16, 16]} scale={[1.1, 1.2, 0.2]} />
              </mesh>
              {/* White Pupil/Lens */}
              <mesh position={[0, 0, 0.02]} material={lensWhite}>
                <sphereGeometry args={[0.15, 16, 16]} scale={[1, 1.1, 0.1]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* --- SMALL CHIBI BODY --- */}
      <group position={[0, 0.5, 0]}>
        {/* Torso */}
        <mesh castShadow material={chibiRed}>
          <sphereGeometry args={[0.35, 32, 32]} scale={[1, 1.2, 0.8]} />
        </mesh>
        
        {/* Blue Belly/Waist Detail */}
        <mesh position={[0, -0.2, 0.1]} material={chibiBlue}>
          <sphereGeometry args={[0.3, 16, 16]} scale={[0.9, 0.5, 0.8]} />
        </mesh>

        {/* Big Spider Logo */}
        <mesh position={[0, 0.1, 0.3]} material={blackDetails}>
          <sphereGeometry args={[0.08, 8, 8]} scale={[1, 1.5, 0.1]} />
        </mesh>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Resting/Pose) */}
      <group position={[-0.35, 0.7, 0]} rotation={[0, 0, 0.5]}>
        <mesh material={chibiRed}>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        </mesh>
      </group>

      {/* Right Arm (Waving Hello) */}
      <group ref={wavingArmRef} position={[0.35, 0.7, 0]} rotation={[0, 0, -0.5]}>
        <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, -1]}>
          <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
          <primitive object={chibiRed} attach="material" />
        </mesh>
        {/* Little Hand */}
        <mesh position={[0.3, 0.4, 0]} material={chibiRed}>
          <sphereGeometry args={[0.12, 12, 12]} />
        </mesh>
      </group>

      {/* --- SHORT LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.18, 0.2, 0]}>
          <mesh material={chibiBlue}>
            <capsuleGeometry args={[0.12, 0.25, 4, 8]} />
          </mesh>
          {/* Cute Red Boots */}
          <mesh position={[0, -0.25, 0.05]} material={chibiRed}>
            <sphereGeometry args={[0.15, 12, 12]} scale={[1, 0.8, 1.4]} />
          </mesh>
        </group>
      ))}

      {/* Accent Lighting */}
      <pointLight position={[1, 2, 2]} intensity={2.5} color="#ffffff" />
    </group>
  );
};