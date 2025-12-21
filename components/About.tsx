
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Palette } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { SpiderManCharacter } from './Scene/SpiderManCharacter';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;

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
            I am an 18-year-old engineering student from <span className="text-red-500 font-bold">Chikmagalur</span>. 
            Pursuing B.E. in AIML at <span className="text-red-500 font-bold">MITK Udupi</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800'}`}>
              <MapPin className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Roots</h4>
              <p className="text-sm opacity-60">Sringeri, Karnataka</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800'}`}>
              <GraduationCap className="text-red-500 mb-3" size={24} />
              <h4 className="font-bold mb-1">Education</h4>
              <p className="text-sm opacity-60">MITK Udupi - AIML</p>
            </div>
          </div>
        </div>

        <div className="relative h-[650px] w-full group order-1 md:order-2">
          <div className={`h-full w-full rounded-[4rem] overflow-hidden border border-red-600/10 shadow-2xl transition-all duration-700 ${isLightOn ? 'bg-zinc-100' : 'bg-[#080808]'}`}>
            <Suspense fallback={<div className="flex items-center justify-center h-full font-mono text-red-500 animate-pulse">Materializing...</div>}>
              <Canvas 
                dpr={[1, 1.5]} 
                gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={28} />
                <AmbientLight intensity={0.7} />
                <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                
                <Environment preset="city" />
                
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
                  <SpiderManCharacter />
                </Float>

                <ContactShadows position={[0, -2.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color={isLightOn ? "#000000" : "#ff0000"} />
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/1.6} enableDamping />
              </Canvas>
            </Suspense>
          </div>
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 px-8 py-4 bg-red-600 text-white text-[10px] font-black rounded-2xl shadow-xl uppercase tracking-widest italic"
          >
            HOVER TO WAVE 👋
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
