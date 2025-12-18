import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, ArrowRight } from 'lucide-react';

// Fix for Framer Motion property errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface Props {
  isLightOn: boolean;
  onOpenGame: () => void;
}

export const Hero: React.FC<Props> = ({ isLightOn, onOpenGame }) => {
  const [text, setText] = useState('');
  const fullText = "Keep Learning.";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-20"
      >
        <div className="mb-6 relative inline-block">
          <div className="w-32 h-32 rounded-full border-4 border-cyan-500 overflow-hidden bg-zinc-800 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <img 
              src="https://picsum.photos/seed/sudeep/200/200" 
              alt="Sudeep SR" 
              className="w-full h-full object-cover"
            />
          </div>
          <MotionDiv 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-dashed border-cyan-500/30 rounded-full"
          />
        </div>

        <h1 className={`text-6xl md:text-8xl font-bold mb-4 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
          Sudeep <span className="text-cyan-500 glitch-text">SR</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["B.E. AIML Student", "Full Stack Developer", "Vibe Coder", "Videographer", "Artist"].map((tag) => (
            <span key={tag} className={`px-4 py-1 rounded-full text-sm font-mono border ${isLightOn ? 'border-zinc-300 bg-zinc-200 text-zinc-700' : 'border-zinc-800 bg-zinc-900/50 text-cyan-500'}`}>
              {tag}
            </span>
          ))}
        </div>

        <p className={`text-2xl md:text-3xl font-mono mb-12 h-8 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {text}<span className="animate-pulse">_</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-full flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            Explore Projects <ArrowRight size={20} />
          </MotionButton>
          
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenGame}
            className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 border ${
              isLightOn ? 'border-zinc-300 hover:bg-zinc-100' : 'border-zinc-800 hover:bg-zinc-900'
            }`}
          >
            <Gamepad2 size={20} className="text-red-500" /> Time Pass?
          </MotionButton>
        </div>
      </MotionDiv>

      <MotionDiv
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
      >
        <div className={`w-6 h-10 rounded-full border-2 ${isLightOn ? 'border-zinc-400' : 'border-white'} flex justify-center p-1`}>
          <div className={`w-1 h-2 rounded-full ${isLightOn ? 'bg-zinc-400' : 'bg-white'}`} />
        </div>
      </MotionDiv>
    </section>
  );
};