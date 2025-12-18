
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Rocket, Bell, User, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isLightOn: boolean;
}

export const VibeCoding: React.FC<Props> = ({ isLightOn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('submitting');

    try {
      // 1. Trigger Gemini for a personalized AI thank you message
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user named "${name}" with email "${email}" has joined the waitlist for Sudeep SR's "Vibe Coding" platform. 
        Generate a short, cool, and personalized thank you message (max 2 sentences). 
        Mention that Sudeep will contact them soon. 
        The tone should be futuristic, engineering-focused, and friendly.`,
      });

      // 2. Actually send the data to Sudeep's Gmail via FormSubmit AJAX
      const emailPromise = fetch("https://formsubmit.co/ajax/sudeepsr52@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            _subject: `New Vibe Coder Waitlist: ${name}`,
            _template: "table",
            message: `${name} has joined the Vibe Coding waitlist from your portfolio.`
        })
      });

      // Run both concurrently
      const [aiResponse, emailResponse] = await Promise.all([geminiPromise, emailPromise]);

      if (!emailResponse.ok) throw new Error("Email service failure");

      const message = aiResponse.text || `System override successful. Welcome to the grid, ${name}. Sudeep has been notified.`;
      setConfirmationMessage(message);
      
      setStatus('success');
      // Reset form
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Vibe Stream Interruption:', err);
      setStatus('error');
    }
  };

  return (
    <section className={`py-32 px-6 relative overflow-hidden ${isLightOn ? 'bg-zinc-200/30' : 'bg-black'}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-500 font-mono text-xs mb-10 backdrop-blur-md"
        >
          <Zap size={14} className="animate-pulse" /> THE NEXT FRONTIER
        </motion.div>

        <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
          Vibe <span className="text-cyan-500">Coding</span>
        </h2>
        
        <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-light opacity-70 leading-relaxed ${isLightOn ? 'text-zinc-700' : 'text-zinc-300'}`}>
          A revolutionary digital ecosystem where creative expression meets high-performance engineering. Experience the true vibe of modern development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
          {[
            { 
              title: "Experimental UI", 
              desc: "Interfaces that respond to your rhythm and flow.",
              icon: <Sparkles className="text-purple-500" />
            },
            { 
              title: "AI Integration", 
              desc: "Seamless co-creation with generative agents.",
              icon: <Zap className="text-yellow-500" />
            },
            { 
              title: "Sonic Design", 
              desc: "Immersive audio environments for deep focus.",
              icon: <Rocket className="text-cyan-500" />
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-3xl border ${
                isLightOn ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-900/40 border-zinc-800 backdrop-blur-xl'
              }`}
            >
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`w-full max-w-md p-8 rounded-[2rem] border ${isLightOn ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-cyan-500/30'} backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.15)]`}
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <CheckCircle2 size={56} className="text-cyan-500" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-cyan-500 rounded-full"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Injected into Inbox</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {confirmationMessage}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest border-t border-zinc-800 pt-4">
                  <ShieldCheck size={12} /> Encrypted Transmission Complete
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-cyan-500 text-[10px] font-mono uppercase tracking-widest hover:underline"
                >
                  Join with another identity
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
                <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-6">Join the waiting list</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-cyan-500/50">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name" 
                      className={`w-full pl-12 pr-6 py-4 rounded-full border focus:outline-none focus:border-cyan-500 transition-colors ${
                        isLightOn ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-cyan-500/50">
                        <Bell size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="viber@engineer.com" 
                        className={`w-full pl-12 pr-6 py-4 rounded-full border focus:outline-none focus:border-cyan-500 transition-colors ${
                          isLightOn ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
                        }`}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={status === 'submitting'}
                      className="p-4 bg-cyan-500 text-black rounded-full hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center min-w-[56px]"
                    >
                      {status === 'submitting' ? <Loader2 size={20} className="animate-spin" /> : <Rocket size={20} />}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className="text-red-500 text-[10px] font-mono mt-2 uppercase tracking-tighter">Vibe Stream Interrupted. Check connection and retry.</p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
            <div className={`relative px-12 py-6 rounded-full border-2 border-cyan-500 font-black text-2xl md:text-3xl tracking-[0.2em] uppercase italic ${
              isLightOn ? 'bg-white text-zinc-900' : 'bg-black text-cyan-500'
            }`}>
              Coming Soon
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
