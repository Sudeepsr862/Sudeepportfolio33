
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Palette } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { SpiderManCharacter } from './Scene/SpiderManCharacter';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

interface Props {
  isLightOn: boolean;
}

export const About: React.FC<Props> = ({ isLightOn }) => {
  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        <div className="order-2 md:order-1">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
            The Story <span className="text-red-500 italic">Behind the Code</span>
          </h2>
          <p className={`text-lg leading-relaxed mb-8 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
            I am an 18-year-old engineering student from the serene landscapes of <span className="text-red-500 font-bold">Chikmagalur/Sringeri</span>. 
            Currently pursuing my B.E. in Artificial Intelligence and Machine Learning at <span className="text-red-500 font-bold">MITK Udupi</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900'}`}>
              <MapPin className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Roots</h4>
              <p className="text-sm opacity-60">Sringeri, Karnataka</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900'}`}>
              <GraduationCap className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Education</h4>
              <p className="text-sm opacity-60">MITK Udupi - AIML</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900'}`}>
              <Palette className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Artistic Soul</h4>
              <p className="text-sm opacity-60">Pen Art & Sketching</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900'}`}>
              <User className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Persona</h4>
              <p className="text-sm opacity-60">Creative Thinker</p>
            </div>
          </div>
        </div>

        <div className="relative h-[750px] w-full group order-1 md:order-2">
          {/* The Hero Hub Frame */}
          <div className={`h-full w-full rounded-[4.5rem] overflow-hidden border border-red-600/20 shadow-[0_50px_100px_-20px_rgba(220,38,38,0.15)] transition-all duration-700 hover:border-red-600/40 ${isLightOn ? 'bg-zinc-100' : 'bg-[#080808]'}`}>
            <Suspense fallback={<div className="flex items-center justify-center h-full font-mono text-red-500 animate-pulse uppercase tracking-[0.2em] italic">Materializing Spider-Man...</div>}>
              <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                {/* PERFECT CENTERING CAMERA */}
                <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={28} />
                <AmbientLight intensity={0.6} />
                
                {/* CINEMATIC LIGHTING SUITE */}
                <SpotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={3.5} color="#ffffff" castShadow />
                <PointLight position={[-10, 5, 5]} color="#4488ff" intensity={2.5} />
                <PointLight position={[10, -5, 5]} color="#ff4444" intensity={2} />
                <PointLight position={[0, 0, 5]} color="#ffffff" intensity={0.5} />
                
                <Environment preset="city" />
                
                {/* CENTERED CHARACTER WITH SMOOTH FLOAT */}
                <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
                  <group position={[0, 0, 0]}> 
                    <SpiderManCharacter />
                  </group>
                </Float>

                {/* REALISTIC CONTACT SHADOWS */}
                <ContactShadows 
                  position={[0, -2.4, 0]} 
                  opacity={0.65} 
                  scale={14} 
                  blur={3} 
                  far={4} 
                  color={isLightOn ? "#000000" : "#ff0000"} 
                />
                
                <OrbitControls 
                  enableZoom={false} 
                  minPolarAngle={Math.PI / 3} 
                  maxPolarAngle={Math.PI / 1.65}
                  enableDamping={true}
                  dampingFactor={0.07}
                />
              </Canvas>
            </Suspense>
          </div>
          
          {/* INTERACTIVE INDICATOR */}
          <motion.div 
            animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 px-12 py-6 bg-red-600 text-white text-[11px] font-black rounded-[2rem] shadow-[0_25px_60px_rgba(220,38,38,0.4)] pointer-events-none group-hover:bg-red-500 group-hover:scale-110 transition-all uppercase tracking-[0.3em] italic border-2 border-white/20 flex items-center gap-3"
          >
            TOUCH TO WAVE 👋 🕸️
          </motion.div>

          {/* WEB ACCENT */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none" strokeWidth="0.5">
              <circle cx="0" cy="100" r="20" /><circle cx="0" cy="100" r="40" /><circle cx="0" cy="100" r="60" /><circle cx="0" cy="100" r="80" />
              <path d="M0,100 L100,0 M0,100 L100,50 M0,100 L50,0" />
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
