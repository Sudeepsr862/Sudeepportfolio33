
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

  // Reduced count for better performance on mid-range devices
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth slow rotation
    pointsRef.current.rotation.y = time * 0.015;

    // Follow mouse with damping
    const targetX = mouse.x * 0.8;
    const targetY = mouse.y * 0.8;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.01;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.01;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (mat) {
      const targetOpacity = isBulbGlowing ? 0.7 : 0.25;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
      mat.size = THREE.MathUtils.lerp(mat.size, isBulbGlowing ? 0.04 : 0.025, 0.05);
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
        size={0.025}
        color={isBulbGlowing ? "#ffcc33" : "#00f3ff"}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
