
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { VideoEdits } from './components/VideoEdits';
import { Skills } from './components/Skills';
import { Portfolio } from './components/Portfolio';
import { VibeCoding } from './components/VibeCoding';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/Scene/InteractiveBackground';
import { SwingingLight } from './components/Scene/SwingingLight';
import { ChatWidget } from './components/ChatWidget';
import { GameModal } from './components/SpiderGame';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isBulbGlowing, setIsBulbGlowing] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const toggleLight = () => setIsBulbGlowing(!isBulbGlowing);

  // Reverting to the dynamic light state but defaulting to dark (isBulbGlowing = false)
  const isLightOn = isBulbGlowing;

  return (
    <div className={`relative min-h-screen selection:bg-red-500/20 overflow-x-hidden transition-colors duration-700 ${isLightOn ? 'bg-zinc-50 text-zinc-900' : 'bg-[#050505] text-white'}`}>
      {/* 3D Background Layer - Interactive Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <InteractiveBackground isLightOn={isLightOn} isBulbGlowing={isBulbGlowing} />
        </Canvas>
      </div>

      {/* Swinging Light Toggle Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 h-[550px] w-64 pointer-events-auto">
        <Canvas camera={{ position: [0, -1, 5], fov: 50 }} shadows>
          <SwingingLight isLightOn={isBulbGlowing} onToggle={toggleLight} />
        </Canvas>
      </div>

      {/* Light Mode CTA Hint - Positioned to the right of the bulb handle */}
      <div className="absolute top-[440px] left-1/2 ml-14 z-50 pointer-events-none hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: { delay: 2, duration: 1 }
          }}
          className="flex items-center gap-4"
        >
          <motion.div 
            animate={{ width: [30, 60, 30] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`h-[1px] ${isLightOn ? 'bg-zinc-300' : 'bg-red-600/60'}`} 
          />
          <div className="flex flex-col">
            <motion.span 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-[11px] font-mono uppercase tracking-[0.5em] font-black mb-1 transition-colors duration-500 ${isLightOn ? 'text-zinc-400' : 'text-red-500'}`}
            >
              {isLightOn ? 'LIGHT IS ON' : 'STAY BRIGHT'}
            </motion.span>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${isLightOn ? 'text-zinc-400/60' : 'text-zinc-600'}`}>
              {isLightOn ? 'Click to dim' : 'Click the bulb'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main UI Overlay */}
      <main className="relative z-10">
        <Hero isLightOn={isLightOn} onOpenGame={() => setIsGameOpen(true)} />
        <About isLightOn={isLightOn} />
        <VideoEdits isLightOn={isLightOn} />
        <Skills isLightOn={isLightOn} />
        <Portfolio isLightOn={isLightOn} />
        <VibeCoding isLightOn={isLightOn} />
        <Footer isLightOn={isLightOn} />
      </main>

      {/* Utilities */}
      <ChatWidget isLightOn={isLightOn} />
      
      <AnimatePresence>
        {isGameOpen && (
          <GameModal onClose={() => setIsGameOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
