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
      const response = await fetch('https://formspree.io/f/mvgzpbdp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `🚀 INTEREST: ${formData.name}`,
          message: `User ${formData.name} (${formData.email}) expressed interest in next-gen projects.`
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Signal Blocked');
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
            <span className="italic mt-4 block">If you have interest in these projects, you can submit your details below for early access.</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-12 rounded-3xl border ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'} flex flex-col items-center gap-6`}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>REGISTRATION COMPLETE</h3>
                  <p className="text-zinc-500 font-medium">
                    Thank you for your interest! I will send an email to you.
                  </p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isLightOn ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  Register Another
                </button>
              </motion.div>
            ) : status === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-12 rounded-3xl border border-red-500/20 ${isLightOn ? 'bg-red-50' : 'bg-red-950/10'} flex flex-col items-center gap-6`}
                >
                  <AlertCircle size={40} className="text-red-500" />
                  <div>
                    <h3 className={`text-xl font-bold uppercase mb-2 ${isLightOn ? 'text-red-900' : 'text-red-100'}`}>Connection Failed</h3>
                    <p className={`opacity-70 text-sm max-w-xs mx-auto ${isLightOn ? 'text-red-800' : 'text-red-200'}`}>
                      There was an issue sending your data. You can try again or email me directly.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStatus('idle')}
                      className={`px-6 py-3 rounded-xl font-bold text-xs uppercase ${isLightOn ? 'bg-white text-zinc-900 border border-zinc-200' : 'bg-zinc-800 text-white'}`}
                    >
                      Retry
                    </button>
                    <a 
                      href={`mailto:sudeepsr52@gmail.com?subject=Waitlist Signup&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}`}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase"
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
                className={`p-8 md:p-12 rounded-3xl border text-left transition-all ${
                  isLightOn 
                  ? 'bg-white border-zinc-200' 
                  : 'bg-zinc-900 border-zinc-800 shadow-sm'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-40 ml-1">Your Name</label>
                    <input 
                      required
                      type="text"
                      name="name"
                      placeholder="Peter Parker"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl border transition-all outline-none text-sm ${
                        isLightOn 
                        ? 'bg-zinc-50 border-zinc-200 focus:border-red-500 text-zinc-900' 
                        : 'bg-zinc-950 border-zinc-800 focus:border-red-600 text-white placeholder:opacity-20'
                      }`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-40 ml-1">Your Email</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      placeholder="spidey@vibe.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl border transition-all outline-none text-sm ${
                        isLightOn 
                        ? 'bg-zinc-50 border-zinc-200 focus:border-red-500 text-zinc-900' 
                        : 'bg-zinc-950 border-zinc-800 focus:border-red-600 text-white placeholder:opacity-20'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex-1 w-full py-5 bg-red-600 text-white rounded-xl font-bold text-sm tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        SECURE MY ACCESS 🕸️
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-zinc-800/10 bg-zinc-800/5 opacity-40">
                    <ShieldCheck size={18} className="text-zinc-500" />
                    <span className="text-[9px] font-mono uppercase tracking-widest leading-none">
                      Secure<br/>Transmission
                    </span>
                  </div>
                </div>
                
                <p className="mt-8 text-center text-[9px] font-mono opacity-20 uppercase tracking-[0.3em]">
                  Direct sync to sudeepsr52@gmail.com
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};