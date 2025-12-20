
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Gamepad2, ArrowRight, Zap, User } from 'lucide-react';

interface Props {
  isLightOn: boolean;
  onOpenGame: () => void;
}

export const Hero: React.FC<Props> = ({ isLightOn, onOpenGame }) => {
  const [text, setText] = useState('');
  const fullText = "Keep Learning.";
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  // Scroll-based parallax and fade effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          style={{ y: titleY, opacity: contentOpacity, scale }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 font-mono text-xs mb-6 uppercase tracking-widest">
            <User size={14} className="animate-pulse" /> PORTFOLIO
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            <motion.span 
              className={`inline-block ${isLightOn ? 'text-zinc-900' : 'text-white'}`}
              style={{ y: titleY }}
            >
              SUDEEP <span className="text-red-600">SR</span>
            </motion.span>
            <br />
            {/* Added pr-10 and -mr-10 to prevent the italic 'R' from being clipped while maintaining alignment */}
            <motion.span 
              style={{ y: subtitleY }}
              className={`inline-block pr-10 -mr-10 text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-400 italic leading-relaxed`}
            >
              VIBE CODER
            </motion.span>
          </h1>

          <div className="h-12 flex items-center mb-8">
            <p className={`text-xl md:text-2xl font-mono ${isLightOn ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {text}<span className="animate-pulse text-red-600">|</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenGame}
              className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl flex items-center gap-3 shadow-[0_10px_40px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all"
            >
              <Gamepad2 size={20} /> SWING INTO ACTION
            </motion.button>
            
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 border font-bold rounded-2xl flex items-center gap-3 backdrop-blur-md transition-all ${isLightOn ? 'bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              VIEW WORKS <ArrowRight size={20} />
            </motion.a>
          </div>

          <div className="mt-16 flex items-center gap-10 opacity-50">
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase tracking-widest mb-1">Status</span>
              <span className="text-sm font-bold text-green-600 uppercase">Available for Collabs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase tracking-widest mb-1">Focus</span>
              <span className="text-sm font-bold uppercase">AIML & Creative UI</span>
            </div>
          </div>
        </motion.div>

        <div className="hidden lg:block relative">
          <motion.div 
            style={{ y: subtitleY, opacity: contentOpacity }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`w-full aspect-square rounded-[4rem] border relative overflow-hidden backdrop-blur-sm ${isLightOn ? 'bg-white/40 border-zinc-200 shadow-sm' : 'bg-gradient-to-br from-cyan-500/10 via-red-500/5 to-transparent border-white/5'}`}
          >
            {/* Abstract Background for Hero Space */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <svg viewBox="0 0 200 200" className="w-full h-full stroke-red-600 fill-none" strokeWidth="0.1">
                  <circle cx="100" cy="100" r="80" />
                  <circle cx="100" cy="100" r="60" />
                  <circle cx="100" cy="100" r="40" />
                  <line x1="0" y1="100" x2="200" y2="100" />
                  <line x1="100" y1="0" x2="100" y2="200" />
               </svg>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <Sparkles size={48} className="text-red-500 mb-6" />
              <h3 className={`text-2xl font-black italic mb-4 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>"Building ideas into reality with code."</h3>
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Digital Architect & Visionary</p>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-red-500" />
          </motion.div>
        </div>
      </div>

      {/* Hero Scroll Indicator */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent" />
        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isLightOn ? 'text-red-600' : 'text-white'}`}>Scroll</span>
      </motion.div>
    </section>
  );
};
