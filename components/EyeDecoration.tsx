
import React, { useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

interface Props {
  isLightOn: boolean;
}

export const EyeDecoration: React.FC<Props> = ({ isLightOn }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-0.5 to 0.5)
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    
    // Realistic variable blink interval
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
      const nextBlink = Math.random() * 4000 + 2000;
      blinkTimeout = setTimeout(triggerBlink, nextBlink);
    };

    triggerBlink();
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(blinkTimeout);
    };
  }, []);

  // Smooth iris movement
  const springConfig = { damping: 30, stiffness: 200 };
  const irisX = useSpring(0, springConfig);
  const irisY = useSpring(0, springConfig);

  useEffect(() => {
    irisX.set(mousePos.x * 12); 
    irisY.set(mousePos.y * 8);
  }, [mousePos, irisX, irisY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isLightOn ? 0.5 : 0.8,
        scale: 1,
      }}
      className="fixed top-8 right-8 z-[60] pointer-events-none select-none flex flex-col items-center"
    >
      <div className="relative w-32 h-24 flex items-center justify-center">
        {/* High Detail Realistic Sketch SVG */}
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Detailed Eyebrow - Multiple hair strokes for realism */}
          <g className="opacity-70">
            <path d="M20 28C35 15 75 15 95 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M22 26C38 14 72 14 92 30" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
            <path d="M18 30C32 18 70 18 90 34" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
            {/* Fine hair details */}
            <path d="M25 24 L28 20" stroke="white" strokeWidth="0.3" />
            <path d="M35 20 L38 16" stroke="white" strokeWidth="0.3" />
            <path d="M45 18 L48 14" stroke="white" strokeWidth="0.3" />
            <path d="M55 18 L58 14" stroke="white" strokeWidth="0.3" />
            <path d="M65 19 L68 15" stroke="white" strokeWidth="0.3" />
            <path d="M75 22 L78 18" stroke="white" strokeWidth="0.3" />
          </g>

          {/* Upper Eyelid Crease */}
          <motion.path 
            animate={{ opacity: isBlinking ? 0 : 0.4 }}
            d="M25 45C40 35 80 35 95 45" 
            stroke="white" 
            strokeWidth="0.8" 
            strokeLinecap="round"
          />

          {/* Main Eye Outline */}
          <motion.path 
            animate={{ d: isBlinking ? "M20 60C40 60 80 60 100 60" : "M20 60C40 42 80 42 100 60" }}
            d="M20 60C40 42 80 42 100 60" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <motion.path 
            animate={{ d: isBlinking ? "M20 60C40 60 80 60 100 60" : "M20 60C40 78 80 78 100 60" }}
            d="M20 60C40 78 80 78 100 60" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />

          {/* Inner Corner (Lacrimal caruncle) detail */}
          <path d="M18 60C19 58 21 58 22 60" stroke="white" strokeWidth="0.5" opacity="0.5" />

          {/* Iris and Pupil (Interactive Tracking) */}
          <AnimatePresence>
            {!isBlinking && (
              <motion.g 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ x: irisX, y: irisY }}
              >
                {/* Iris Outer Border */}
                <circle cx="60" cy="60" r="14" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <circle cx="60" cy="60" r="12" stroke="white" strokeWidth="1.2" />
                
                {/* Iris Shading / Radial Lines */}
                <g opacity="0.4">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                    <line 
                      key={deg}
                      x1="60" y1="60" 
                      x2={60 + Math.cos(deg * Math.PI / 180) * 11} 
                      y2={60 + Math.sin(deg * Math.PI / 180) * 11} 
                      stroke="white" strokeWidth="0.3" 
                    />
                  ))}
                </g>

                {/* Pupil */}
                <circle cx="60" cy="60" r="5" fill="white" />
                
                {/* Realistic Reflections (Catchlights) */}
                <circle cx="57" cy="57" r="2.5" fill="white" opacity="0.9" />
                <circle cx="64" cy="64" r="1" fill="white" opacity="0.4" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Eyelashes (Bottom subtle) */}
          <g opacity="0.3">
            <path d="M35 76 L34 80" stroke="white" strokeWidth="0.3" />
            <path d="M45 78 L44 82" stroke="white" strokeWidth="0.3" />
            <path d="M55 78 L55 83" stroke="white" strokeWidth="0.3" />
            <path d="M65 78 L66 82" stroke="white" strokeWidth="0.3" />
            <path d="M75 76 L77 80" stroke="white" strokeWidth="0.3" />
          </g>
        </svg>

        {/* Realistic Glow underneath */}
        {!isLightOn && (
          <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full scale-150" />
        )}
      </div>
    </motion.div>
  );
};
