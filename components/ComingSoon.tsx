import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, CheckCircle2, Loader2, Clock, ShieldCheck, AlertCircle, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const ComingSoon: React.FC<Props> = ({ isLightOn }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Using FormSubmit.co for direct delivery to your email
      // We use the AJAX endpoint so the page doesn't redirect
      const response = await fetch('https://formsubmit.co/ajax/sudeepsr52@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `New Interest: ${formData.name}`,
          message: `${formData.name} is interested in your upcoming next-gen AI and interactive website projects.`
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Submission Failed');
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus('error');
    }
  };

  return (
    <section id="coming-soon" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[10px] mb-8 tracking-widest uppercase ${isLightOn ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
            <Clock size={12} /> Roadmap: Phase 02
          </div>
          
          <h2 className={`text-5xl md:text-7xl font-bold tracking-tight uppercase mb-6 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
            COMING SOON
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto mb-10 opacity-70 leading-relaxed ${isLightOn ? 'text-zinc-700' : 'text-zinc-300'}`}>
            I'm currently building the next generation of <span className="text-red-600 font-bold">AI-driven experiences</span>, 
            immersive <span className="text-red-600 font-bold">interactive websites</span>, and more. <br/>
            <span className="italic mt-4 block text-sm sm:text-base">If you have interest in these projects, you can submit your details below for early access.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16 opacity-50">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Zap size={14} className="text-red-500" /> Next-Gen AI
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Globe size={14} className="text-red-500" /> 3D Interaction
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Sparkles size={14} className="text-red-500" /> Creative Coding
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-12 rounded-[2.5rem] border ${isLightOn ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-900 border-zinc-800 shadow-2xl shadow-red-950/20'} flex flex-col items-center gap-6`}
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className={`text-2xl font-black italic tracking-tight ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>REGISTRATION COMPLETE</h3>
                  <p className={`text-lg font-medium max-w-sm mx-auto leading-relaxed ${isLightOn ? 'text-zinc-600' : 'text-zinc-300'}`}>
                    Thanks for your interest! I will contact you soon through email.
                  </p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className={`px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isLightOn ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'} shadow-lg`}
                >
                  Send Another Interest
                </button>
              </motion.div>
            ) : status === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-12 rounded-[2.5rem] border border-red-500/20 ${isLightOn ? 'bg-red-50' : 'bg-red-950/10'} flex flex-col items-center gap-6 shadow-2xl`}
                >
                  <AlertCircle size={48} className="text-red-500" />
                  <div>
                    <h3 className={`text-2xl font-black italic tracking-tight uppercase mb-2 ${isLightOn ? 'text-red-900' : 'text-red-100'}`}>Connection Failed</h3>
                    <p className={`opacity-70 text-base max-w-xs mx-auto leading-relaxed ${isLightOn ? 'text-red-800' : 'text-red-200'}`}>
                      The signal dropped! Please try again or reach out directly at <span className="font-bold underline decoration-red-500 decoration-2">sudeepsr52@gmail.com</span>.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStatus('idle')}
                      className={`px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isLightOn ? 'bg-white text-zinc-900 border border-zinc-200 shadow-sm' : 'bg-zinc-800 text-white shadow-xl'}`}
                    >
                      Retry
                    </button>
                    <a 
                      href={`mailto:sudeepsr52@gmail.com?subject=Interest in Next-Gen Projects&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}`}
                      className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:bg-red-500 transition-all"
                    >
                      Email Direct
                    </a>
                  </div>
                </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className={`p-8 md:p-12 rounded-[2.5rem] border text-left transition-all relative overflow-hidden ${
                  isLightOn 
                  ? 'bg-white border-zinc-200 shadow-2xl' 
                  : 'bg-zinc-900 border-zinc-800 shadow-2xl'
                }`}
              >
                {/* Decorative background web */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none" strokeWidth="1">
                    <circle cx="100" cy="0" r="20" /><circle cx="100" cy="0" r="40" /><circle cx="100" cy="0" r="60" /><circle cx="100" cy="0" r="80" />
                    <path d="M100,0 L0,100 M100,0 L50,100 M100,0 L0,50" />
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 ml-1">Your Identity</label>
                    <div className="relative">
                      <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLightOn ? 'text-zinc-300' : 'text-zinc-700'}`} />
                      <input 
                        required
                        type="text"
                        name="name"
                        placeholder="Peter Parker"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-12 pr-6 py-4 rounded-2xl border transition-all outline-none text-sm font-medium ${
                          isLightOn 
                          ? 'bg-zinc-50 border-zinc-200 focus:border-red-500 text-zinc-900' 
                          : 'bg-zinc-950 border-zinc-800 focus:border-red-600 text-white placeholder:opacity-20'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 ml-1">Communication Channel</label>
                    <div className="relative">
                      <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLightOn ? 'text-zinc-300' : 'text-zinc-700'}`} />
                      <input 
                        required
                        type="email"
                        name="email"
                        placeholder="spidey@vibe.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-12 pr-6 py-4 rounded-2xl border transition-all outline-none text-sm font-medium ${
                          isLightOn 
                          ? 'bg-zinc-50 border-zinc-200 focus:border-red-500 text-zinc-900' 
                          : 'bg-zinc-950 border-zinc-800 focus:border-red-600 text-white placeholder:opacity-20'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex-1 w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm tracking-[0.1em] hover:bg-red-500 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase shadow-xl shadow-red-600/20 active:scale-[0.98]"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        SYNCHRONIZING...
                      </>
                    ) : (
                      <>
                        SUBMIT INTEREST 🕸️
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-4 px-8 py-4 rounded-2xl border border-zinc-800/10 bg-zinc-800/5 opacity-40">
                    <ShieldCheck size={20} className="text-zinc-500" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] leading-tight">
                      Encrypted<br/>Submission
                    </span>
                  </div>
                </div>
                
                <p className="mt-10 text-center text-[10px] font-mono opacity-20 uppercase tracking-[0.4em]">
                  Routed to: sudeepsr52@gmail.com
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};