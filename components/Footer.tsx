
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Globe, Mail, Phone, AtSign, User } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const Footer: React.FC<Props> = ({ isLightOn }) => {
  return (
    <footer className={`relative py-24 px-6 overflow-hidden border-t ${isLightOn ? 'bg-zinc-50 border-zinc-200' : 'bg-[#030303] border-zinc-900'}`}>
      {/* Spider Web Aesthetics - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none" strokeWidth="0.5">
          <path d="M0,100 L100,0" />
          <path d="M0,100 L100,40" />
          <path d="M0,100 L40,0" />
          <circle cx="0" cy="100" r="20" />
          <circle cx="0" cy="100" r="40" />
          <circle cx="0" cy="100" r="60" />
          <circle cx="0" cy="100" r="80" />
        </svg>
      </div>

      {/* Spider Web Aesthetics - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none" strokeWidth="0.5">
          <path d="M100,100 L0,0" />
          <path d="M100,100 L0,40" />
          <path d="M100,100 L40,0" />
          <circle cx="100" cy="100" r="20" />
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="80" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Spider-Man Quote Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative group overflow-hidden rounded-[2rem] border-2 border-red-600/30 bg-gradient-to-r from-zinc-950 via-red-950/20 to-zinc-950 p-10 md:p-16 text-center shadow-[0_0_50px_rgba(220,38,38,0.1)]">
            {/* Animated Glow Border */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-red-500" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-6 p-4 rounded-full bg-red-600/10 border border-red-500/20"
              >
                <svg viewBox="0 0 100 100" className="w-12 h-12 fill-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  <path d="M50 5 L60 35 L95 45 L65 55 L55 90 L45 60 L10 50 L40 40 Z" />
                </svg>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-4">
                "With great power comes <span className="text-red-600 glitch-text">great responsibility</span>."
              </h2>
              
              <div className="flex items-center justify-center gap-4 opacity-40">
                <div className="h-px w-12 bg-red-600" />
                <span className="text-xs font-mono uppercase tracking-[0.5em]">Stan Lee / Peter Parker</span>
                <div className="h-px w-12 bg-red-600" />
              </div>
            </div>

            {/* Background Web Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="web-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 0 L100 100 M100 0 L0 100 M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#web-pattern)" />
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          <div>
            <h3 className="text-2xl font-bold mb-6">Sudeep <span className="text-cyan-500">SR</span></h3>
            <p className="opacity-60 mb-8 max-w-xs leading-relaxed">
              Engineering student and creative developer building the future of digital experiences with a touch of "vibe".
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="https://www.instagram.com/sype.ix?igsh=MW9jeXAzd2RsNjZvcw==" target="_blank" rel="noopener noreferrer" title="Instagram (Edits)" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all">
                <Instagram size={18}/>
              </a>
              <a href="https://www.instagram.com/sudeepsr_?igsh=ZzA5dXVyOGllZW8z" target="_blank" rel="noopener noreferrer" title="Instagram (Private)" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all text-[10px] font-bold">
                IG
              </a>
              <a href="https://www.threads.net/@sudeepsr_" target="_blank" rel="noopener noreferrer" title="Threads" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all">
                <AtSign size={18}/>
              </a>
              <a href="https://www.linkedin.com/in/sudeep-sr-56808435a" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all">
                <Linkedin size={18}/>
              </a>
              <a href="https://lighthearted-tartufo-05b0ad.netlify.app/" target="_blank" rel="noopener noreferrer" title="Sup Tools Website" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all">
                <Globe size={18}/>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-red-500 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4 opacity-60">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-red-500 transition-colors">Home</button></li>
              <li><a href="#about" className="hover:text-red-500 transition-colors">About</a></li>
              <li><a href="#portfolio" className="hover:text-red-500 transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-red-500 uppercase tracking-widest text-sm">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <Mail size={16} /> 
                </div>
                <a href="mailto:sudeepsr52@gmail.com" className="text-sm">sudeepsr52@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <Phone size={16} /> 
                </div>
                <a href="tel:+919353927350" className="text-sm">+91 9353927350</a>
              </li>
              <li className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <AtSign size={16} /> 
                </div>
                <a href="https://www.instagram.com/sudeepsr_" target="_blank" rel="noopener noreferrer" className="text-sm">@sudeepsr_</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-12 border-t border-white/5 relative z-10">
          <p className="text-xs opacity-30 font-mono tracking-widest">
            © {new Date().getFullYear()} SUDEEP SR. BUILT WITH VIBE & RESPONSIBILITY.
          </p>
        </div>
      </div>
    </footer>
  );
};
