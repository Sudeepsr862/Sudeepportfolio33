
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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -12, 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className={`group rounded-3xl overflow-hidden border transition-all duration-500 will-change-transform ${
              isLightOn 
                ? 'bg-white border-zinc-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]' 
                : 'bg-zinc-900 border-zinc-800 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]'
            }`}
          >
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </a>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-2xl font-bold hover:text-cyan-500 transition-colors">{project.title}</h3>
                </a>
                <div className="flex gap-3">
                  <Github size={20} className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              <p className="opacity-60 mb-6 text-sm leading-relaxed">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-mono uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
