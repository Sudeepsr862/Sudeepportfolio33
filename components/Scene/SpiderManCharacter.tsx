
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

  // Optimized blink logic
  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 100);
      blinkTimeout = setTimeout(triggerBlink, Math.random() * 5000 + 2000);
    };
    triggerBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Optimized Standard Materials (Faster than PhysicalMaterial)
  const suitRed = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#a00000",
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#200000",
    emissiveIntensity: 0.2
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#050b1a",
    metalness: 0.5,
    roughness: 0.3,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.5,
  }), []);

  const techBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    roughness: 0.2,
    metalness: 0.8,
  }), []);

  const integratedGold = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d4af37",
    metalness: 1,
    roughness: 0.2,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Hover-Triggered "Hello" Wave
    if (wavingArmRef.current) {
      if (hovered) {
        const wave = Math.sin(t * 10) * 0.4;
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -1.8 + wave, 0.1);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, -0.8, 0.1);
      } else {
        wavingArmRef.current.rotation.z = THREE.MathUtils.lerp(wavingArmRef.current.rotation.z, -0.3, 0.05);
        wavingArmRef.current.rotation.x = THREE.MathUtils.lerp(wavingArmRef.current.rotation.x, 0.1, 0.05);
      }
    }

    // 2. Optimized Head Tracking
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.5, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.25, 0.08);
    }

    // 3. Shutter Lens Dynamics
    const targetEyeScaleY = isBlinking ? 0.05 : (hovered ? 0.5 : 0.9);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.2);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.2);
    }

    // 4. Subtle Float & Position Fix
    groupRef.current.position.y = (Math.sin(t * 1.5) * 0.03) - 1.3; 
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.85, 0.85, 0.85]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Head */}
      <group ref={headRef} position={[0, 2.7, 0]}>
        <mesh material={suitRed}>
          <sphereGeometry args={[0.26, 24, 24]} scale={[1, 1.15, 1.05]} />
        </mesh>
        
        {/* Shutter Lenses */}
        <group position={[0, 0.05, 0.22]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.12, 0.02, 0]} rotation={[0.08, side * -0.25, 0]}>
              <mesh material={techBlack}>
                <sphereGeometry args={[0.16, 12, 12]} scale={[1.1, 1.25, 0.1]} />
              </mesh>
              <mesh position={[0, 0, 0.01]} material={lensWhite}>
                <sphereGeometry args={[0.14, 12, 12]} scale={[1, 1.1, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
        <mesh position={[0, -0.3, 0]} material={suitRed}>
          <cylinderGeometry args={[0.11, 0.15, 0.3, 16]} />
        </mesh>
      </group>

      {/* Torso */}
      <group position={[0, 1.7, 0]}>
        <mesh material={suitRed}>
          <sphereGeometry args={[0.45, 24, 24]} scale={[1.1, 1.3, 0.75]} />
        </mesh>
        <group position={[0, 0.1, 0.38]}>
          <mesh material={integratedGold}>
            <boxGeometry args={[0.1, 0.15, 0.03]} />
          </mesh>
        </group>
        <mesh position={[0.4, -0.2, -0.1]} material={suitBlue}>
          <sphereGeometry args={[0.25, 16, 16]} scale={[0.5, 1.2, 0.5]} />
        </mesh>
        <mesh position={[-0.4, -0.2, -0.1]} material={suitBlue}>
          <sphereGeometry args={[0.25, 16, 16]} scale={[0.5, 1.2, 0.5]} />
        </mesh>
      </group>

      {/* Arm L */}
      <group position={[-0.5, 2.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={suitRed}>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        </mesh>
        <group position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.2]}>
          <mesh material={suitRed}><capsuleGeometry args={[0.07, 0.5, 4, 8]} /></mesh>
          <mesh position={[0, -0.35, 0]} material={suitRed}><sphereGeometry args={[0.09, 8, 8]} /></mesh>
        </group>
      </group>

      {/* Arm R (Waving) */}
      <group ref={wavingArmRef} position={[0.5, 2.3, 0]}>
        <mesh material={suitRed}>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        </mesh>
        <group position={[0.05, -0.6, 0]} rotation={[0, 0, -0.2]}>
          <mesh material={suitRed}><capsuleGeometry args={[0.07, 0.5, 4, 8]} /></mesh>
          <mesh position={[0, -0.35, 0]} material={suitRed}><sphereGeometry args={[0.09, 8, 8]} /></mesh>
        </group>
      </group>

      {/* Legs */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.2, 0.8, 0]}>
          <mesh material={suitBlue}><capsuleGeometry args={[0.14, 0.8, 4, 8]} /></mesh>
          <group position={[0, -0.9, 0]}>
            <mesh material={suitRed}><capsuleGeometry args={[0.11, 0.8, 4, 8]} /></mesh>
            <mesh position={[0, -0.45, 0.15]} material={suitRed}><boxGeometry args={[0.18, 0.12, 0.4]} /></mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
