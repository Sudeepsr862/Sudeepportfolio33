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
          <div className={`h-full w-full rounded-[4rem] overflow-hidden border-2 border-red-600/20 shadow-2xl transition-colors duration-700 ${isLightOn ? 'bg-zinc-100' : 'bg-[#0a0a0a]'}`}>
            <Suspense fallback={<div className="flex items-center justify-center h-full font-mono text-red-500 animate-pulse uppercase tracking-[0.2em]">Materializing Hero...</div>}>
              <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={28} />
                <AmbientLight intensity={0.5} />
                
                {/* Cinematic Key and Rim Lighting for the Suit */}
                <SpotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} color="#ffffff" castShadow />
                <PointLight position={[-10, 5, 5]} color="#4488ff" intensity={2} />
                <PointLight position={[10, -5, 5]} color="#ff4444" intensity={1.5} />
                
                <Environment preset="city" />
                
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                  <group position={[0, -0.2, 0]}> {/* Spidey is perfectly centered */}
                    <SpiderManCharacter />
                  </group>
                </Float>

                <ContactShadows 
                  position={[0, -2.5, 0]} 
                  opacity={0.6} 
                  scale={12} 
                  blur={3} 
                  far={4} 
                  color={isLightOn ? "#000000" : "#ff0000"} 
                />
                
                <OrbitControls 
                  enableZoom={false} 
                  minPolarAngle={Math.PI / 3} 
                  maxPolarAngle={Math.PI / 1.6}
                  enableDamping={true}
                  dampingFactor={0.06}
                />
              </Canvas>
            </Suspense>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 px-10 py-5 bg-red-600 text-white text-[10px] font-black rounded-3xl shadow-[0_20px_50px_rgba(220,38,38,0.4)] pointer-events-none group-hover:scale-110 transition-transform uppercase tracking-[0.2em] italic border-2 border-white/20"
          >
            POINT AT ME 👋 🕸️
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};