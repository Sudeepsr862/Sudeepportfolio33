import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Advanced Materials for the "Integrated Suit"
  const mcuRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#b00000",
    metalness: 0.15,
    roughness: 0.4,
    sheen: 1,
    sheenColor: "#ff0000",
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  }), []);

  const mcuBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0a1a3a", // Deeper, more textured navy
    metalness: 0.2,
    roughness: 0.3,
    sheen: 0.5,
    sheenColor: "#2244ff",
  }), []);

  const techBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    roughness: 0.1,
    metalness: 0.8,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.5,
  }), []);

  const goldDetail = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffd700",
    metalness: 1,
    roughness: 0.2,
  }), []);

  // Detailed Geometries
  const headGeo = useMemo(() => new THREE.SphereGeometry(0.28, 48, 48), []);
  const chestGeo = useMemo(() => new THREE.SphereGeometry(0.52, 48, 48), []);
  const limbGeo = (r1: number, r2: number, h: number) => new THREE.CylinderGeometry(r1, r2, h, 32);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Cinematic breathing
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.04 - 0.4;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.15, 0.05);

    // Expressive head tracking
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.6, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.3, 0.1);
    }

    // Dynamic Lens Shutter Effect (Tom Holland style)
    const eyeScaleY = hovered ? 0.3 : (0.85 + Math.sin(t * 2) * 0.02);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.15);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.15);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.9, 0.9, 0.9]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- HEAD --- */}
      <group ref={headRef} position={[0, 2.75, 0]}>
        <mesh castShadow geometry={headGeo} material={mcuRed} scale={[0.92, 1.12, 1.05]} />
        
        {/* Expressive Mechanical Lenses */}
        <group position={[0, 0.04, 0.23]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.13, 0.02, 0]} rotation={[0.08, side * -0.35, side * -0.05]}>
              <mesh material={techBlack}>
                <boxGeometry args={[0.2, 0.22, 0.06]} />
              </mesh>
              <mesh position={[0, 0, 0.02]} material={lensWhite}>
                <boxGeometry args={[0.16, 0.18, 0.02]} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Neck */}
        <mesh position={[0, -0.32, 0]} material={mcuRed}>
          <cylinderGeometry args={[0.13, 0.17, 0.35, 32]} />
        </mesh>
      </group>

      {/* --- TORSO --- */}
      <group position={[0, 1.7, 0]}>
        <mesh castShadow geometry={chestGeo} material={mcuRed} scale={[1.05, 1.15, 0.8]} />
        
        {/* Side Panels (Tech Blue) */}
        <group scale={[1.1, 1, 1.1]}>
          <mesh position={[0.42, -0.1, -0.1]} rotation={[0, 0.4, 0]} material={mcuBlue}>
            <boxGeometry args={[0.12, 1.2, 0.4]} />
          </mesh>
          <mesh position={[-0.42, -0.1, -0.1]} rotation={[0, -0.4, 0]} material={mcuBlue}>
            <boxGeometry args={[0.12, 1.2, 0.4]} />
          </mesh>
        </group>

        {/* Technical Belt */}
        <mesh position={[0, -0.65, 0]} material={techBlack}>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 32]} />
        </mesh>

        {/* Integrated Suit Spider Logo (Angular) */}
        <group position={[0, 0.15, 0.43]}>
          <mesh material={techBlack}>
            <boxGeometry args={[0.08, 0.12, 0.02]} />
          </mesh>
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, 0.7]} material={techBlack}>
                <boxGeometry args={[0.25, 0.015, 0.01]} />
              </mesh>
              <mesh position={[0.15, -0.1, 0]} rotation={[0, 0, -0.7]} material={techBlack}>
                <boxGeometry args={[0.25, 0.015, 0.01]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* --- ARMS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.6, 2.35, 0]}>
          {/* Shoulders */}
          <mesh material={mcuRed} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
          </mesh>
          {/* Biceps */}
          <mesh position={[side * 0.1, -0.35, 0]} rotation={[0, 0, side * -0.12]} material={mcuRed}>
            <cylinderGeometry args={[0.11, 0.09, 0.7, 32]} />
          </mesh>
          
          <group position={[side * 0.2, -0.7, 0]}>
            {/* Forearm */}
            <mesh position={[0, -0.4, 0]} material={mcuRed}>
              <cylinderGeometry args={[0.09, 0.07, 0.7, 32]} />
            </mesh>
            {/* Web Shooters (Technical Detail) */}
            <mesh position={[0, -0.6, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={techBlack}>
              <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            </mesh>
            {/* Hands */}
            <mesh position={[0, -0.85, 0]} material={mcuRed}>
              <sphereGeometry args={[0.1, 24, 24]} scale={[1, 1.3, 0.8]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.24, 0.8, 0]}>
          {/* Thighs */}
          <mesh position={[0, -0.5, 0]} material={mcuBlue}>
            <cylinderGeometry args={[0.19, 0.15, 1.1, 32]} />
          </mesh>
          
          <group position={[0, -1.05, 0]}>
            {/* Lower Leg / Boots */}
            <mesh position={[0, -0.5, 0]} material={mcuRed}>
              <cylinderGeometry args={[0.15, 0.1, 1.0, 32]} />
            </mesh>
            {/* Modern Sole Detail */}
            <group position={[0, -1.05, 0.1]}>
              <mesh material={mcuRed}>
                <boxGeometry args={[0.22, 0.18, 0.45]} />
              </mesh>
              <mesh position={[0, -0.09, 0]} material={techBlack}>
                <boxGeometry args={[0.24, 0.04, 0.48]} />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* Cinematic Rim Lighting */}
      <pointLight position={[2, 2, 2]} intensity={5} color="#ffffff" />
      <pointLight position={[-2, 1, 1]} intensity={2} color="#4477ff" />
    </group>
  );
};