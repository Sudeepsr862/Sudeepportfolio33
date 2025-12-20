import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiderManCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Materials for the "Classic Suit" (Red & Blue)
  const classicRed = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#d00000",
    metalness: 0.1,
    roughness: 0.6,
    sheen: 1,
    sheenColor: "#ff4444",
    clearcoat: 0.2,
  }), []);

  const classicBlue = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0033aa",
    metalness: 0.2,
    roughness: 0.5,
    sheen: 0.5,
    sheenColor: "#0066ff",
  }), []);

  const spiderBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#050505",
    roughness: 0.2,
  }), []);

  const lensWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 1.2,
  }), []);

  const lensBorder = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#000000",
    roughness: 0,
  }), []);

  // Optimized Anatomical Geometries
  const headGeo = useMemo(() => new THREE.SphereGeometry(0.28, 32, 32), []);
  const chestGeo = useMemo(() => new THREE.SphereGeometry(0.52, 32, 32), []);
  const upperArmGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.08, 0.7, 16), []);
  const forearmGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.06, 0.7, 16), []);
  const thighGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.14, 1.1, 16), []);
  const calfGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.09, 1.0, 16), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural human breathing and floating
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.25, 0.05);

    // Head tracking the cursor
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.7, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.mouse.y * 0.4, 0.1);
    }

    // Mechanical/Expressive Lens effect
    const eyeScaleY = hovered ? 0.45 : (0.9 + Math.sin(t * 3) * 0.03);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.1);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.1);
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={[0.85, 0.85, 0.85]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- HEAD (Classic Mask) --- */}
      <group ref={headRef} position={[0, 2.7, 0]}>
        <mesh castShadow geometry={headGeo} material={classicRed} scale={[0.95, 1.15, 1.05]} />
        
        {/* Iconic White Lenses */}
        <group position={[0, 0.05, 0.22]}>
          {[1, -1].map(side => (
            <group key={side} ref={side === 1 ? rightEyeRef : leftEyeRef} position={[side * 0.14, 0.02, 0]} rotation={[0.1, side * -0.4, side * -0.1]}>
              <mesh material={lensBorder}>
                <boxGeometry args={[0.2, 0.24, 0.05]} />
              </mesh>
              <mesh position={[0, 0, 0.02]} material={lensWhite}>
                <boxGeometry args={[0.16, 0.2, 0.02]} />
              </mesh>
            </group>
          ))}
        </group>
        
        <mesh position={[0, -0.3, 0]} material={classicRed}>
          <cylinderGeometry args={[0.12, 0.16, 0.4, 16]} />
        </mesh>
      </group>

      {/* --- TORSO (Athletic Humanoid) --- */}
      <group position={[0, 1.6, 0]}>
        {/* Red Chest & Back Panels */}
        <mesh castShadow geometry={chestGeo} material={classicRed} scale={[1.05, 1.15, 0.8]} />
        
        {/* Blue Side Panels */}
        <group scale={[1.1, 1, 1.1]}>
          <mesh position={[0.4, -0.1, 0]} rotation={[0, 0.3, 0]} material={classicBlue}>
            <boxGeometry args={[0.15, 1.2, 0.45]} />
          </mesh>
          <mesh position={[-0.4, -0.1, 0]} rotation={[0, -0.3, 0]} material={classicBlue}>
            <boxGeometry args={[0.15, 1.2, 0.45]} />
          </mesh>
        </group>

        {/* Blue Waist/Abdomen Area */}
        <mesh position={[0, -0.5, 0]} castShadow material={classicBlue}>
          <cylinderGeometry args={[0.38, 0.32, 1.0, 16]} />
        </mesh>

        {/* Small Classic Black Spider Logo */}
        <group position={[0, 0.2, 0.42]}>
          <mesh material={spiderBlack}>
            <sphereGeometry args={[0.045]} scale={[1, 1.5, 0.2]} />
          </mesh>
          {/* Detailed Spider Legs */}
          {[1, -1].map(side => (
            <group key={side} scale={[side, 1, 1]}>
              <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, 0.8]} material={spiderBlack}>
                <boxGeometry args={[0.15, 0.02, 0.01]} />
              </mesh>
              <mesh position={[0.1, -0.1, 0]} rotation={[0, 0, -0.8]} material={spiderBlack}>
                <boxGeometry args={[0.15, 0.02, 0.01]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* --- ARMS (Human Musculature) --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.58, 2.3, 0]}>
          <mesh material={classicRed} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>
          {/* Upper Arm (Red top, Blue bottom) */}
          <mesh position={[side * 0.12, -0.35, 0]} rotation={[0, 0, side * -0.1]} geometry={upperArmGeo} material={classicRed} />
          
          <group position={[side * 0.2, -0.7, 0]}>
            <mesh position={[0, -0.4, 0]} geometry={forearmGeo} material={classicRed} />
            {/* Red Gloves */}
            <mesh position={[0, -0.8, 0]} material={classicRed}>
              <sphereGeometry args={[0.1, 12, 12]} scale={[1, 1.2, 1]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- LEGS (Classic Blue Thighs, Red Boots) --- */}
      {[1, -1].map(side => (
        <group key={side} position={[side * 0.22, 0.7, 0]}>
          {/* Blue Thighs */}
          <mesh position={[0, -0.55, 0]} geometry={thighGeo} material={classicBlue} />
          
          <group position={[0, -1.1, 0]}>
            {/* Red Boots (Mid-calf) */}
            <mesh position={[0, -0.5, 0]} geometry={calfGeo} material={classicRed} />
            <group position={[0, -1.05, 0.15]}>
              <mesh material={classicRed}>
                <boxGeometry args={[0.2, 0.18, 0.45]} />
              </mesh>
              {/* Black Sole */}
              <mesh position={[0, -0.08, 0]} material={spiderBlack}>
                <boxGeometry args={[0.22, 0.04, 0.48]} />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* Hero Accent Lighting */}
      <pointLight position={[0, 1.5, 1]} intensity={2} color="#ffffff" distance={5} />
    </group>
  );
};