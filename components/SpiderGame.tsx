
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Zap, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const moveState = useRef({ left: false, right: false });

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

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // High DPI Support
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
    let lastTime = 0;
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

    const obstacles: any[] = [];
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
      const baseSpeed = 3 + level * 0.5;
      obstacles.push({
        x: Math.random() * (canvas.offsetWidth - 40),
        y: -60,
        width: 35,
        height: 35,
        speed: baseSpeed + (Math.random() * 2),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    };

    const drawSpiderMan = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + 22, y + 30);
      const bounce = Math.sin(Date.now() * 0.01) * 3;
      
      // Body
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-15, 15 + bounce, 10, 15);
      ctx.fillRect(5, 15 + bounce, 10, 15);
      ctx.fillStyle = '#0033aa';
      ctx.fillRect(-12, -10 + bounce, 24, 25);
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-6, -10 + bounce, 12, 25);
      
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
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -25 + bounce);
      ctx.lineTo(2, -22 + bounce);
      ctx.lineTo(8, -19 + bounce);
      ctx.fill();

      ctx.restore();
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (screenShake > 0) screenShake *= 0.9;

      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.offsetHeight) s.y = 0;
      });

      // Move logic - Normalized for all devices
      const step = 8;
      if (keys['ArrowLeft'] || moveState.current.left) spidey.targetX -= step;
      if (keys['ArrowRight'] || moveState.current.right) spidey.targetX += step;
      
      spidey.targetX = Math.max(10, Math.min(canvas.offsetWidth - 55, spidey.targetX));
      spidey.x += (spidey.targetX - spidey.x) * spidey.lerpSpeed;

      obstacles.forEach((obs, index) => {
        obs.y += obs.speed;
        obs.rotation += obs.rotationSpeed;

        // Simple Circle Collision
        const dx = (spidey.x + 22) - (obs.x + 17);
        const dy = (spidey.y + 30) - (obs.y + 17);
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 28) {
          createExplosion(obs.x + 17, obs.y + 17);
          setGameOver(true);
        }

        if (obs.y > canvas.offsetHeight) {
          obstacles.splice(index, 1);
          setScore(prev => prev + 1);
        }
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
      });

      frameCount++;
      const spawnRate = Math.max(20, 60 - level * 5);
      if (frameCount % spawnRate === 0) spawnObstacle();

      // Draw
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.save();
      if (screenShake > 0.1) ctx.translate((Math.random()-0.5)*screenShake, (Math.random()-0.5)*screenShake);
      
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      ctx.fillStyle = '#fff';
      stars.forEach(s => { ctx.globalAlpha = 0.3; ctx.fillRect(s.x, s.y, s.size, s.size); });
      ctx.globalAlpha = 1;

      obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x + 17, obs.y + 17);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = '#222';
        ctx.fillRect(-12, -12, 24, 24);
        ctx.strokeStyle = '#f00';
        ctx.strokeRect(-12, -12, 24, 24);
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

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, level]);

  const resetGame = () => {
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
      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] overflow-hidden max-w-lg w-full h-[600px] max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-[#0a0a0a] z-[101]">
          <div className="flex items-center gap-3">
             <ShieldAlert className="text-red-500" size={18} />
             <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">SPIDER-PROTOCOL</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-black overflow-hidden">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-[102] bg-black">
              <h2 className="text-3xl font-black mb-4 text-white uppercase italic">READY UP</h2>
              <p className="mb-8 text-zinc-400 text-sm">Tap sides of the screen or use arrow keys.</p>
              <button 
                onClick={() => setGameStarted(true)} 
                className="px-12 py-4 bg-red-600 text-white rounded-full font-black shadow-lg hover:bg-red-500 transition-all"
              >
                ENGAGE
              </button>
            </div>
          ) : gameOver ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-center z-[103]">
                <h2 className="text-4xl font-black text-red-600 mb-8 uppercase italic">FAILED</h2>
                <p className="text-white text-2xl font-black mb-10">SCORE: {score}</p>
                <button 
                  onClick={resetGame} 
                  className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black hover:scale-105 transition-transform"
                >
                  <RotateCcw size={18} /> RETRY
                </button>
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} className="w-full h-full block touch-none" />
              
              {/* HUD */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <div className="px-3 py-1 bg-black/80 rounded-lg border border-white/5 text-white font-mono text-[10px]">
                  DATA: {score}
                </div>
              </div>

              {/* Controls Overlay - Universal Pointer Support */}
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
