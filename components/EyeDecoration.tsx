
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  isLightOn: boolean;
}

export const EyeDecoration: React.FC<Props> = ({ isLightOn }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-1 to 1)
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spring-based smooth tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const tx = useSpring(0, springConfig);
  const ty = useSpring(0, springConfig);

  useEffect(() => {
    tx.set(mousePos.x * 10); // Subtle 10px movement
    ty.set(mousePos.y * 10);
  }, [mousePos, tx, ty]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isLightOn ? 0.4 : 0.7, 
        scale: 1,
        filter: isLightOn ? 'grayscale(0.5) contrast(1.2)' : 'grayscale(0.2) contrast(1.5) brightness(0.8)'
      }}
      className="fixed top-6 right-6 z-[60] pointer-events-none select-none"
      style={{
        width: '100px',
        height: '80px',
      }}
    >
      <div 
        className="relative w-full h-full overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 75%)',
          mixBlendMode: isLightOn ? 'multiply' : 'screen',
        }}
      >
        <motion.img
          style={{ x: tx, y: ty }}
          src="https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?q=80&w=400&h=300&auto=format&fit=crop"
          alt="The Observer"
          className="w-full h-full object-cover scale-125"
        />
        
        {/* Subtle iris glow for dark mode */}
        {!isLightOn && (
          <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse" />
        )}
      </div>
      
      {/* Decorative scanning line (very subtle) */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={`absolute left-0 right-0 h-[1px] ${isLightOn ? 'bg-zinc-300' : 'bg-red-500/30'} opacity-20`}
      />
    </motion.div>
  );
};
