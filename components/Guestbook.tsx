
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

interface Props {
  isLightOn: boolean;
}

export const Guestbook: React.FC<Props> = ({ isLightOn }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sudeep-guestbook');
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
  }, []);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem('sudeep-guestbook', JSON.stringify(newComments));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      timestamp: Date.now(),
    };

    saveComments([newComment, ...comments]);
    setName('');
    setText('');
    setIsFormOpen(false);
  };

  const deleteComment = (id: string) => {
    saveComments(comments.filter(c => c.id !== id));
  };

  return (
    <section className={`py-8 px-6 border-t ${isLightOn ? 'bg-zinc-100/30 border-zinc-200' : 'bg-black border-white/5'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare size={14} className="text-red-500" />
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLightOn ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Vibe Feed
              </h4>
            </div>
            
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                isFormOpen 
                  ? 'border-red-500 text-red-500' 
                  : 'border-zinc-800 text-zinc-500 hover:border-red-500 hover:text-red-500'
              }`}
            >
              {isFormOpen ? 'Cancel' : 'Sign Grid 🕸️'}
            </button>
          </div>

          {/* Compact Form */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`sm:w-32 px-4 py-2 rounded-xl text-[11px] outline-none transition-all ${
                      isLightOn ? 'bg-white border border-zinc-200 focus:border-red-500' : 'bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Drop a vibe..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-xl text-[11px] outline-none transition-all ${
                      isLightOn ? 'bg-white border border-zinc-200 focus:border-red-500' : 'bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    Post <Send size={10} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Small Comment Display */}
          <div className="flex flex-wrap gap-2">
            {comments.length === 0 ? (
              <span className="text-[10px] opacity-20 italic">No one has visited the grid yet...</span>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    isLightOn ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-white/5'
                  }`}
                >
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter flex items-center gap-1">
                    <User size={8} /> {comment.name}
                  </span>
                  <div className={`w-[1px] h-3 ${isLightOn ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                  <span className={`text-[10px] ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {comment.text}
                  </span>
                  
                  <button 
                    onClick={() => deleteComment(comment.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={8} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
