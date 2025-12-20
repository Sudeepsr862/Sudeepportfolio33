import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { VideoEdits } from './components/VideoEdits';
import { Skills } from './components/Skills';
import { Portfolio } from './components/Portfolio';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/Scene/InteractiveBackground';
import { SwingingLight } from './components/Scene/SwingingLight';
import { ChatWidget } from './components/ChatWidget';
import { GameModal } from './components/SpiderGame';
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
      
      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <InteractiveBackground isLightOn={isLightOn} isBulbGlowing={isBulbGlowing} />
        </Canvas>
      </div>

      {/* Swinging Light Toggle Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 h-[550px] w-64 pointer-events-auto">
        <Canvas camera={{ position: [0, -1, 5], fov: 50 }} shadows>
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
        <section id="contact" className={`py-24 px-6 border-t ${isLightOn ? 'border-zinc-200' : 'border-white/5'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
            <p className="text-zinc-400 mb-12">I'm currently looking for new opportunities and collaborations.</p>
            <a 
              href="mailto:sudeepsr52@gmail.com"
              className="px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] inline-block"
            >
              Email Me
            </a>
          </div>
        </section>
        <Footer isLightOn={isLightOn} />
      </main>

      {/* AI Chat Widget */}
      <ChatWidget isLightOn={isLightOn} />
      
      {/* Game Modal */}
      <AnimatePresence>
        {isGameOpen && (
          <GameModal onClose={() => setIsGameOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;