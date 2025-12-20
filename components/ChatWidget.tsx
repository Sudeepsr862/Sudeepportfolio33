
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Command, RotateCcw, ChevronRight, Loader2, Key, AlertCircle } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

interface Props {
  isLightOn: boolean;
}

const SUGGESTED_PROMPTS = [
  "What are Sudeep's top skills?",
  "Tell me about 'Vibe Coding'.",
  "How can I contact Sudeep?",
  "Show me his creative projects."
];

export const ChatWidget: React.FC<Props> = ({ isLightOn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Yo! I'm Sudeep's digital twin. What's the vibe today?" }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, isOpen]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setConnectionError(null);
    }
  };

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input.trim();
    if (!textToSend || isStreaming) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsStreaming(true);
    setConnectionError(null);

    try {
      // Check if environment requires manual key selection for Gemini 3 models
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Proceed assuming selection was successful as per instructions
        }
      }

      // 1. Create fresh instance right before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 2. Create chat session
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Sudeep AI, the digital assistant for Sudeep SR's portfolio.
          Tone: Futuristic, energetic, "vibe-focused". 
          Context: Sudeep is 18, studying AIML at MITK Udupi. Vibe Coder, Artist, Video Editor.
          Rules: Responses under 2 sentences. Be concise. Contact: sudeepsr52@gmail.com.`,
        },
        // Pass history to maintain context if needed
        history: messages.map(m => ({
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
      
      let msg = "Connection to the Vibe Grid lost. ";
      
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        msg = "Model endpoint not found. Please re-authenticate your API key.";
        setConnectionError("auth");
      } else if (error.message?.includes("403") || error.message?.includes("API_KEY_INVALID")) {
        msg = "Invalid API Key. Please select a valid key.";
        setConnectionError("auth");
      } else if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
        msg = "API Key missing. Please select a key in the AI Studio settings.";
        setConnectionError("auth");
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: msg 
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Memory cleared. How can I help you now?" }]);
    setConnectionError(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] sm:bottom-10 sm:right-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            className={`mb-6 w-[calc(100vw-3rem)] sm:w-[440px] h-[650px] max-h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] border ${
              isLightOn ? 'bg-white/95 border-zinc-200 shadow-zinc-200/50' : 'bg-[#0a0a0a]/95 border-white/10 shadow-black'
            } backdrop-blur-2xl`}
          >
            {/* Header */}
            <div className={`p-6 flex justify-between items-center border-b ${isLightOn ? 'border-zinc-100' : 'border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center p-[2px]">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLightOn ? 'bg-white' : 'bg-[#0a0a0a]'}`}>
                      <Sparkles size={24} className="text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <h4 className={`font-black text-lg tracking-tight ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>SUDEEP AI</h4>
                  <div className="flex items-center gap-1.5 opacity-50 font-mono text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ONLINE
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} title="Reset Conversation" className={`p-2 rounded-xl transition-colors ${isLightOn ? 'hover:bg-zinc-100' : 'hover:bg-white/5'}`}>
                  <RotateCcw size={18} className="opacity-40" />
                </button>
                <button onClick={() => setIsOpen(false)} className={`p-2 rounded-xl transition-colors ${isLightOn ? 'hover:bg-zinc-100' : 'hover:bg-white/5'}`}>
                  <X size={20} className="opacity-40" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth">
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : (isLightOn ? 'bg-zinc-100 text-zinc-800 rounded-tl-none shadow-sm' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5')}`}>
                      {m.content || <div className="flex gap-1 py-1"><div className="w-1 h-1 bg-current rounded-full animate-bounce" /><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
                      
                      {/* Error Recovery Button */}
                      {m.role === 'assistant' && connectionError === 'auth' && i === messages.length - 1 && (
                        <button 
                          onClick={handleOpenSelectKey}
                          className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                        >
                          <Key size={12} /> Re-authenticate API Key
                        </button>
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
                        isLightOn ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-white/5 border-white/10 text-white/60 hover:border-blue-500'
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              
              <div className={`relative flex items-center rounded-3xl border transition-all px-4 py-1.5 ${isLightOn ? 'bg-zinc-50 border-zinc-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-50' : 'bg-white/5 border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10'}`}>
                <Command size={16} className="opacity-30 mr-2" />
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask something..."
                  className={`flex-1 bg-transparent border-none focus:outline-none py-3 text-sm ${isLightOn ? 'text-zinc-900' : 'text-white'}`}
                />
                <button 
                  onClick={() => handleSend()} disabled={!input.trim() || isStreaming}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 ${isStreaming ? 'animate-pulse bg-blue-500/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}
                >
                  {isStreaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
              <div className="mt-4 text-center">
                <span className="text-[9px] font-mono opacity-20 uppercase tracking-[0.3em]">
                  Sudeep OS v2.1 • Digital Twin Interface
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: isOpen ? -90 : 0 }} whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative transition-all duration-500 overflow-hidden ${isOpen ? 'bg-zinc-900 text-white' : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white'}`}
      >
        {isOpen ? <X size={32} /> : <Sparkles size={32} />}
        {!isOpen && <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />}
      </motion.button>
    </div>
  );
};
