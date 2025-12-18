
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Fix for JSX intrinsic element errors
const Points = 'points' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const PointsMaterial = 'pointsMaterial' as any;

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
    
    // Constant cosmic rotation
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.z = time * 0.005;

    // Fluid response to cursor
    const targetX = mouse.x * 1.2;
    const targetY = mouse.y * 1.2;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.015;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.015;

    // Dramatic material reaction to the bulb state
    if (pointsRef.current.material) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      
      // Calculate target opacity and color based on bulb state
      const targetOpacity = isBulbGlowing ? 0.9 : 0.35;
      const targetColor = isBulbGlowing 
        ? new THREE.Color("#ffaa33") // Warm Golden Glow
        : new THREE.Color("#00f3ff"); // Cyber Cyan

      // Smooth interpolation for "flash" effect
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity + Math.sin(time * 3) * 0.05, 0.05);
      mat.color.lerp(targetColor, 0.04);
      
      // Size reactive to "energy"
      mat.size = THREE.MathUtils.lerp(mat.size, isBulbGlowing ? 0.05 : 0.035, 0.05);
    }
  });

  return (
    <Points ref={pointsRef}>
      <BufferGeometry>
        <BufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </BufferGeometry>
      <PointsMaterial
        size={0.035}
        color="#00f3ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
};
