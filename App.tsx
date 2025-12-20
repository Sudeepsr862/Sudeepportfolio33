
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