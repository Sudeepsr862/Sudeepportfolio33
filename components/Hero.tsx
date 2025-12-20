import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Gamepad2 } from 'lucide-react';

interface Props {
  isLightOn: boolean;
  onOpenGame: () => void;
}

export const Hero: React.FC<Props> = ({ isLightOn, onOpenGame }) => {
  const [text, setText] = useState('');
  const fullText = "Building the future with code.";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-xs mb-6 tracking-widest uppercase">
            <User size={14} /> Available for projects
          </div>
          
          <h1 className={`text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
            SUDEEP <span className="text-red-600">SR</span>
          </h1>

          <div className="h-12 flex items-center mb-8">
            <p className={`text-xl md:text-2xl font-mono ${isLightOn ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {text}<span className="animate-pulse text-red-600">|</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 bg-red-600 text-white font-bold rounded-2xl flex items-center gap-3 shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all text-sm"
            >
              VIEW WORKS <ArrowRight size={18} />
            </motion.a>

            {/* SPIDER-VERSE GAME BUTTON */}
            <motion.button
              onClick={onOpenGame}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border-2 transition-all shadow-xl text-sm ${
                isLightOn 
                ? 'border-red-600/20 bg-white text-zinc-900 hover:bg-red-50' 
                : 'border-red-600/50 bg-red-600/10 text-white hover:bg-red-600/20 shadow-red-600/10'
              }`}
            >
              <Gamepad2 size={18} className="text-red-500" />
              <span className="tracking-tighter uppercase italic">Enter Spidey-Verse</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="hidden lg:block relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className={`w-full aspect-square rounded-[4rem] border flex items-center justify-center p-12 overflow-hidden ${isLightOn ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/5'}`}
          >
             <div className="absolute inset-0 opacity-10">
               <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none" strokeWidth="0.5">
                  <circle cx="50" cy="50" r="45" />
                  <circle cx="50" cy="50" r="35" />
                  <circle cx="50" cy="50" r="25" />
                  <path d="M0 50 L100 50 M50 0 L50 100 M15 15 L85 85 M85 15 L15 85" />
               </svg>
            </div>
            <div className="text-center z-10">
              <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${isLightOn ? 'text-zinc-900/10' : 'text-white/20'}`}>DESIGNER<br/>DEVELOPER<br/>ARTIST</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};