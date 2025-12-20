import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Send, CheckCircle2, Loader2, Sparkles, Clock } from 'lucide-react';

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
      // Using Formspree to send to sudeepsr52@gmail.com
      const response = await fetch('https://formspree.io/f/mvgzpbdp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `New Waitlist Signup: ${formData.name}`,
          message: `${formData.name} has joined the waitlist for Sudeep's upcoming projects.`
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again or email me directly!");
      setStatus('idle');
    }
  };

  return (
    <section id="coming-soon" className="py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-xs mb-6 tracking-widest uppercase">
            <Clock size={14} /> Systems Initializing
          </div>
          
          <h2 className={`text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
            COMING <span className="text-red-600 glitch-text">SOON</span>
          </h2>
          
          <p className={`text-lg max-w-xl mx-auto mb-12 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
            I'm currently building a suite of AI-powered creative tools. Join the waitlist to get early access and exclusive updates.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-12 rounded-[2.5rem] border ${isLightOn ? 'bg-white border-green-200' : 'bg-zinc-900/50 border-green-500/30'} backdrop-blur-xl flex flex-col items-center gap-4`}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold">You're on the list!</h3>
                <p className="opacity-60">I'll reach out to you at the speed of light. 🕸️</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm font-mono text-red-500 hover:underline"
                >
                  Sign up another person?
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className={`p-8 md:p-12 rounded-[2.5rem] border text-left transition-all ${
                  isLightOn ? 'bg-white border-zinc-200 shadow-2xl' : 'bg-zinc-900/40 border-white/5 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest opacity-50 ml-1">Identity</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                      <input 
                        required
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none ${
                          isLightOn ? 'bg-zinc-50 border-zinc-200 focus:border-red-500' : 'bg-black/40 border-white/10 focus:border-red-600 focus:bg-black/60'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest opacity-50 ml-1">Channel</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                      <input 
                        required
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none ${
                          isLightOn ? 'bg-zinc-50 border-zinc-200 focus:border-red-500' : 'bg-black/40 border-white/10 focus:border-red-600 focus:bg-black/60'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status === 'submitting'}
                  className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      SECURELY UPLOADING...
                    </>
                  ) : (
                    <>
                      JOIN THE SQUAD <Sparkles size={20} />
                    </>
                  )}
                </motion.button>
                
                <p className="mt-6 text-center text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
                  Encrypted submission to sudeepsr52@gmail.com via VibeLink v1.0
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};