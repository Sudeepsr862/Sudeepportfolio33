
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Rocket, User, Loader2, CheckCircle2, AlertCircle, Key, Mail, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isLightOn: boolean;
}

export const VibeCoding: React.FC<Props> = ({ isLightOn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const TARGET_EMAIL = "sudeepsr52@gmail.com";

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('submitting');
    let welcomeMessage = `Welcome to the grid, ${name}. Your request has been transmitted successfully.`;

    try {
      // 1. AI Integration (Optional Greeting)
      if (process.env.API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user "${name}" joined Sudeep's waitlist. Generate a cool 1-sentence futuristic welcome mentioning 'Vibe Coding' or 'Spider-Man'.`,
          });
          if (response.text) welcomeMessage = response.text;
        } catch (aiErr) {
          console.warn("AI skipping greeting.");
        }
      }

      // 2. Submit to FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          name, 
          email, 
          _subject: `New Lead: ${name}`, 
          _captcha: "false" 
        })
      });

      if (response.ok) {
        setConfirmationMessage(welcomeMessage);
        setStatus('success');
        setName('');
        setEmail('');
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage("Transmission failed. Please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className={`py-32 px-6 relative overflow-hidden ${isLightOn ? 'bg-zinc-200/30' : 'bg-black'}`}>
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-500 font-mono text-xs mb-10 backdrop-blur-md"
        >
          <Zap size={14} className="animate-pulse" /> THE NEXT FRONTIER
        </motion.div>

        <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
          Vibe <span className="text-cyan-500">Coding</span>
        </h2>
        
        <div className="mt-16 flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success" 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className={`w-full max-w-md p-10 rounded-[3rem] border ${isLightOn ? 'bg-white border-zinc-200 shadow-2xl' : 'bg-zinc-950 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]'} backdrop-blur-xl`}
              >
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-cyan-500" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-widest text-white">Transmission Received</h3>
                <p className={`text-sm leading-relaxed mb-8 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>{confirmationMessage}</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                  >
                    Return to Form
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/50" size={18} />
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Full Name" 
                      className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border transition-all ${isLightOn ? 'bg-white border-zinc-200 text-black shadow-sm' : 'bg-zinc-900/40 border-zinc-800 text-white focus:border-cyan-500'}`} 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/50" size={18} />
                      <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your@email.com" 
                        className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border transition-all ${isLightOn ? 'bg-white border-zinc-200 text-black shadow-sm' : 'bg-zinc-900/40 border-zinc-800 text-white focus:border-cyan-500'}`} 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'} 
                      className="px-8 py-5 bg-cyan-600 text-white rounded-[1.5rem] font-black hover:bg-cyan-500 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20"
                    >
                      {status === 'submitting' ? <Loader2 size={20} className="animate-spin" /> : <><Send size={20} /> JOIN GRID</>}
                    </button>
                  </div>
                  
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem]">
                      <div className="flex items-center gap-3 text-red-500 text-[10px] font-black uppercase justify-center mb-4 tracking-widest">
                        <AlertCircle size={14} /> {errorMessage}
                      </div>
                      <div className="flex justify-center">
                        <button 
                          type="button" 
                          onClick={handleOpenKey} 
                          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-zinc-400 text-[10px] border border-zinc-800 rounded-full hover:text-white transition-all uppercase tracking-widest font-black"
                        >
                          <Key size={12} /> AI Config
                        </button>
                      </div>
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
