
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Rocket, Bell, User, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
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
    console.log('Initiating Vibe Waitlist submission...');

    // Default fallback message in case AI is unavailable
    let finalMessage = `System override successful. Welcome to the grid, ${name}. Sudeep has been notified of your entry.`;

    try {
      // 1. Personalized AI Greeting (Optional step, don't let it block the email)
      const apiKey = process.env.API_KEY;
      if (apiKey && apiKey !== "undefined") {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user named "${name}" has joined Sudeep's "Vibe Coding" waitlist. Generate a 1-sentence futuristic, cool thank you message. Mention Sudeep will reach out.`,
          });
          if (response.text) {
            finalMessage = response.text;
          }
        } catch (aiErr) {
          console.warn("AI Personalization skipped (likely API key issue):", aiErr);
        }
      } else {
        console.log("No API Key detected. Using standard protocol message.");
      }

      // 2. FormSubmit AJAX Call
      // Added _captcha: false to prevent AJAX blocking
      const emailResponse = await fetch("https://formsubmit.co/ajax/sudeepsr52@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            _subject: `🚀 New Vibe Coder: ${name}`,
            _captcha: "false",
            _template: "table",
            message: `${name} (${email}) has joined the Vibe Coding waitlist.`
        })
      });

      const data = await emailResponse.json();

      if (emailResponse.ok && data.success === "true") {
        setConfirmationMessage(finalMessage);
        setStatus('success');
        setName('');
        setEmail('');
        console.log("Submission successful. NOTE: If this is your first time deploying to this domain, check sudeepsr52@gmail.com for an activation email from FormSubmit!");
      } else {
        throw new Error(data.message || "FormSubmit rejected the request.");
      }
    } catch (err) {
      console.error('Vibe Submission Failure:', err);
      setStatus('error');
    }
  };

  return (
    <section className={`py-32 px-6 relative overflow-hidden ${isLightOn ? 'bg-zinc-200/30' : 'bg-black'}`}>
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
          A revolutionary digital ecosystem where creative expression meets high-performance engineering.
        </p>

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
                <h3 className="text-2xl font-bold mb-4 italic">ACCESS GRANTED</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {confirmationMessage}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest border-t border-zinc-800 pt-4">
                  <ShieldCheck size={12} /> Secure Protocol Verified
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
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
                        isLightOn ? 'bg-white border-zinc-200 text-black' : 'bg-zinc-900/80 border-zinc-800 text-white'
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
                        placeholder="vibe@engineer.com" 
                        className={`w-full pl-12 pr-6 py-4 rounded-full border focus:outline-none focus:border-cyan-500 transition-colors ${
                          isLightOn ? 'bg-white border-zinc-200 text-black' : 'bg-zinc-900/80 border-zinc-800 text-white'
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
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-red-500 text-[10px] font-mono mt-4 uppercase justify-center"
                    >
                      <AlertCircle size={12} /> Transmission failed. Use manual email: sudeepsr52@gmail.com
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className={`relative px-12 py-6 rounded-full border-2 border-cyan-500 font-black text-2xl md:text-3xl tracking-[0.2em] uppercase italic ${
            isLightOn ? 'bg-white text-zinc-900' : 'bg-black text-cyan-500'
          }`}>
            Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
};
