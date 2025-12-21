
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { VideoEdits } from './components/VideoEdits';
import { Skills } from './components/Skills';
import { Portfolio } from './components/Portfolio';
import { ComingSoon } from './components/ComingSoon';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/Scene/InteractiveBackground';
import { SwingingLight } from './components/Scene/SwingingLight';
import { ChatWidget } from './components/ChatWidget';
import { GameModal } from './components/SpiderGame';
import { EyeDecoration } from './components/EyeDecoration';
import { Guestbook } from './components/Guestbook';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isBulbGlowing, setIsBulbGlowing] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const toggleLight = () => {
    setIsBulbGlowing(!isBulbGlowing);
  };

  const isLightOn = isBulbGlowing;

  return (
    <div className={`relative min-h-screen selection:bg-red-500/20 overflow-x-hidden transition-colors duration-700 ${isLightOn ? 'bg-zinc-50 text-zinc-900' : 'bg-[#050505] text-white'}`}>
      
      {/* 3D Background Layer - Optimized DPR */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={1}
          gl={{ powerPreference: "low-power", antialias: false }}
        >
          <InteractiveBackground isLightOn={isLightOn} isBulbGlowing={isBulbGlowing} />
        </Canvas>
      </div>

      {/* Eye Decoration - Top Right Observer */}
      <EyeDecoration isLightOn={isLightOn} />

      {/* Swinging Light Toggle Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 h-[550px] w-64 pointer-events-auto">
        <Canvas 
          camera={{ position: [0, -1, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <SwingingLight isLightOn={isBulbGlowing} onToggle={toggleLight} />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero isLightOn={isLightOn} onOpenGame={() => setIsGameOpen(true)} />
        <About isLightOn={isLightOn} />
        <Skills isLightOn={isLightOn} />
        <Portfolio isLightOn={isLightOn} />
        <VideoEdits isLightOn={isLightOn} />
        <ComingSoon isLightOn={isLightOn} />
        
        <section id="contact" className={`py-24 px-6 border-t ${isLightOn ? 'border-zinc-200' : 'border-white/5'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
            <p className="text-zinc-400 mb-12 italic">Let's build something epic together.</p>
            <a 
              href="mailto:sudeepsr52@gmail.com"
              className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-500 transition-all shadow-2xl inline-block uppercase tracking-widest text-sm"
            >
              Send Signal 🕸️
            </a>
          </div>
        </section>

        {/* Guestbook / Comments Section */}
        <Guestbook isLightOn={isLightOn} />

        <Footer isLightOn={isLightOn} />
      </main>

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
