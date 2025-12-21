
import React, { useState, useEffect } from 'react';
// Added AnimatePresence to the imports from framer-motion
import { motion, useSpring, AnimatePresence } from 'framer-motion';

interface Props {
  isLightOn: boolean;
}

export const EyeDecoration: React.FC<Props> = ({ isLightOn }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-0.5 to 0.5 for subtle tracking)
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    
    // Random blink logic
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 4000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  // Spring-based smooth tracking for the iris
  const springConfig = { damping: 25, stiffness: 150 };
  const irisX = useSpring(0, springConfig);
  const irisY = useSpring(0, springConfig);

  useEffect(() => {
    irisX.set(mousePos.x * 8); // Subtle iris movement
    irisY.set(mousePos.y * 5);
  }, [mousePos, irisX, irisY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isLightOn ? 0.6 : 0.9,
        scale: 1,
      }}
      className="fixed top-6 right-6 z-[60] pointer-events-none select-none flex flex-col items-center gap-1"
    >
      <div className="relative w-24 h-16 flex items-center justify-center">
        {/* Sketch Model SVG */}
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eyebrow - Sketchy Path */}
          <path 
            d="M20 25C30 15 70 15 85 28" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="opacity-80"
          />
          <path 
            d="M25 22C35 15 65 15 80 25" 
            stroke="white" 
            strokeWidth="1" 
            strokeLinecap="round" 
            className="opacity-40"
          />

          {/* Eye Outline / Eyelids */}
          <motion.path 
            animate={{ d: isBlinking ? "M15 50C30 50 70 50 85 50" : "M15 50C30 35 70 35 85 50" }}
            d="M15 50C30 35 70 35 85 50" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <motion.path 
            animate={{ d: isBlinking ? "M15 50C30 50 70 50 85 50" : "M15 50C30 65 70 65 85 50" }}
            d="M15 50C30 65 70 65 85 50" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />

          {/* Iris and Pupil (Tracking) */}
          <AnimatePresence>
            {!isBlinking && (
              <motion.g 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ x: irisX, y: irisY }}
              >
                {/* Iris details */}
                <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="0.5" className="opacity-30" />
                <circle cx="50" cy="50" r="8" stroke="white" strokeWidth="1" />
                {/* Pupil */}
                <circle cx="50" cy="50" r="4" fill="white" />
                {/* Reflection catchlight */}
                <circle cx="48" cy="48" r="1.5" fill="white" className="opacity-80" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Red Text Branding */}
      <div className="flex items-center gap-1.5 -mt-2">
        <span className="text-[14px] font-black text-red-600 uppercase italic tracking-tighter drop-shadow-sm">Easy</span>
        <span className="text-[14px] font-black text-red-600 uppercase italic tracking-tighter drop-shadow-sm">EYE</span>
      </div>

      {/* Subtle background glow */}
      {!isLightOn && (
        <div className="absolute inset-0 bg-red-600/5 blur-2xl -z-10 rounded-full" />
      )}
    </motion.div>
  );
};
