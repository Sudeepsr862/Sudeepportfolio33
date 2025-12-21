
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Trash2, Clock } from 'lucide-react';

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
    <section className={`py-12 px-6 border-t ${isLightOn ? 'bg-zinc-100/50 border-zinc-200' : 'bg-black/20 border-white/5'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h3 className={`text-xl font-bold flex items-center gap-2 justify-center md:justify-start ${isLightOn ? 'text-zinc-900' : 'text-white'}`}>
              <MessageSquare size={20} className="text-red-500" /> Guestbook
            </h3>
            <p className="text-xs opacity-50 mt-1 uppercase tracking-widest font-mono">Leave a mark on the grid</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              isFormOpen 
                ? 'bg-zinc-800 text-white' 
                : 'bg-red-600 text-white shadow-lg shadow-red-600/20'
            }`}
          >
            {isFormOpen ? 'Cancel' : 'Sign Guestbook 🕸️'}
          </motion.button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className={`mb-12 overflow-hidden p-6 rounded-2xl border ${isLightOn ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/50 border-zinc-800'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      isLightOn ? 'bg-zinc-50 border-zinc-200 focus:border-red-500' : 'bg-black/40 border-zinc-800 focus:border-red-600 text-white'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Drop a vibe..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      isLightOn ? 'bg-zinc-50 border-zinc-200 focus:border-red-500' : 'bg-black/40 border-zinc-800 focus:border-red-600 text-white'
                    }`}
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    Post <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comments.length === 0 ? (
            <div className="col-span-full py-8 text-center opacity-30 italic text-sm">
              The guestbook is empty. Be the first to sign.
            </div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex flex-col justify-between group transition-all ${
                  isLightOn ? 'bg-white border-zinc-200' : 'bg-zinc-950/40 border-white/5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-red-500 uppercase font-black tracking-tighter flex items-center gap-1">
                      <User size={10} /> {comment.name}
                    </span>
                    <button 
                      onClick={() => deleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLightOn ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    "{comment.text}"
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 opacity-20 text-[8px] font-mono uppercase">
                  <Clock size={8} /> {new Date(comment.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
