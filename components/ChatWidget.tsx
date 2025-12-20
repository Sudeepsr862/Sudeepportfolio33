
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Command, RotateCcw, ChevronRight, Loader2, Key, AlertCircle, ExternalLink, Zap } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

interface Props {
  isLightOn: boolean;
}

const SUGGESTED_PROMPTS = [
  "What's your current vibe?",
  "Tell me about 'Vibe Coding'.",
  "How's the AIML journey going?",
  "Show me your creative side."
];

export const ChatWidget: React.FC<Props> = ({ isLightOn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, isSystem?: boolean}[]>([
    { role: 'assistant', content: "Yo! I'm Sudeep's digital twin. Ready to explore the grid? ⚡" }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, isOpen]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Per instructions: assume selection was successful and clear UI state
      setNeedsKey(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Vibe check passed! Try sending your message again. 🕸️", isSystem: true }]);
    }
  };

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input.trim();
    if (!textToSend || isStreaming) return;

    // Check for API key selection in AI Studio environment
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKey(true);
        await window.aistudio.openSelectKey();
        // Proceeding anyway to mitigate race condition as per guidelines
      }
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsStreaming(true);

    try {
      // Create fresh instance to ensure latest key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Sudeep's Digital Twin. 
          Identity: 18-year-old AIML student at MITK Udupi. Vibe Coder, Spider-Man fan, Artist.
          Tone: Gen-Z, futuristic, energetic, and highly creative. 
          Rules: Keep answers short (max 2 sentences). Use emojis like 🕸️, ⚡, 💻. 
          Personality: Confident but chill. You love talking about high-performance engineering and visual storytelling.`,
        },
        history: messages
          .filter(m => !m.isSystem)
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
      });

      const response = await chat.sendMessageStream({ message: textToSend });
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let fullText = '';
      for await (const chunk of response) {
        const chunkResponse = chunk as GenerateContentResponse;
        const chunkText = chunkResponse.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            const others = prev.slice(0, -1);
            return [...others, { ...last, content: fullText }];
          });
        }
      }
    } catch (error: any) {
      console.error("Vibe Grid Connection Error:", error);
      
      if (error.message?.includes("not found") || error.message?.includes("API_KEY_INVALID")) {
        setNeedsKey(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "API Key missing or invalid. Please select a paid API key to continue the conversation. 🕸️",
          isSystem: true 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "The Vibe Grid is flickering... check your connection and try again. ⚡",
          isSystem: true
        }]);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] sm:bottom-10 sm:right-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`mb-6 w-[calc(100vw-3rem)] sm:w-[440px] h-[650px] max-h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] border ${
              isLightOn ? 'bg-white/95 border-zinc-200' : 'bg-[#0a0a0a]/95 border-white/10'
            } backdrop-blur-2xl`}
          >
            {/* Header */}
            <div className={`p-6 flex justify-between items-center border-b ${isLightOn ? 'border-zinc-100' : 'border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-blue-600 to-indigo-600 flex items-center justify-center p-[2px]">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLightOn ? 'bg-white' : 'bg-[#0a0a0a]'}`}>
                      <Zap size={24} className="text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <h4 className={`font-black text-lg tracking-tight ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>SUDEEP AI</h4>
                  <div className="flex items-center gap-1.5 opacity-50 font-mono text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> ONLINE
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={`p-2 rounded-xl transition-colors ${isLightOn ? 'hover:bg-zinc-100' : 'hover:bg-white/5'}`}>
                <X size={20} className="opacity-40" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-zinc-800 text-white' : (m.isSystem ? 'bg-zinc-900 text-red-500 border border-red-500/20' : 'bg-red-600 text-white')}`}>
                    {m.role === 'user' ? <User size={16} /> : (m.isSystem ? <AlertCircle size={16} /> : <Zap size={16} />)}
                  </div>
                  <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : (isLightOn ? 'bg-zinc-100 text-zinc-800 rounded-tl-none' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5')}`}>
                      {m.content || <div className="flex gap-1 py-1"><div className="w-1 h-1 bg-current rounded-full animate-bounce" /><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
                      
                      {m.isSystem && i === messages.length - 1 && (
                        <div className="mt-4 flex flex-col gap-3">
                          <button 
                            onClick={handleOpenSelectKey}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-bold hover:bg-red-500 transition-all uppercase tracking-widest shadow-lg shadow-red-600/20"
                          >
                            <Key size={12} /> Re-authenticate API Key
                          </button>
                          <a 
                            href="https://ai.google.dev/gemini-api/docs/billing" 
                            target="_blank" 
                            className="text-[9px] opacity-40 hover:opacity-100 underline text-center flex items-center justify-center gap-1"
                          >
                            <ExternalLink size={10} /> View Billing Requirements
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Footer */}
            <div className={`p-6 border-t ${isLightOn ? 'border-zinc-100 bg-white' : 'border-white/5 bg-[#0a0a0a]'}`}>
              {!isStreaming && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSend(prompt)} 
                      className={`text-[10px] px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                        isLightOn ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-white/5 border-white/10 text-white/60 hover:border-red-500'
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              
              <div className={`relative flex items-center rounded-3xl border transition-all px-4 py-1.5 ${isLightOn ? 'bg-zinc-50 border-zinc-200 focus-within:border-red-500' : 'bg-white/5 border-white/10 focus-within:border-red-500/50'}`}>
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Talk to Sudeep's twin..."
                  className={`flex-1 bg-transparent border-none focus:outline-none py-3 text-sm ${isLightOn ? 'text-zinc-900' : 'text-white'}`}
                />
                <button 
                  onClick={() => handleSend()} disabled={!input.trim() || isStreaming}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isStreaming ? 'animate-pulse bg-red-500/20' : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20'}`}
                >
                  {isStreaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative overflow-hidden transition-all ${isOpen ? 'bg-zinc-900 text-white' : 'bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white'}`}
      >
        {isOpen ? <X size={32} /> : <Sparkles size={32} />}
      </motion.button>
    </div>
  );
};
