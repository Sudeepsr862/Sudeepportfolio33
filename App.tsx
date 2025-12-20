import React, { useState, useEffect, useRef, Suspense } from 'react';
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
import { Volume2, VolumeX, Music, Disc, Zap, ArrowRight, PlayCircle, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isBulbGlowing, setIsBulbGlowing] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const sfxSwitch = useRef<HTMLAudioElement | null>(null);
  const sfxHum = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // High-bandwidth, stable CDN for audio
    const audio = new Audio('https://ia601402.us.archive.org/32/items/sunflower-instrumental-spider-man-into-the-spider-verse/Sunflower%20%28Instrumental%29%20Spider-Man%20Into%20the%20Spider-Verse.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    
    audio.addEventListener('error', (e) => {
      console.error("Ambient Audio Load Error:", audio.error);
      setAudioError("Load Failed");
    });

    ambientAudio.current = audio;

    // SFX
    sfxSwitch.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-switch-click-2578.mp3');
    sfxSwitch.current.volume = 0.9;

    sfxHum.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-bulb-flicker-hum-3058.mp3');
    sfxHum.current.loop = true;
    sfxHum.current.volume = 0;

    const handleFirstInteraction = () => {
      if (ambientAudio.current && isMuted) {
        toggleMute(false);
        const events = ['click', 'keydown', 'scroll', 'touchstart', 'mousedown'];
        events.forEach(evt => window.removeEventListener(evt, handleFirstInteraction));
      }
    };

    const events = ['click', 'keydown', 'scroll', 'touchstart', 'mousedown'];
    events.forEach(evt => window.addEventListener(evt, handleFirstInteraction));

    return () => {
      audio.pause();
      sfxHum.current?.pause();
      ambientAudio.current = null;
      sfxHum.current = null;
      sfxSwitch.current = null;
      events.forEach(evt => window.removeEventListener(evt, handleFirstInteraction));
    };
  }, []);

  const toggleMute = (forceState?: boolean) => {
    if (!ambientAudio.current) return;
    
    const targetMute = forceState !== undefined ? forceState : !isMuted;
    
    if (!targetMute) {
      ambientAudio.current.play()
        .then(() => {
          setIsMuted(false);
          setAudioError(null);
          if (isBulbGlowing) sfxHum.current?.play().catch(() => {});
          
          let vol = 0;
          const fadeIn = setInterval(() => {
            vol += 0.1;
            if (vol >= 1.0) {
              vol = 1.0;
              clearInterval(fadeIn);
            }
            if (ambientAudio.current) ambientAudio.current.volume = vol;
          }, 40);
        })
        .catch(e => {
          console.warn("Autoplay block still active.");
          setIsMuted(true);
        });
    } else {
      let vol = ambientAudio.current.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.15;
        if (vol <= 0) {
          vol = 0;
          ambientAudio.current?.pause();
          sfxHum.current?.pause();
          clearInterval(fadeOut);
          setIsMuted(true);
        }
        if (ambientAudio.current) ambientAudio.current.volume = vol;
      }, 25);
    }
  };

  const toggleLight = () => {
    const newState = !isBulbGlowing;
    setIsBulbGlowing(newState);

    if (!isMuted && sfxSwitch.current) {
      sfxSwitch.current.currentTime = 0;
      sfxSwitch.current.play().catch(() => {});
    }

    if (!isMuted && sfxHum.current) {
      if (newState) {
        sfxHum.current.volume = 0;
        sfxHum.current.play().catch(() => {});
        let v = 0;
        const hIn = setInterval(() => {
          v += 0.05;
          if (v >= 0.5) { v = 0.5; clearInterval(hIn); }
          if (sfxHum.current) sfxHum.current.volume = v;
        }, 20);
      } else {
        sfxHum.current.pause();
      }
    }
  };

  const isLightOn = isBulbGlowing;

  return (
    <div className={`relative min-h-screen selection:bg-red-500/20 overflow-x-hidden transition-colors duration-700 ${isLightOn ? 'bg-zinc-50 text-zinc-900' : 'bg-[#050505] text-white'}`}>
      
      {/* Sound Control UI */}
      <div className="fixed top-6 left-6 z-[60]">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: (isMuted && !audioError) ? [1, 1.1, 1] : 1, 
            opacity: 1 
          }}
          transition={{ duration: 1.5, repeat: (isMuted && !audioError) ? Infinity : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleMute()}
          className={`group flex items-center gap-4 pl-4 pr-6 py-3 rounded-2xl backdrop-blur-3xl border transition-all duration-500 shadow-2xl ${
            isMuted 
              ? (isLightOn ? 'bg-red-50 border-red-200' : 'bg-red-600/30 border-red-500/50')
              : (isLightOn ? 'bg-white border-zinc-200 shadow-zinc-200/50' : 'bg-black/80 border-white/10')
          }`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {audioError ? (
                <AlertCircle className="text-red-500" size={24} />
              ) : isMuted ? (
                <motion.div key="mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VolumeX size={24} className="text-red-500" />
                </motion.div>
              ) : (
                <motion.div key="unmute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Disc className="text-red-500 animate-[spin_1s_linear_infinite]" size={26} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-red-500">
              {audioError ? 'LOAD FAILED' : (isMuted ? 'SOUND OFF' : 'VIBING NOW')}
            </span>
            <span className={`text-[11px] font-mono font-bold uppercase ${!isMuted ? 'opacity-100' : 'opacity-80'}`}>
              {audioError ? "Check Connection" : (isMuted ? 'Tap for Sunflower' : 'Instrumental (100%)')}
            </span>
          </div>
          {!isMuted && !audioError && (
            <div className="flex items-end gap-1 h-5 ml-2">
              {[1.4, 0.7, 1.8, 1.1, 1.3, 0.6, 1.6].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h * 8}px`, `${(2-h) * 8}px`, `${h * 8}px`] }}
                  transition={{ duration: 0.2 + (i * 0.04), repeat: Infinity }}
                  className="w-[3px] bg-red-600 rounded-full"
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <InteractiveBackground isLightOn={isLightOn} isBulbGlowing={isBulbGlowing} />
        </Canvas>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 h-[550px] w-64 pointer-events-auto">
        <Canvas camera={{ position: [0, -1, 5], fov: 50 }} shadows>
          <Suspense fallback={null}>
            <SwingingLight isLightOn={isBulbGlowing} onToggle={toggleLight} />
          </Suspense>
        </Canvas>
      </div>

      <main className="relative z-10">
        <Hero isLightOn={isLightOn} onOpenGame={() => setIsGameOpen(true)} />
        <About isLightOn={isLightOn} />
        <VideoEdits isLightOn={isLightOn} />
        <Skills isLightOn={isLightOn} />
        <Portfolio isLightOn={isLightOn} />
        <VibeCoding isLightOn={isLightOn} />
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