
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BMWModel: React.FC<{ hovered?: boolean }> = ({ hovered = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const reflectionRef = useRef<THREE.Group>(null);
  const headlightsRef = useRef<THREE.Group>(null);
  
  // High-performance Premium Materials
  const paintMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050505",
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1,
    envMapIntensity: 2
  }), []);

  const carbonFiberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111",
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050505",
    metalness: 1,
    roughness: 0,
    transparent: true,
    opacity: 0.7,
    transmission: 0.6,
    thickness: 1,
    ior: 1.5,
  }), []);

  const blueLineMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00a2ff",
    emissive: "#00a2ff",
    emissiveIntensity: 4,
  }), []);

  const ledMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 8,
  }), []);

  const taillightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#aa0000",
    emissive: "#ff0000",
    emissiveIntensity: 5,
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    metalness: 0.9,
    roughness: 0.3,
  }), []);

  const exhaustMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#777",
    metalness: 1,
    roughness: 0.1,
  }), []);

  const glintMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mx = state.mouse.x;
    const my = state.mouse.y;

    // 1. Subtle Floating & Idle Vibration
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 6) * 0.003; 

    // 2. Wheel Dynamics
    const wheelSpeed = hovered ? 22 : 8;
    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += wheelSpeed * 0.01;
    });

    // 3. Rotation Logic (Lerp for high-end feel)
    if (!hovered) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.25, 0.05);
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 1.5, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.15, 0.1);
    }

    // 4. Parallax Reflection Layer (Simulating Clearcoat depth)
    if (reflectionRef.current) {
      reflectionRef.current.position.x = THREE.MathUtils.lerp(reflectionRef.current.position.x, -mx * 0.3, 0.05);
      reflectionRef.current.position.z = THREE.MathUtils.lerp(reflectionRef.current.position.z, my * 0.3, 0.05);
    }

    // 5. Headlight Flickering Glint
    if (headlightsRef.current) {
      const pulse = 6 + Math.sin(t * 12) * (hovered ? 4 : 1);
      headlightsRef.current.children.forEach((child: any) => {
        if (child.material) child.material.emissiveIntensity = pulse;
      });
    }
  });

  const addToWheels = (el: THREE.Group | null) => {
    if (el && !wheelsRef.current.includes(el)) wheelsRef.current.push(el);
  };

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[0, -0.4, 0]}>
      {/* --- Main Body Chassis --- */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={paintMaterial}>
        <boxGeometry args={[1.65, 0.55, 4.1]} />
      </mesh>

      {/* --- Greenhouse (Windows & Roof) --- */}
      <mesh position={[0, 0.9, -0.2]} castShadow material={glassMaterial}>
        <boxGeometry args={[1.45, 0.45, 2]} />
      </mesh>
      <mesh position={[0, 1.15, -0.2]} material={carbonFiberMaterial}>
        <boxGeometry args={[1.4, 0.05, 1.9]} />
      </mesh>

      {/* --- Detailed Hood --- */}
      <mesh position={[0, 0.6, 1.2]} rotation={[-0.18, 0, 0]} material={paintMaterial}>
        <boxGeometry args={[1.6, 0.3, 1.65]} />
      </mesh>

      {/* --- Kidney Grille Assembly --- */}
      <group position={[0, 0.42, 2.02]}>
        {[-1, 1].map(side => (
          <mesh key={side} position={[side * 0.22, 0, 0]}>
            <boxGeometry args={[0.35, 0.38, 0.08]} />
            <meshStandardMaterial color="#000" metalness={1} roughness={0} />
          </mesh>
        ))}
      </group>

      {/* --- Side Mirrors --- */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * 0.88, 0.85, 0.6]} rotation={[0, side * 0.2, 0]} material={paintMaterial}>
          <boxGeometry args={[0.2, 0.1, 0.1]} />
        </mesh>
      ))}

      {/* --- Rear Spoiler --- */}
      <mesh position={[0, 0.78, -1.85]} rotation={[0.1, 0, 0]} material={carbonFiberMaterial}>
        <boxGeometry args={[1.55, 0.05, 0.3]} />
      </mesh>

      {/* --- Quad Exhaust Setup --- */}
      <group position={[0, 0.15, -2.05]}>
        {[-1, 1].map(side => (
          <group key={side} position={[side * 0.45, 0, 0]}>
            <mesh position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={exhaustMaterial}>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={exhaustMaterial}>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Dynamic Glint Parallax Reflection --- */}
      <group ref={reflectionRef} position={[0, 0.7, 0.8]}>
        <mesh rotation={[-0.1, 0, 0]} material={glintMaterial}>
          <planeGeometry args={[1.4, 0.04]} />
        </mesh>
        <mesh position={[0, 0.05, -0.4]} rotation={[-0.1, 0, 0]} material={glintMaterial}>
          <planeGeometry args={[1.0, 0.02]} />
        </mesh>
      </group>

      {/* --- Advanced LED Headlights (Angel Eyes) --- */}
      <group position={[0, 0.52, 1.95]} ref={headlightsRef}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.62, 0, 0]}>
            {/* Outer Ring */}
            <mesh rotation={[0, side * -0.1, 0]}>
              <torusGeometry args={[0.11, 0.015, 12, 32]} />
              <primitive object={ledMaterial.clone()} attach="material" />
            </mesh>
            {/* Inner Ring */}
            <mesh position={[side * 0.13, 0, 0]} rotation={[0, side * -0.2, 0]}>
              <torusGeometry args={[0.09, 0.015, 12, 32]} />
              <primitive object={ledMaterial.clone()} attach="material" />
            </mesh>
            <pointLight intensity={hovered ? 8 : 3} distance={4} color="#ffffff" />
          </group>
        ))}
      </group>

      {/* --- Taillights --- */}
      <group position={[0, 0.55, -2.02]}>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.65, 0, 0]} material={taillightMaterial}>
            <boxGeometry args={[0.4, 0.15, 0.05]} />
          </mesh>
        ))}
      </group>

      {/* --- Neon Blue Performance Accents --- */}
      <group>
        {/* Side Skirts */}
        <mesh position={[0.83, 0.2, 0]} material={blueLineMaterial}>
          <boxGeometry args={[0.03, 0.03, 3.9]} />
        </mesh>
        <mesh position={[-0.83, 0.2, 0]} material={blueLineMaterial}>
          <boxGeometry args={[0.03, 0.03, 3.9]} />
        </mesh>
        {/* Front Lip */}
        <mesh position={[0, 0.15, 2.0]} material={blueLineMaterial}>
          <boxGeometry args={[1.5, 0.03, 0.03]} />
        </mesh>
        {/* Rear Diffuser Trace */}
        <mesh position={[0, 0.15, -2.0]} material={blueLineMaterial}>
          <boxGeometry args={[1.5, 0.03, 0.03]} />
        </mesh>
        {/* Hood Line */}
        <mesh position={[0, 0.72, 1.2]} rotation={[-0.18, 0, 0]} material={blueLineMaterial}>
          <boxGeometry args={[0.03, 0.02, 1.4]} />
        </mesh>
      </group>

      {/* --- Performance Wheels --- */}
      {[
        { pos: [0.85, 0.3, 1.3] },
        { pos: [-0.85, 0.3, 1.3] },
        { pos: [0.85, 0.3, -1.3] },
        { pos: [-0.85, 0.3, -1.3] }
      ].map((wheel, i) => (
        <group key={i} position={wheel.pos as any} ref={addToWheels}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={wheelMaterial}>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 32]} />
          </mesh>
          {/* Rim Outer Lip */}
          <mesh position={[wheel.pos[0] > 0 ? 0.17 : -0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.26, 0.015, 12, 32]} />
            <meshStandardMaterial color="#888" metalness={1} roughness={0.1} />
          </mesh>
          {/* Brake Caliper (M-Performance Blue) */}
          <mesh position={[wheel.pos[0] > 0 ? 0.12 : -0.12, 0.18, 0]} material={blueLineMaterial}>
            <boxGeometry args={[0.06, 0.12, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* --- Ambient Bottom Glow --- */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 5]} />
        <meshBasicMaterial color="#0088ff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
};
