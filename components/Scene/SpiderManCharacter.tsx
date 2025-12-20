
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
    const blinkCycle = () => {
      const delay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkCycle();
        }, 150);
      }, delay);
    };
    blinkCycle();
  }, []);

  // Professional Chibi Materials
  const suitRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#e60000",
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.8,
    sheen: 1,
    sheenColor: "#ff4444"
  }), []);

  const suitBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0044cc",
    roughness: 0.4,
    metalness: 0.1,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.2,
  }), []);

  const blackTech = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.1,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Small floating idle motion
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.2;
    
    // Head looks at cursor
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.4, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.2, 0.1);
    }

    // "Hello" Waving Animation
    if (wavingArmRef.current) {
      // Rotate arm up and wave back and forth
      wavingArmRef.current.rotation.z = -1.5 + Math.sin(t * 5) * 0.5;
      wavingArmRef.current.rotation.x = -0.5 + Math.sin(t * 2) * 0.2;
    }

    // Blinking eye scale
    const targetEyeScale = isBlinking ? 0.05 : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScale, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScale, 0.3);
    }
  });

  return (
    <group ref={groupRef} scale={[1.3, 1.3, 1.3]}>
      {/* --- BIG CUTE HEAD --- */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.55, 32, 32]} />
        </mesh>
        
        {/* Lenses */}
        <group position={[0, 0, 0.45]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.22, 0.05, 0]}>
              <mesh material={blackTech}>
                <sphereGeometry args={[0.18, 16, 16]} scale={[1.1, 1.2, 0.2]} />
              </mesh>
              <mesh position={[0, 0, 0.02]} material={lensWhite}>
                <sphereGeometry args={[0.15, 16, 16]} scale={[1, 1.1, 0.1]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Neck */}
        <mesh position={[0, -0.4, 0]} material={suitRed}>
          <cylinderGeometry args={[0.15, 0.15, 0.2]} />
        </mesh>
      </group>

      {/* --- COMPACT BODY --- */}
      <group position={[0, 0.6, 0]}>
        {/* Torso */}
        <mesh castShadow material={suitRed}>
          <sphereGeometry args={[0.35, 32, 32]} scale={[1.1, 1.2, 0.8]} />
        </mesh>
        
        {/* Blue Details */}
        <mesh position={[0, -0.2, 0.05]} material={suitBlue}>
          <sphereGeometry args={[0.3, 16, 16]} scale={[0.95, 0.5, 0.85]} />
        </mesh>

        {/* Small Logo */}
        <mesh position={[0, 0.1, 0.3]} material={blackTech}>
          <boxGeometry args={[0.1, 0.15, 0.02]} />
        </mesh>
      </group>

      {/* --- ARMS --- */}
      {/* Static Arm (Left) */}
      <group position={[-0.38, 0.85, 0]} rotation={[0, 0, 0.4]}>
        <mesh material={suitRed}>
          <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
        </mesh>
      </group>

      {/* Waving Arm (Right) - "Saying Hello" */}
      <group ref={wavingArmRef} position={[0.38, 0.85, 0]}>
        <group position={[0.15, 0.25, 0]} rotation={[0, 0, -1.2]}>
          <mesh material={suitRed}>
            <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={suitRed}>
            <sphereGeometry args={[0.12, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* --- CUTE LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.18, 0.2, 0]}>
          <mesh material={suitBlue}>
            <capsuleGeometry args={[0.13, 0.25, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.2, 0.08]} material={suitRed}>
            <sphereGeometry args={[0.15, 12, 12]} scale={[1, 0.8, 1.4]} />
          </mesh>
        </group>
      ))}
      
      {/* Studio Lighting Accents */}
      <pointLight position={[1, 2, 2]} intensity={2} color="#ffffff" />
      <pointLight position={[-1, 1, 1]} intensity={1} color="#4488ff" />
    </group>
  );
};
