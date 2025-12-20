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
    color: "#a00000",
    metalness: 0.5,
    roughness: 0.4,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    sheen: 1,
    sheenColor: "#ff0000",
  }), []);

  const carbonFiberBlack = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#080808",
    metalness: 0.9,
    roughness: 0.5,
    clearcoat: 0.3,
  }), []);

  const highGlossGold = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#d4af37",
    metalness: 1.0,
    roughness: 0.1,
    emissive: "#aa8800",
    emissiveIntensity: 0.1,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 2.0,
  }), []);

  // Optimized Geometries for Human Silhouette
  const headGeo = useMemo(() => new THREE.SphereGeometry(0.28, 32, 32), []);
  const chestGeo = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);
  const upperArmGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.08, 0.7, 16), []);
  const forearmGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.06, 0.7, 16), []);
  const thighGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.14, 1.1, 16), []);
  const calfGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.09, 1.0, 16), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural human-like swaying/floating
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.06 - 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.3, 0.05);

    // Dynamic Head Tracking
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.6, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.4, 0.1);
    }

    // Interactive Mask Lenses (Mechanical Shutter Effect)
    const eyeScaleY = hovered ? 0.5 : (0.9 + Math.sin(t * 4) * 0.02);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.15);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.15);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.8, 0.8, 0.8]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- HEAD --- */}
      <group ref={headRef} position={[0, 2.6, 0]}>
        {/* Mask Base */}
        <mesh castShadow geometry={headGeo} material={metallicRed} scale={[0.95, 1.15, 1.05]} />
        
        {/* Expressive Lenses */}
        <group position={[0, 0.05, 0.22]}>
          <group ref={leftEyeRef} position={[-0.13, 0.02, 0]} rotation={[0.1, 0.4, 0.1]}>
            <mesh>
              <boxGeometry args={[0.18, 0.22, 0.05]} />
              <meshStandardMaterial color="#000000" roughness={0} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.15, 0.19, 0.01]} />
              <primitive object={lensWhite} attach="material" />
            </mesh>
          </group>
          <group ref={rightEyeRef} position={[0.13, 0.02, 0]} rotation={[0.1, -0.4, -0.1]}>
            <mesh>
              <boxGeometry args={[0.18, 0.22, 0.05]} />
              <meshStandardMaterial color="#000000" roughness={0} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.15, 0.19, 0.01]} />
              <primitive object={lensWhite} attach="material" />
            </mesh>
          </group>
        </group>
        
        {/* Neck Integration */}
        <mesh position={[0, -0.25, 0]} material={metallicRed}>
          <cylinderGeometry args={[0.12, 0.16, 0.3, 16]} />
        </mesh>
      </group>

      {/* --- UPPER BODY (Torso) --- */}
      <group position={[0, 1.6, 0]}>
        {/* Muscular Chest */}
        <mesh castShadow geometry={chestGeo} material={metallicRed} scale={[1, 1.2, 0.75]} />
        
        {/* Athletic Waist */}
        <mesh position={[0, -0.45, 0]} castShadow material={carbonFiberBlack}>
          <cylinderGeometry args={[0.35, 0.28, 0.9, 16]} />
        </mesh>

        {/* Integrated Gold Spider Logo */}
        <group position={[0, 0.15, 0.38]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={highGlossGold}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 6]} />
          </mesh>
          {/* Detailed Spider Legs */}
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.2, 0.25, 0]} rotation={[0, 0, 1]} material={highGlossGold}>
                <boxGeometry args={[0.4, 0.03, 0.02]} />
              </mesh>
              <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, -0.8]} material={highGlossGold}>
                <boxGeometry args={[0.4, 0.03, 0.02]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Suit Panels (Sides) */}
        <mesh position={[0.38, -0.1, 0]} rotation={[0, 0.3, 0]} material={carbonFiberBlack}>
          <boxGeometry args={[0.1, 1, 0.35]} />
        </mesh>
        <mesh position={[-0.38, -0.1, 0]} rotation={[0, -0.3, 0]} material={carbonFiberBlack}>
          <boxGeometry args={[0.1, 1, 0.35]} />
        </mesh>
      </group>

      {/* --- ARMS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.52, 2.2, 0]}>
          {/* Shoulder Musculature */}
          <mesh material={metallicRed} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>
          {/* Bicep/Upper Arm */}
          <mesh position={[side * 0.1, -0.3, 0]} rotation={[0, 0, side * -0.1]} geometry={upperArmGeo} material={metallicRed} />
          {/* Forearm & Hand */}
          <group position={[side * 0.15, -0.65, 0]}>
            <mesh position={[0, -0.35, 0]} geometry={forearmGeo} material={metallicRed} />
            {/* Clenched Fist */}
            <mesh position={[0, -0.75, 0]} material={metallicRed}>
              <sphereGeometry args={[0.09, 12, 12]} scale={[1, 1.2, 0.9]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- LEGS --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 0.7, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.5, 0]} geometry={thighGeo} material={carbonFiberBlack} />
          {/* Calf & Boot */}
          <group position={[0, -1.0, 0]}>
            {/* Knee Pad Area */}
            <mesh material={metallicRed}>
              <sphereGeometry args={[0.12, 12, 12]} />
            </mesh>
            <mesh position={[0, -0.5, 0]} geometry={calfGeo} material={metallicRed} />
            {/* Detailed Hero Boot */}
            <group position={[0, -1.0, 0.1]}>
              <mesh material={metallicRed}>
                <boxGeometry args={[0.18, 0.14, 0.42]} />
              </mesh>
              <mesh position={[0, -0.06, 0]} material={carbonFiberBlack}>
                <boxGeometry args={[0.2, 0.05, 0.45]} />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* Cinematic Highlight Lamp */}
      <pointLight position={[0, 1.8, 1.2]} intensity={2.5} color="#ffffff" distance={6} decay={2} />
    </group>
  );
};