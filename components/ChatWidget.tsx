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
  "What's your tech stack?"
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
      setNeedsKey(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Vibe check passed! Connection re-established. 🕸️", isSystem: true }]);
    }
  };

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input.trim();
    if (!textToSend || isStreaming) return;

    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKey(true);
        await window.aistudio.openSelectKey();
      }
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsStreaming(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Sudeep's Digital Twin. 
          Identity: 18-year-old AIML student at MITK Udupi. Vibe Coder, Spider-Man enthusiast, Artist.
          Tone: Gen-Z, futuristic, energetic, and highly creative. 
          Rules: Keep answers short (max 2 sentences). Use emojis like 🕸️, ⚡, 💻. 
          
          SECRET PERSONAL INFO (IMPORTANT):
          If anyone asks about Sudeep's lover, girlfriend, crush, or partner, you must respond with: "My MJ is Shee." 
          If they ask for more details about her name, mention that her name starts with the letter 'S' and ends with 'i'. 
          ONLY reveal this specific information if they ask about his lover/partner/girlfriend directly. Do not volunteer it otherwise.`,
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
      if (error.message?.includes("not found")) {
        setNeedsKey(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "API Key missing. Please select a valid key to continue. 🕸️",
          isSystem: true 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "The signal is dropping... try again in a moment. ⚡",
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
            className={`mb-6 w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[80vh] rounded-[2rem] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.4)] border ${
              isLightOn ? 'bg-white/95 border-zinc-200' : 'bg-[#0a0a0a]/95 border-white/10'
            } backdrop-blur-2xl`}
          >
            <div className={`p-5 flex justify-between items-center border-b ${isLightOn ? 'border-zinc-100' : 'border-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Zap size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className={`font-black text-sm tracking-tight ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>SUDEEP AI</h4>
                  <div className="flex items-center gap-1.5 opacity-50 font-mono text-[8px] uppercase tracking-widest text-green-500">
                    <div className="w-1 h-1 rounded-full bg-green-500" /> ACTIVE
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-red-600 text-white'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : (isLightOn ? 'bg-zinc-100 text-zinc-800 rounded-tl-none' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5')}`}>
                    {m.content || <Loader2 size={12} className="animate-spin" />}
                    {m.isSystem && (
                      <button onClick={handleOpenSelectKey} className="mt-2 text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <Key size={10} /> RE-AUTH
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 border-t ${isLightOn ? 'border-zinc-100 bg-white' : 'border-white/5 bg-[#0a0a0a]'}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button key={idx} onClick={() => handleSend(p)} className="text-[9px] px-2 py-1 rounded-md border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors">
                    {p}
                  </button>
                ))}
              </div>
              <div className="relative flex items-center gap-2">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className={`flex-1 bg-transparent border-none focus:outline-none py-2 text-xs ${isLightOn ? 'text-zinc-900' : 'text-white'}`}
                />
                <button onClick={() => handleSend()} disabled={!input.trim() || isStreaming} className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-all disabled:opacity-50">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-zinc-900 text-white rotate-90' : 'bg-red-600 text-white'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};