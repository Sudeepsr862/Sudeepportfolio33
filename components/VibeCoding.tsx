
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Rocket, Bell, User, Loader2, CheckCircle2, AlertCircle, Key, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isLightOn: boolean;
}

export const VibeCoding: React.FC<Props> = ({ isLightOn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('Transmission failed.');

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('submitting');
    let finalMessage = `Welcome to the grid, ${name}. Sudeep has been notified.`;

    try {
      // Key selection logic
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) await window.aistudio.openSelectKey();
      }

      // 1. Personalized AI Greeting
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `The user named "${name}" has joined Sudeep's portfolio waitlist. Generate a cool 1-sentence futuristic welcome.`,
        });
        if (response.text) finalMessage = response.text;
      } catch (aiErr: any) {
        console.warn("AI Personalization skipped:", aiErr);
        if (aiErr.message?.toLowerCase().includes("not found")) {
          if (window.aistudio) window.aistudio.openSelectKey();
        }
      }

      // 2. FormSubmit AJAX Call
      const response = await fetch("https://formsubmit.co/ajax/sudeepsr52@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, _subject: `New Vibe Waitlist: ${name}`, _captcha: "false" })
      });

      if (response.ok) {
        setConfirmationMessage(finalMessage);
        setStatus('success');
        setName('');
        setEmail('');
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      console.error('Waitlist Error:', err);
      setStatus('error');
      setErrorMessage("Transmission failed. Please ensure a valid API Key is selected.");
    }
  };

  return (
    <section className={`py-32 px-6 relative overflow-hidden ${isLightOn ? 'bg-zinc-200/30' : 'bg-black'}`}>
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-500 font-mono text-xs mb-10 backdrop-blur-md">
          <Zap size={14} className="animate-pulse" /> THE NEXT FRONTIER
        </motion.div>

        <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
          Vibe <span className="text-cyan-500">Coding</span>
        </h2>
        
        <div className="mt-16 flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md p-8 rounded-[2rem] border ${isLightOn ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-900/80 border-cyan-500/30 shadow-lg'} backdrop-blur-md`}>
                <CheckCircle2 size={56} className="text-cyan-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 uppercase italic">Verified</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>{confirmationMessage}</p>
                <button onClick={() => setStatus('idle')} className="text-xs font-mono text-cyan-500 hover:underline uppercase tracking-widest">Return</button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500/50" size={18} />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className={`w-full pl-12 pr-6 py-4 rounded-full border transition-all ${isLightOn ? 'bg-white border-zinc-200 text-black' : 'bg-zinc-900/80 border-zinc-800 text-white focus:border-cyan-500'}`} />
                  </div>
                  <div className="flex gap-2">
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vibe@engineer.com" className={`flex-1 px-6 py-4 rounded-full border transition-all ${isLightOn ? 'bg-white border-zinc-200 text-black' : 'bg-zinc-900/80 border-zinc-800 text-white focus:border-cyan-500'}`} />
                    <button type="submit" disabled={status === 'submitting'} className="p-4 bg-cyan-500 text-black rounded-full hover:bg-cyan-400 disabled:opacity-50 min-w-[56px] flex items-center justify-center">
                      {status === 'submitting' ? <Loader2 size={20} className="animate-spin" /> : <Rocket size={20} />}
                    </button>
                  </div>
                  
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-4">
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-mono uppercase justify-center">
                        <AlertCircle size={12} /> {errorMessage}
                      </div>
                      <button type="button" onClick={handleOpenKey} className="flex items-center gap-2 mx-auto px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded-full hover:text-cyan-500 transition-all uppercase tracking-widest">
                        <Key size={12} /> Select API Key
                      </button>
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[9px] text-zinc-600 hover:text-zinc-400 underline flex items-center justify-center gap-1">
                        <ExternalLink size={10} /> Check Billing Status
                      </a>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-24">
          <div className={`relative inline-block px-12 py-6 rounded-full border-2 border-cyan-500 font-black text-2xl md:text-3xl tracking-[0.2em] uppercase italic ${isLightOn ? 'bg-white text-zinc-900 shadow-xl' : 'bg-black text-cyan-500'}`}>
            Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
};
