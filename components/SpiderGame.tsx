
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Zap, ShieldAlert } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const GameModal: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('spidey-high-score');
    return saved ? parseInt(saved) : 0;
  });

  // Each level now requires 50 points to complete. 
  // At an average spawn rate of 1.2s, this makes each level roughly 60 seconds long.
  useEffect(() => {
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spidey-high-score', score.toString());
    }
  }, [score, level, highScore]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;
    let screenShake = 0;

    const spidey = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 44,
      height: 60,
      targetX: canvas.width / 2,
      speed: 0.18, // Slightly more responsive lerp
      animationTimer: 0
    };

    const obstacles: any[] = [];
    const particles: any[] = [];
    const stars: any[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speed: 0.4 + Math.random() * 0.8
    }));

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const createExplosion = (x: number, y: number, color = '#ff3300') => {
      screenShake = 15;
      for (let i = 0; i < 25; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          life: 1,
          color,
          size: Math.random() * 4 + 1
        });
      }
    };

    const spawnObstacle = () => {
      // EASIER LOGIC: Slower base speeds for levels 1-5
      const baseSpeed = level <= 5 
        ? 2.5 + level * 0.4  // Slow start
        : 4.5 + level * 0.6; // Difficulty spikes after level 5
        
      const isGlitch = level >= 4 && Math.random() > 0.92; // Rarer glitches in early game
      const isFast = level >= 3 && Math.random() > 0.94; // Rarer fast ones in early game
      
      obstacles.push({
        x: Math.random() * (canvas.width - 40),
        y: -60,
        width: 35,
        height: 35,
        speed: (isFast ? baseSpeed * 1.4 : baseSpeed) + (Math.random() * level * 0.15),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * (0.1 + level * 0.04),
        type: isGlitch ? 'glitch' : (isFast ? 'fast' : 'standard')
      });
    };

    const drawSpiderMan = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + 22, y + 30);
      
      const bounce = Math.sin(Date.now() * 0.01) * 3;

      // Legs (Boots)
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-15, 15 + bounce, 10, 15);
      ctx.fillRect(5, 15 + bounce, 10, 15);

      // Body (Blue/Red)
      ctx.fillStyle = '#0033aa';
      ctx.fillRect(-12, -10 + bounce, 24, 25);
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-6, -10 + bounce, 12, 25);
      
      // Arms
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-18, -5 + bounce, 6, 18);
      ctx.fillRect(12, -5 + bounce, 6, 18);

      // Head
      ctx.beginPath();
      ctx.fillStyle = '#cc0000';
      ctx.arc(0, -22 + bounce, 12, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(-8, -25 + bounce);
      ctx.lineTo(-2, -22 + bounce);
      ctx.lineTo(-8, -19 + bounce);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -25 + bounce);
      ctx.lineTo(2, -22 + bounce);
      ctx.lineTo(8, -19 + bounce);
      ctx.closePath();
      ctx.fill();

      // Spider Logo
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(0, 0 + bounce, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const update = () => {
      if (screenShake > 0) screenShake *= 0.9;

      stars.forEach(s => {
        s.y += s.speed * (1 + level * 0.15);
        if (s.y > canvas.height) s.y = 0;
      });

      const inputSpeed = level <= 5 ? 10 : 12 + level * 0.2; // Generous movement speed for early dodging
      if (keys['ArrowLeft']) spidey.targetX -= inputSpeed;
      if (keys['ArrowRight']) spidey.targetX += inputSpeed;
      
      spidey.targetX = Math.max(10, Math.min(canvas.width - 55, spidey.targetX));
      spidey.x += (spidey.targetX - spidey.x) * spidey.speed;

      obstacles.forEach((obs, index) => {
        obs.y += obs.speed;
        obs.rotation += obs.rotationSpeed;

        const dx = (spidey.x + 22) - (obs.x + 17);
        const dy = (spidey.y + 30) - (obs.y + 17);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Collision detection - slightly more forgiving for the first 5 levels
        const collisionRadius = level <= 5 ? 24 : 28;
        if (distance < collisionRadius) {
          createExplosion(obs.x + 17, obs.y + 17);
          setGameOver(true);
        }

        if (obs.y > canvas.height) {
          obstacles.splice(index, 1);
          setScore(prev => prev + 1);
        }
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.025;
        if (p.life <= 0) particles.splice(i, 1);
      });

      frameCount++;
      
      // EASIER LOGIC: Slower spawn intervals for first 5 levels
      // At level 1, interval is 70 frames (~1.1s). 
      // Decreases gradually to 38 frames (~0.6s) by level 5.
      const spawnInterval = level <= 5 
        ? Math.max(38, 70 - (level * 8)) 
        : Math.max(12, 30 - (level * 2));
        
      if (frameCount % spawnInterval === 0) spawnObstacle();
    };

    const draw = () => {
      ctx.save();
      if (screenShake > 0.1) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      stars.forEach(s => {
        ctx.globalAlpha = s.size / 2;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1;

      obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x + 17, obs.y + 17);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = obs.type === 'glitch' ? '#00f3ff' : '#333';
        ctx.fillRect(-12, -12, 24, 24);
        ctx.strokeStyle = '#f00';
        ctx.strokeRect(-12, -12, 24, 24);
        ctx.restore();
      });

      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      drawSpiderMan(spidey.x, spidey.y);
      ctx.restore();
    };

    const loop = () => {
      update();
      draw();
      if (!gameOver) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, level]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] overflow-hidden max-w-lg w-full">
        {/* Level Up Notification */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute top-24 left-0 right-0 z-[110] flex justify-center pointer-events-none"
            >
              <div className="bg-red-600 text-white px-8 py-3 rounded-full font-black text-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] italic uppercase tracking-tighter">
                PHASE {level} UNLOCKED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <ShieldAlert className="text-red-500" size={20} />
             <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">SPIDER-PROTOCOL</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-[4/5] bg-black">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <h2 className="text-4xl font-black mb-4 tracking-tighter text-white uppercase">SWING INTO ACTION</h2>
              <p className="mb-4 text-zinc-400 text-sm">Use Arrow Keys to dodge incoming obstacles.</p>
              <p className="mb-12 text-zinc-600 text-[10px] uppercase tracking-widest">Levels are 60 seconds long. Survive the training.</p>
              <button onClick={() => setGameStarted(true)} className="px-14 py-5 bg-red-600 text-white rounded-full font-black shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform active:scale-95">START MISSION</button>
            </div>
          ) : gameOver ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center">
                <h2 className="text-5xl font-black text-red-600 mb-8 uppercase italic">FAILED</h2>
                <div className="mb-10 text-white">
                  <p className="text-sm opacity-50 uppercase tracking-widest">Score</p>
                  <p className="text-4xl font-black">{score}</p>
                </div>
                <button onClick={resetGame} className="flex items-center gap-3 px-12 py-5 bg-white text-black rounded-full font-black hover:scale-105 transition-transform active:scale-95"><RotateCcw size={20} /> TRY AGAIN</button>
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} width={400} height={500} className="w-full h-full cursor-none" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="px-4 py-2 bg-black/80 rounded-2xl border border-white/5 text-white font-mono text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  DATA: {score}
                </div>
                <div className="px-4 py-2 bg-black/80 rounded-2xl border border-red-500/20 text-white font-mono text-xs flex items-center gap-2">
                  <ShieldAlert size={12} className="text-red-500" />
                  PHASE: {level}
                </div>
              </div>
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/80 rounded-2xl border border-white/5 text-zinc-500 font-mono text-[10px]">
                BEST: {highScore}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
