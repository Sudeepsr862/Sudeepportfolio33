import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  isLightOn: boolean;
  isBulbGlowing?: boolean;
}

export const InteractiveBackground: React.FC<Props> = ({ isLightOn, isBulbGlowing = false }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const count = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.z = time * 0.005;

    const targetX = mouse.x * 1.2;
    const targetY = mouse.y * 1.2;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.015;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.015;

    if (pointsRef.current.material) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      const targetOpacity = isBulbGlowing ? 0.9 : 0.35;
      const targetColor = isBulbGlowing 
        ? new THREE.Color("#ffaa33") 
        : new THREE.Color("#00f3ff");

      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity + Math.sin(time * 3) * 0.05, 0.05);
      mat.color.lerp(targetColor, 0.04);
      mat.size = THREE.MathUtils.lerp(mat.size, isBulbGlowing ? 0.05 : 0.035, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00f3ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};