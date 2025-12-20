
import React, { useState, Suspense, useRef, useEffect } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [isBulbGlowing, setIsBulbGlowing] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleLight = () => {
    setIsBulbGlowing(!isBulbGlowing);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    // Play on first interaction if not already playing (handles browser policy)
    if (!hasInteracted) {
      audioRef.current.play().catch(e => console.log("Playback blocked:", e));
      setHasInteracted(true);
    }

    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // Ensure playback resumes if unmuting
    if (!newMutedState) {
        audioRef.current.play().catch(e => console.log("Play error:", e));
    }
  };

  const isLightOn = isBulbGlowing;

  return (
    <div className={`relative min-h-screen selection:bg-red-500/20 overflow-x-hidden transition-colors duration-700 ${isLightOn ? 'bg-zinc-50 text-zinc-900' : 'bg-[#050505] text-white'}`}>
      
      {/* Background Audio (Sunflower - Spider-Man: Into the Spider-Verse) */}
      <audio 
        ref={audioRef}
        src="https://www.myinstants.com/media/sounds/post-malone-swae-lee-sunflower-spider-man-into-the-spider-verse.mp3" 
        loop 
        muted={isMuted}
      />

      {/* Music Toggle Button (Top Left Corner) */}
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={toggleMusic}
        className={`fixed top-6 left-6 z-[100] p-4 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl backdrop-blur-md group ${
          isLightOn 
            ? 'bg-white/80 border-zinc-200 text-zinc-900 shadow-zinc-200/50' 
            : 'bg-black/40 border-white/10 text-white shadow-black/50'
        } ${!isMuted ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-transparent' : ''}`}
      >
        <div className="relative">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-red-500" />}
          {!isMuted && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        <div className={`ml-3 overflow-hidden transition-all duration-500 flex items-center ${!isMuted ? 'w-36' : 'w-0'}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap italic">
            SUNFLOWER 🌻 <span className="text-red-600">🕸️</span>
          </span>
        </div>
        
        {/* Hover Tooltip */}
        {isMuted && (
          <div className="absolute left-full ml-4 px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Unmute the vibe
          </div>
        )}
      </motion.button>
      
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
        <ComingSoon isLightOn={isLightOn} />
        
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
