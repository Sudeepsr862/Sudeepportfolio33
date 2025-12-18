
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Film, ExternalLink, Play } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const VideoEdits: React.FC<Props> = ({ isLightOn }) => {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto overflow-hidden text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 font-mono text-sm mb-8 border border-cyan-500/20">
          <Film size={16} /> @sype.ix
        </div>
        
        <h2 className={`text-4xl md:text-6xl font-black mb-8 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
          Visual <span className="text-cyan-500">Mastery</span>
        </h2>
        
        <p className={`max-w-xl text-lg mb-12 opacity-60 ${isLightOn ? 'text-zinc-700' : 'text-zinc-400'}`}>
          Capturing moments and breathing life into them through advanced editing. I specialize in rhythm-based edits and cinematic color grading.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative group rounded-[2.5rem] border overflow-hidden max-w-md w-full transition-all aspect-[4/5] ${
            isLightOn 
              ? 'bg-white border-zinc-200 shadow-2xl' 
              : 'bg-zinc-900 border-zinc-800 shadow-[0_0_50px_rgba(6,182,212,0.1)]'
          }`}
        >
          {/* Loop Video Preview */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-at-night-with-neon-lights-40134-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-1" />
          </div>

          {/* Card Content Overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end p-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 p-0.5 mb-6 shadow-2xl">
              <div className="w-full h-full rounded-full border-4 border-black bg-black flex items-center justify-center">
                <Instagram size={36} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-2 text-white">@sype.ix</h3>
            <p className="text-sm text-cyan-400 font-mono mb-8 tracking-widest uppercase">Video Editor & Artist</p>
            
            <motion.a
              href="https://www.instagram.com/sype.ix?igsh=MW9jeXAzd2RsNjZvcw=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-10 py-4 bg-cyan-500 text-black font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all mb-4 w-full justify-center"
            >
              View Work <ExternalLink size={18} />
            </motion.a>
          </div>

          {/* Abstract corner decoration */}
          <div className="absolute top-6 left-6 z-10 opacity-50">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="font-mono text-xs tracking-widest uppercase">CapCut</div>
          <div className="font-mono text-xs tracking-widest uppercase">DaVinci Resolve</div>
          <div className="font-mono text-xs tracking-widest uppercase">After Effects</div>
        </div>
      </motion.div>
    </section>
  );
};
