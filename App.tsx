
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

  // forceDark ensures the UI never switches to a "light theme" 
  // keeping the "Vibe Coder" futuristic dark aesthetic constant.
  const forceDark = false;

  return (
    <div className="relative bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 3D Background Layer - Reacts to isBulbGlowing */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <InteractiveBackground isLightOn={forceDark} isBulbGlowing={isBulbGlowing} />
        </Canvas>
      </div>

      {/* Swinging Light Toggle Layer - Now Absolute so it disappears on scroll */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 h-[550px] w-64 pointer-events-auto">
        <Canvas camera={{ position: [0, -1, 5], fov: 50 }} shadows>
          <SwingingLight isLightOn={isBulbGlowing} onToggle={toggleLight} />
        </Canvas>
      </div>

      {/* Main UI Overlay - Sections remain dark */}
      <main className="relative z-10">
        <Hero isLightOn={forceDark} onOpenGame={() => setIsGameOpen(true)} />
        <About isLightOn={forceDark} />
        <VideoEdits isLightOn={forceDark} />
        <Skills isLightOn={forceDark} />
        <Portfolio isLightOn={forceDark} />
        <VibeCoding isLightOn={forceDark} />
        <Footer isLightOn={forceDark} />
      </main>

      {/* Utilities */}
      <ChatWidget isLightOn={forceDark} />
      
      <AnimatePresence>
        {isGameOpen && (
          <GameModal onClose={() => setIsGameOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
