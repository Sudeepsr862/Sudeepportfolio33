
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BMWModel: React.FC<{ hovered?: boolean }> = ({ hovered = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  
  // Materials
  const paintMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#111",
    metalness: 1,
    roughness: 0,
    transparent: true,
    opacity: 0.6,
    transmission: 0.5,
  }), []);

  const blueLineMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0088ff",
    emissive: "#0088ff",
    emissiveIntensity: 2,
  }), []);

  const ledMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 5,
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111",
    metalness: 0.8,
    roughness: 0.4,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle floating
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;

    // Rotate wheels
    const wheelSpeed = hovered ? 15 : 5;
    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += wheelSpeed * 0.01;
    });

    // Auto-rotation when not interacting
    if (!hovered) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.2, 0.05);
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 1.5, 0.1);
    }
  });

  const addToWheels = (el: THREE.Group | null) => {
    if (el && !wheelsRef.current.includes(el)) wheelsRef.current.push(el);
  };

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[0, -0.5, 0]}>
      {/* --- Main Chassis --- */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.5, 4]} />
        <primitive object={paintMaterial} attach="material" />
      </mesh>

      {/* --- Cabin (Greenhouse) --- */}
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.5, 1.8]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* --- Hood & Trunk Slope --- */}
      <mesh position={[0, 0.55, 1.2]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.58, 0.3, 1.6]} />
        <primitive object={paintMaterial} attach="material" />
      </mesh>

      {/* --- BMW Kidney Grille --- */}
      <group position={[0, 0.4, 1.95]}>
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.35, 0.1]} />
          <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.35, 0.1]} />
          <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
        </mesh>
      </group>

      {/* --- LED Angel Eye Headlights --- */}
      <group position={[0, 0.5, 1.9]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.6, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.1, 0.02, 16, 32]} />
              <primitive object={ledMaterial} attach="material" />
            </mesh>
            <mesh position={[side * 0.12, 0, 0]}>
              <torusGeometry args={[0.08, 0.02, 16, 32]} />
              <primitive object={ledMaterial} attach="material" />
            </mesh>
            <pointLight intensity={2} distance={2} color="#ffffff" />
          </group>
        ))}
      </group>

      {/* --- Neon Blue Performance Lines --- */}
      <mesh position={[0.81, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.05, 3.8]} />
        <primitive object={blueLineMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.81, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.05, 3.8]} />
        <primitive object={blueLineMaterial} attach="material" />
      </mesh>
      {/* Hood Accent */}
      <mesh position={[0, 0.66, 1.2]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.04, 0.02, 1.4]} />
        <primitive object={blueLineMaterial} attach="material" />
      </mesh>

      {/* --- Rotating Wheels --- */}
      {[
        { pos: [0.85, 0.25, 1.3] },  // Front Right
        { pos: [-0.85, 0.25, 1.3] }, // Front Left
        { pos: [0.85, 0.25, -1.3] }, // Rear Right
        { pos: [-0.85, 0.25, -1.3] } // Rear Left
      ].map((wheel, i) => (
        <group key={i} position={wheel.pos as any} ref={addToWheels}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 24]} />
            <primitive object={wheelMaterial} attach="material" />
          </mesh>
          {/* Rim Detail */}
          <mesh position={[wheel.pos[0] > 0 ? 0.16 : -0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.22, 0.02, 8, 24]} />
            <meshStandardMaterial color="#555" metalness={1} roughness={0} />
          </mesh>
          {/* Blue Brake Caliper Detail */}
          <mesh position={[wheel.pos[0] > 0 ? 0.1 : -0.1, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.15]} />
            <meshStandardMaterial color="#0088ff" />
          </mesh>
        </group>
      ))}

      {/* --- Tail Lights --- */}
      <group position={[0, 0.5, -1.95]}>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.6, 0, 0]}>
            <boxGeometry args={[0.35, 0.12, 0.05]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} />
          </mesh>
        ))}
      </group>

      {/* Ground Reflection Highlight (Subtle) */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 4.5]} />
        <meshBasicMaterial color="#0088ff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
};
