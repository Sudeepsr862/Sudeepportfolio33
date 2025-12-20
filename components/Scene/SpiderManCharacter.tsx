
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Materials for the "Integrated Suit" (Tom Holland Style)
  const metallicRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#b00000",
    metalness: 0.6,
    roughness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    sheen: 1,
    sheenColor: "#ff0000",
  }), []);

  const carbonFiberBlack = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050505",
    metalness: 0.8,
    roughness: 0.4,
    clearcoat: 0.5,
  }), []);

  const highGlossGold = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#d4af37",
    metalness: 1.0,
    roughness: 0.1,
    emissive: "#aa8800",
    emissiveIntensity: 0.2,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.5,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural breathing and floating animation
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.2, 0.05);

    // Head tracking
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.8, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.5, 0.1);
    }

    // Mechanical Eye/Lens "Shutter" effect
    const eyeScaleY = hovered ? 0.6 : (0.9 + Math.sin(t * 3) * 0.05); // Blink/Squint
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.1);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={[0.75, 0.75, 0.75]}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 2.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 64, 64]} scale={[1, 1.15, 1.05]} />
          <primitive object={metallicRed} attach="material" />
        </mesh>
        
        {/* Mechanical Lenses */}
        <group position={[0, 0.05, 0.22]}>
          {/* Left Lens */}
          <group ref={leftEyeRef} position={[-0.14, 0.02, 0]} rotation={[0.1, 0.4, 0.1]}>
            <mesh>
              <boxGeometry args={[0.18, 0.22, 0.05]} />
              <meshStandardMaterial color="#000000" roughness={0} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.14, 0.18, 0.02]} />
              <primitive object={lensWhite} attach="material" />
            </mesh>
          </group>
          {/* Right Lens */}
          <group ref={rightEyeRef} position={[0.14, 0.02, 0]} rotation={[0.1, -0.4, -0.1]}>
            <mesh>
              <boxGeometry args={[0.18, 0.22, 0.05]} />
              <meshStandardMaterial color="#000000" roughness={0} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.14, 0.18, 0.02]} />
              <primitive object={lensWhite} attach="material" />
            </mesh>
          </group>
        </group>
        
        {/* Neck */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.4, 32]} />
          <primitive object={metallicRed} attach="material" />
        </mesh>
      </group>

      {/* TORSO */}
      <group position={[0, 1.5, 0]}>
        {/* Upper Chest */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 64, 64]} scale={[1, 1.1, 0.7]} />
          <primitive object={metallicRed} attach="material" />
        </mesh>
        
        {/* Waist/Abdomen */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.3, 0.8, 32]} />
          <primitive object={carbonFiberBlack} attach="material" />
        </mesh>

        {/* Integrated Suit Gold Spider Logo (Chest & Back) */}
        <group position={[0, 0.1, 0.35]}>
          {/* Core Body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 6]} />
            <primitive object={highGlossGold} attach="material" />
          </mesh>
          {/* Top Legs */}
          <mesh position={[0.2, 0.25, 0]} rotation={[0, 0, 1]}>
            <boxGeometry args={[0.4, 0.04, 0.03]} />
            <primitive object={highGlossGold} attach="material" />
          </mesh>
          <mesh position={[-0.2, 0.25, 0]} rotation={[0, 0, -1]}>
            <boxGeometry args={[0.4, 0.04, 0.03]} />
            <primitive object={highGlossGold} attach="material" />
          </mesh>
          {/* Bottom Legs */}
          <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, -0.8]}>
            <boxGeometry args={[0.4, 0.04, 0.03]} />
            <primitive object={highGlossGold} attach="material" />
          </mesh>
          <mesh position={[-0.15, -0.25, 0]} rotation={[0, 0, 0.8]}>
            <boxGeometry args={[0.4, 0.04, 0.03]} />
            <primitive object={highGlossGold} attach="material" />
          </mesh>
        </group>

        {/* Side Panels (Integrated Suit aesthetic) */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.1, 1, 0.4]} />
          <primitive object={carbonFiberBlack} attach="material" />
        </mesh>
        <mesh position={[-0.4, 0, 0]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 1, 0.4]} />
          <primitive object={carbonFiberBlack} attach="material" />
        </mesh>
      </group>

      {/* ARMS */}
      {/* Right Arm */}
      <group position={[0.55, 2.2, 0]}>
        <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 32]} />
          <primitive object={metallicRed} attach="material" />
        </mesh>
        <group position={[0.15, -0.65, 0]}>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.75, 32]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
          {/* Hand/Gauntlet */}
          <mesh position={[0, -0.8, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.2, 1]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left Arm */}
      <group position={[-0.55, 2.2, 0]}>
        <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 32]} />
          <primitive object={metallicRed} attach="material" />
        </mesh>
        <group position={[-0.15, -0.65, 0]}>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.75, 32]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
          {/* Hand/Gauntlet */}
          <mesh position={[0, -0.8, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} scale={[1, 1.2, 1]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
        </group>
      </group>

      {/* LEGS */}
      {/* Right Leg */}
      <group position={[0.22, 0.6, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.2, 0.16, 1.2, 32]} />
          <primitive object={carbonFiberBlack} attach="material" />
        </mesh>
        <group position={[0, -1.2, 0]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.16, 0.12, 1.0, 32]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.05, 0.15]}>
            <boxGeometry args={[0.18, 0.15, 0.4]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group position={[-0.22, 0.6, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.2, 0.16, 1.2, 32]} />
          <primitive object={carbonFiberBlack} attach="material" />
        </mesh>
        <group position={[0, -1.2, 0]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.16, 0.12, 1.0, 32]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.05, 0.15]}>
            <boxGeometry args={[0.18, 0.15, 0.4]} />
            <primitive object={metallicRed} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Hero Lighting Anchor */}
      <pointLight position={[0, 1.5, 0.5]} intensity={2} color="#ffffff" distance={5} />
    </group>
  );
};
