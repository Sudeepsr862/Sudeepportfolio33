import React, { Suspense } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Portfolio } from './components/Portfolio';
import { VideoEdits } from './components/VideoEdits';
import { Footer } from './components/Footer';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  // Resetting to a permanent professional dark theme for stability
  const isLightOn = false;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        <Hero isLightOn={isLightOn} onOpenGame={() => {}} />
        <About isLightOn={isLightOn} />
        <Skills isLightOn={isLightOn} />
        <Portfolio isLightOn={isLightOn} />
        <VideoEdits isLightOn={isLightOn} />
        <section id="contact" className="py-24 px-6 border-t border-white/5">
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
    </div>
  );
};

export default App;