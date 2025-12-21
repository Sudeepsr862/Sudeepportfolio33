
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  isLightOn: boolean;
}

export const EyeDecoration: React.FC<Props> = ({ isLightOn }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-1 to 1)
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    
    // Random blink logic
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  // Spring-based smooth tracking
  const springConfig = { damping: 30, stiffness: 200 };
  const tx = useSpring(0, springConfig);
  const ty = useSpring(0, springConfig);
  const rot = useSpring(0, springConfig);

  useEffect(() => {
    tx.set(mousePos.x * 15);
    ty.set(mousePos.y * 10);
    rot.set(mousePos.x * 5); // Slight rotation glare
  }, [mousePos, tx, ty, rot]);

  const eyeColor = isLightOn ? '#cc0000' : '#ff0000';
  const glowIntensity = isLightOn ? '0 0 5px rgba(204,0,0,0.5)' : '0 0 15px rgba(255,0,0,0.8), 0 0 30px rgba(255,0,0,0.4)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isLightOn ? 0.3 : 0.8,
        scale: 1,
      }}
      className="fixed top-8 right-8 z-[60] pointer-events-none select-none"
      style={{
        width: '120px',
        height: '40px',
      }}
    >
      <motion.div 
        style={{ x: tx, y: ty, rotate: rot }}
        className="relative w-full h-full flex items-center justify-between px-2"
      >
        {/* Left Eye Line */}
        <motion.div
          animate={{ scaleY: isBlinking ? 0.1 : 1 }}
          transition={{ duration: 0.1 }}
          className="relative"
        >
          <svg width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 5C15 2 35 8 40 20C30 15 10 12 5 20V5Z" 
              fill={eyeColor}
              style={{ filter: `drop-shadow(${glowIntensity})` }}
            />
            <path 
              d="M5 5C15 2 35 8 40 20" 
              stroke="white" 
              strokeWidth="0.5" 
              strokeOpacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Right Eye Line */}
        <motion.div
          animate={{ scaleY: isBlinking ? 0.1 : 1 }}
          transition={{ duration: 0.1 }}
          className="relative"
        >
          <svg width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M40 5C30 2 10 8 5 20C15 15 35 12 40 20V5Z" 
              fill={eyeColor}
              style={{ filter: `drop-shadow(${glowIntensity})` }}
            />
            <path 
              d="M40 5C30 2 10 8 5 20" 
              stroke="white" 
              strokeWidth="0.5" 
              strokeOpacity="0.3"
            />
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Decorative scanning flare */}
      {!isLightOn && (
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.4, 0.1],
            scaleX: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-red-600/5 blur-xl rounded-full"
        />
      )}
    </motion.div>
  );
};
