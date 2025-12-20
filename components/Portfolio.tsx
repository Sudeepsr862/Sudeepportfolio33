
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const Portfolio: React.FC<Props> = ({ isLightOn }) => {
  const projects = [
    {
      title: "AI Video Synth",
      desc: "Generative AI tool for cinematic sequences.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=400&auto=format&fit=crop",
      tags: ["Python", "PyTorch", "CapCut"],
      link: "#"
    },
    {
      title: "Sup Tools",
      desc: "A collection of high-utility web tools for developers.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&h=400&auto=format&fit=crop",
      tags: ["React", "Tailwind", "Firebase"],
      link: "https://lighthearted-tartufo-05b0ad.netlify.app/"
    },
    {
      title: "Pen Sketch Portfolio",
      desc: "Digital gallery of high-detail pen and ink art.",
      image: "https://images.unsplash.com/photo-1544273677-c433136021d4?q=80&w=600&h=400&auto=format&fit=crop",
      tags: ["Design", "Art", "Creative"],
      link: "#"
    }
  ];

  return (
    <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected <span className="text-cyan-500">Works</span></h2>
          <p className="opacity-60 max-w-md">Crafting digital experiences and visual stories.</p>
        </div>
        <button className="text-cyan-500 font-mono flex items-center gap-2 hover:underline">
          View All Projects <ExternalLink size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover="hover"
            className={`group relative rounded-[2rem] overflow-hidden border transition-all duration-500 ${
              isLightOn 
                ? 'bg-white border-zinc-200 hover:bg-zinc-50/50' 
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/40'
            }`}
          >
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
              <div className="aspect-video overflow-hidden relative">
                <motion.img 
                  variants={{
                    hover: { scale: 1.1, y: -10 }
                  }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <motion.div 
                  variants={{
                    hover: { opacity: 1 }
                  }}
                  className={`absolute inset-0 bg-cyan-500/5 opacity-0 transition-opacity duration-500 pointer-events-none`} 
                />
              </div>
            </a>
            
            <div className="p-8 relative">
              <div className="flex justify-between items-start mb-4">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <h3 className={`text-2xl font-bold transition-colors duration-300 ${isLightOn ? 'text-zinc-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>
                    {project.title}
                  </h3>
                </a>
                <div className="flex gap-4">
                  <Github size={18} className="opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="opacity-30 hover:opacity-100 transition-opacity">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              
              <p className="opacity-50 mb-8 text-sm leading-relaxed group-hover:opacity-70 transition-opacity duration-300">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                    isLightOn 
                      ? 'bg-zinc-100 text-zinc-600 group-hover:bg-cyan-50 group-hover:text-cyan-700' 
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-cyan-900/30 group-hover:text-cyan-300'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtle bottom accent line on hover */}
            <motion.div 
              variants={{
                hover: { scaleX: 1, opacity: 1 }
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 origin-left"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
