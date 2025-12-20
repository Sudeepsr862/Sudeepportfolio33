
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Zap, ShieldAlert, ChevronLeft, ChevronRight, Clock, AlertTriangle, Star } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const GameModal: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('spidey-high-score');
    return saved ? parseInt(saved) : 0;
  });

  // Refs for game engine to prevent re-renders restarting the loop
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);
  const moveState = useRef({ left: false, right: false });

  // Update React state from refs for HUD
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      setScore(scoreRef.current);
      setLevel(levelRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Persistent High Score Sync
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spidey-high-score', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let frameCount = 0;
    let screenShake = 0;

    const spidey = {
      x: canvas.offsetWidth / 2 - 22,
      y: canvas.offsetHeight - 120,
      width: 44,
      height: 60,
      targetX: canvas.offsetWidth / 2 - 22,
      lerpSpeed: 0.18,
    };

    let obstacles: any[] = [];
    const particles: any[] = [];
    const stars: any[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 1.5,
      speed: 0.5 + Math.random() * 0.5
    }));

    const keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const createExplosion = (x: number, y: number, color = '#ff3300') => {
      screenShake = 15;
      for (let i = 0; i < 20; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          color,
          size: Math.random() * 3 + 1
        });
      }
    };

    const spawnObstacle = () => {
      const s = scoreRef.current;
      const l = levelRef.current;
      const afterLevel2 = s >= 100;
      const speedMultiplier = afterLevel2 ? 1.8 : (1 + (l - 1) * 0.15);
      const baseSpeed = (3 + l * 0.5) * speedMultiplier;
      
      obstacles.push({
        x: Math.random() * (canvas.offsetWidth - 40),
        y: -60,
        width: 35,
        height: 35,
        speed: baseSpeed + (Math.random() * 2),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * (afterLevel2 ? 0.2 : 0.1),
        isAggressive: afterLevel2
      });
    };

    const drawSpiderMan = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + 22, y + 30);
      const bounce = Math.sin(Date.now() * 0.01) * 3;
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-15, 15 + bounce, 10, 15);
      ctx.fillRect(5, 15 + bounce, 10, 15);
      ctx.fillStyle = '#0033aa';
      ctx.fillRect(-12, -10 + bounce, 24, 25);
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-6, -10 + bounce, 12, 25);
      ctx.beginPath();
      ctx.fillStyle = '#cc0000';
      ctx.arc(0, -22 + bounce, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(-8, -25 + bounce);
      ctx.lineTo(-2, -22 + bounce);
      ctx.lineTo(-8, -19 + bounce);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -25 + bounce);
      ctx.lineTo(2, -22 + bounce);
      ctx.lineTo(8, -19 + bounce);
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      if (gameOverRef.current) return;

      if (screenShake > 0) screenShake *= 0.9;

      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.offsetHeight) s.y = 0;
      });

      const step = 8;
      if (keys['ArrowLeft'] || moveState.current.left) spidey.targetX -= step;
      if (keys['ArrowRight'] || moveState.current.right) spidey.targetX += step;
      
      spidey.targetX = Math.max(10, Math.min(canvas.offsetWidth - 55, spidey.targetX));
      spidey.x += (spidey.targetX - spidey.x) * spidey.lerpSpeed;

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.speed;
        obs.rotation += obs.rotationSpeed;

        const dx = (spidey.x + 22) - (obs.x + 17);
        const dy = (spidey.y + 30) - (obs.y + 17);
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 28) {
          createExplosion(obs.x + 17, obs.y + 17);
          gameOverRef.current = true;
          setGameOver(true);
        }

        if (obs.y > canvas.offsetHeight) {
          obstacles.splice(i, 1);
          scoreRef.current += 1;
          levelRef.current = Math.floor(scoreRef.current / 50) + 1;
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
      }

      frameCount++;
      const baseSpawnRate = Math.max(15, 60 - levelRef.current * 6);
      const finalSpawnRate = scoreRef.current >= 100 ? Math.max(8, baseSpawnRate - 25) : baseSpawnRate;
      
      if (frameCount % finalSpawnRate === 0) spawnObstacle();

      // Rendering
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.save();
      if (screenShake > 0.1) ctx.translate((Math.random()-0.5)*screenShake, (Math.random()-0.5)*screenShake);
      
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      ctx.fillStyle = '#fff';
      stars.forEach(s => { 
        ctx.globalAlpha = 0.3; 
        ctx.fillRect(s.x, s.y, s.size, s.size); 
      });
      ctx.globalAlpha = 1;

      obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x + 17, obs.y + 17);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = obs.isAggressive ? '#500' : '#222';
        ctx.fillRect(-12, -12, 24, 24);
        ctx.strokeStyle = obs.isAggressive ? '#ff0000' : '#444';
        ctx.lineWidth = obs.isAggressive ? 2 : 1;
        ctx.strokeRect(-12, -12, 24, 24);
        if (obs.isAggressive) {
           ctx.fillStyle = '#ff0000';
           ctx.beginPath();
           ctx.arc(0, 0, 4, 0, Math.PI * 2);
           ctx.fill();
        }
        ctx.restore();
      });

      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      drawSpiderMan(spidey.x, spidey.y);
      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver]);

  const resetGame = () => {
    scoreRef.current = 0;
    levelRef.current = 1;
    gameOverRef.current = false;
    setGameOver(false);
    setScore(0);
    setLevel(1);
    moveState.current = { left: false, right: false };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] overflow-hidden max-w-lg w-full h-[600px] max-h-[85vh] flex flex-col shadow-[0_30px_100px_rgba(220,38,38,0.2)]">
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-[#0a0a0a] z-[101]">
          <div className="flex items-center gap-3">
             <Clock className="text-red-500" size={18} />
             <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">TIME PASS</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-black overflow-hidden">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-[102] bg-black">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 text-yellow-500 font-mono text-xs uppercase tracking-widest mb-2">
                  <Star size={12} fill="currentColor" /> BEST: {highScore} <Star size={12} fill="currentColor" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tight">TIME PASS</h2>
              </div>
              <p className="mb-8 text-zinc-400 text-sm max-w-[250px]">Avoid falling debris. Difficulty spikes significantly after score 100.</p>
              <button 
                onClick={() => setGameStarted(true)} 
                className="px-12 py-4 bg-red-600 text-white rounded-full font-black shadow-lg hover:bg-red-500 transition-all uppercase tracking-wider"
              >
                START GAME
              </button>
            </div>
          ) : gameOver ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-center z-[103] p-10">
                <h2 className="text-5xl font-black text-red-600 mb-6 uppercase italic">FAILED</h2>
                <div className="space-y-1 mb-10">
                  <p className="text-white text-3xl font-black">SCORE: {score}</p>
                  <p className="text-yellow-500 font-mono text-sm tracking-widest uppercase">HIGHEST: {highScore}</p>
                </div>
                <button 
                  onClick={resetGame} 
                  className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black hover:scale-105 transition-transform"
                >
                  <RotateCcw size={18} /> PLAY AGAIN
                </button>
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} className="w-full h-full block touch-none" />
              
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                <div className="px-3 py-1 bg-black/80 rounded-lg border border-white/5 text-white font-mono text-[10px] uppercase tracking-widest flex flex-col gap-1">
                  <span>SCORE: {score}</span>
                  <span className="text-[8px] opacity-40">LVL: {level}</span>
                  <span className="text-[8px] text-yellow-500/60">BEST: {highScore}</span>
                </div>

                {score >= 100 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600 rounded-lg"
                  >
                    <AlertTriangle size={12} className="text-red-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-red-500 font-bold uppercase animate-pulse">OVERLOAD_MODE</span>
                  </motion.div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-6 flex justify-between px-10 pointer-events-none z-[106] opacity-30">
                <div className="flex flex-col items-start gap-1">
                   <span className="text-[10px] font-mono text-white tracking-[0.3em]">TAP_LEFT</span>
                   <div className="h-[2px] w-8 bg-red-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[10px] font-mono text-white tracking-[0.3em]">TAP_RIGHT</span>
                   <div className="h-[2px] w-8 bg-red-600" />
                </div>
              </div>

              <div className="absolute inset-0 flex select-none z-[105]">
                <div 
                  className="flex-1 active:bg-white/5 transition-colors"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); moveState.current.left = true; }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); moveState.current.left = false; }}
                  onPointerCancel={() => moveState.current.left = false}
                />
                <div 
                  className="flex-1 active:bg-white/5 transition-colors"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); moveState.current.right = true; }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); moveState.current.right = false; }}
                  onPointerCancel={() => moveState.current.right = false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
