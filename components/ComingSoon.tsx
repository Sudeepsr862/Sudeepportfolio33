import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Send, CheckCircle2, Loader2, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  isLightOn: boolean;
}

export const ComingSoon: React.FC<Props> = ({ isLightOn }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Formspree endpoint configured for sudeepsr52@gmail.com
      // Note: Formspree requires the 'name' and 'email' attributes to match the data
      const response = await fetch('https://formspree.io/f/mvgzpbdp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `🚀 New Waitlist Entry: ${formData.name}`,
          message: `Identity: ${formData.name}\nChannel: ${formData.email}\nStatus: Ready for Sync.`
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Signal Interrupted');
      }
    } catch (err) {
      console.error(err);
      alert("The signal dropped! Please try again or email me directly at sudeepsr52@gmail.com");
      setStatus('idle');
    }
  };

  return (
    <section id="coming-soon" className="py-32 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${isLightOn ? 'bg-red-500/5' : 'bg-red-600/10'}`} />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] mb-8 tracking-[0.3em] uppercase">
            <Clock size={14} className="animate-spin-slow" /> Protocol: Waitlist v2.0
          </div>
          
          <h2 className={`text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
            COMING <span className="text-red-600 glitch-text">SOON</span>
          </h2>
          
          <p className={`text-xl max-w-2xl mx-auto mb-16 leading-relaxed opacity-70 ${isLightOn ? 'text-zinc-700' : 'text-zinc-300'}`}>
            Building a suite of high-octane digital tools. Drop your credentials below to get early access before the general public.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`p-16 rounded-[3rem] border-2 ${isLightOn ? 'bg-white border-green-500/30' : 'bg-zinc-900/60 border-green-500/40'} backdrop-blur-3xl shadow-2xl flex flex-col items-center gap-6`}
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-3xl font-black italic tracking-tighter mb-2">SYSTEMS SYNCED</h3>
                  <p className="opacity-60 font-medium">You're on the list, Sudeep has been notified. 🕸️</p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-8 py-3 rounded-full border border-zinc-500/30 text-xs font-mono uppercase tracking-widest hover:bg-zinc-500/10 transition-colors"
                >
                  Register another identity?
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className={`p-8 md:p-16 rounded-[3rem] border-2 text-left transition-all duration-500 ${
                  isLightOn 
                  ? 'bg-white border-zinc-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]' 
                  : 'bg-zinc-900/40 border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:border-red-600/20'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 ml-2">Identity / Name</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors">
                        <User size={20} />
                      </div>
                      <input 
                        required
                        type="text"
                        name="name"
                        placeholder="Peter Parker"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-14 pr-6 py-5 rounded-2xl border-2 transition-all outline-none text-sm font-medium ${
                          isLightOn 
                          ? 'bg-zinc-50 border-zinc-100 focus:border-red-500 focus:bg-white' 
                          : 'bg-black/40 border-white/10 focus:border-red-600 focus:bg-black/60 text-white'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 ml-2">Channel / Email</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input 
                        required
                        type="email"
                        name="email"
                        placeholder="spidey@vibe.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-14 pr-6 py-5 rounded-2xl border-2 transition-all outline-none text-sm font-medium ${
                          isLightOn 
                          ? 'bg-zinc-50 border-zinc-100 focus:border-red-500 focus:bg-white' 
                          : 'bg-black/40 border-white/10 focus:border-red-600 focus:bg-black/60 text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'submitting'}
                    className="flex-1 w-full py-6 bg-red-600 text-white rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase italic"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        UPLOADING DATA...
                      </>
                    ) : (
                      <>
                        Secure Early Access <Sparkles size={18} />
                      </>
                    )}
                  </motion.button>
                  
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/5 bg-white/5 opacity-40">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span className="text-[9px] font-mono uppercase tracking-widest leading-none">End-to-End<br/>Encrypted</span>
                  </div>
                </div>
                
                <p className="mt-8 text-center text-[9px] font-mono opacity-25 uppercase tracking-[0.4em]">
                  Routed to sudeepsr52@gmail.com • VibeSync Secure Link
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};