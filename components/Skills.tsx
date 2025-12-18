
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, Video, Terminal } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const Skills: React.FC<Props> = ({ isLightOn }) => {
  const categories = [
    {
      title: "Development",
      icon: <Code />,
      skills: ["Full Stack Dev", "Python", "C++", "React/Next.js"]
    },
    {
      title: "AI & ML",
      icon: <Brain />,
      skills: ["Generative AI", "Data Analysis", "Prompt Engineering", "NLP"]
    },
    {
      title: "Content Creation",
      icon: <Video />,
      skills: ["DaVinci Resolve", "CapCut", "Color Grading", "Cinematography"]
    },
    {
      title: "Tools & Extras",
      icon: <Terminal />,
      skills: ["Git", "Figma", "Sketching", "Visual Storytelling"]
    }
  ];

  return (
    <section className={`py-24 px-6 ${isLightOn ? 'bg-zinc-200/50' : 'bg-zinc-900/30'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">My <span className="text-cyan-500">Expertise</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl border transition-all hover:-translate-y-2 ${
                isLightOn ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold mb-6">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.skills.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm opacity-80">
                    <div className="w-1 h-1 rounded-full bg-cyan-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
