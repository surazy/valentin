
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Heart, Sparkles, Music, Star, Flower, Pause, Play, Volume2, Flame, Candy, Gift } from 'lucide-react';
import { AppStage, UserContext } from './types';
import FloatingHearts from './components/FloatingHearts';
import confetti from 'canvas-confetti';

const NO_PHRASES = [
  "No way 💔",
  "Are you sure?",
  "Really sure??",
  "Think again! 🥺",
  "Last chance...",
  "Surely not?",
  "You're breaking my heart!",
  "Pwease? 👉👈",
  "I'll be very sad...",
  "Wrong button!",
  "I'm telling mom!",
  "Wait, reconsider!",
];

const PRAISE_LINES = [
  "You're absolutely stunning!",
  "The best decision ever!",
  "You've made my heart skip a beat!",
  "Simply perfect in every way!",
  "You're my favorite person!",
  "My world is brighter with you!",
];

const STATIC_LOVE_NOTE = `You’ve made me the happiest person in the world! Every moment with you feels like a beautiful dream, and I’m so lucky to have you in my life. You are my today, my tomorrow, and my forever Valentine. ❤️`;

// --- Enhanced CSS Animated Components ---

const FlowerItem: React.FC<{ type: 'rose' | 'tulip' | 'daisy', color: string, delay: string }> = ({ type, color, delay }) => (
  <div className={`flower-item flower-${type}`} style={{ animationDelay: delay }}>
    <div className="flower-head">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`petal p${i + 1}`} style={{ backgroundColor: color }}></div>
      ))}
      <div className="flower-center"></div>
    </div>
    <div className="flower-stem"></div>
    <div className="flower-leaf l1"></div>
    <div className="flower-leaf l2"></div>
  </div>
);

const CandleItem: React.FC<{ height: string, delay: string, color: string }> = ({ height, delay, color }) => (
  <div className="candle-item" style={{ height, animationDelay: delay }}>
    <div className="candle-body" style={{ background: `linear-gradient(to right, ${color}cc, ${color}, ${color}cc)` }}>
      <div className="candle-wick"></div>
      <div className="candle-flame"></div>
    </div>
    <div className="candle-glow"></div>
  </div>
);

const ChocolateItem: React.FC<{ shape: 'heart' | 'round' | 'square', delay: string }> = ({ shape, delay }) => (
  <div className={`choco-item choco-${shape}`} style={{ animationDelay: delay }}>
    <div className="choco-base">
      <div className="choco-drizzle"></div>
      <div className="choco-topping"></div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('QUESTION');
  const [finaleStep, setFinaleStep] = useState(0); 
  const [context, setContext] = useState<UserContext>({ isValentine: false });
  
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noPhraseIndex, setNoPhraseIndex] = useState(0);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [currentPraise, setCurrentPraise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSparkle = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { console.warn("Audio failed", e); }
  };

  const playBoomSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.log(e); }
  };

  const triggerFireworks = (intensity: 'low' | 'high' = 'low') => {
    if (intensity === 'high') {
      const count = 200;
      const defaults = { origin: { y: 0.7 }, colors: ['#f43f5e', '#fbbf24', '#ffffff', '#ec4899'] };
      function fire(ratio: number, opts: confetti.Options) {
        confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });
      }
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
      return;
    }
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti({ particleCount: 30, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 } });
      confetti({ particleCount: 30, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleYes = () => {
    playSparkle();
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log(err));
      setIsPlaying(true);
    }
    setStage('PRE_CELEBRATION');
    triggerFireworks();
    const praiseInterval = setInterval(() => {
      setCurrentPraise(prev => (prev + 1) % PRAISE_LINES.length);
    }, 3000);
    setTimeout(() => {
      clearInterval(praiseInterval);
      setContext({ isValentine: true });
      setStage('CELEBRATION');
    }, 15000);
  };

  useEffect(() => {
    if (stage === 'CELEBRATION') {
      const timer = setTimeout(() => {
        playBoomSound();
        triggerFireworks('high');
        setStage('GRAND_FINALE');
        setFinaleStep(0);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'GRAND_FINALE' && finaleStep < 3) {
      const stepTimer = setTimeout(() => {
        setFinaleStep(prev => prev + 1);
        playSparkle();
      }, 5000);
      return () => clearTimeout(stepTimer);
    }
  }, [stage, finaleStep]);

  const handleNoHover = () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;
    setNoButtonPos({ x, y });
    setNoPhraseIndex((prev) => (prev + 1) % NO_PHRASES.length);
    setYesButtonScale(prev => Math.min(prev + 0.15, 3.5));
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-rose-50">
      <FloatingHearts />
      <audio 
        ref={audioRef} 
        src="https://efyewfqnrtbianfdcxnp.supabase.co/storage/v1/object/sign/storafe/perfect.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZGRiMTNlMS0wZTg1LTRhNTgtYWUzZS0zNTEzZDU0ZmJhNTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdG9yYWZlL3BlcmZlY3QubXAzIiwiaWF0IjoxNzcwMzkwNjMwLCJleHAiOjE3NzI5ODI2MzB9.h1KEinMC6xfe1Z3W00yiAiAaehEVWIh_vYbVZyfFIQ4" 
        loop
      />

      {(stage !== 'QUESTION') && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md border border-rose-100 rounded-2xl p-3 shadow-xl flex items-center gap-4 group transition-all hover:pr-6">
            <div className={`p-2 rounded-full ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Music size={20} />
            </div>
            <div className="hidden group-hover:block transition-all duration-300">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Now Playing</p>
              <p className="text-sm font-semibold text-slate-700 truncate w-32">Perfect - Ed Sheeran</p>
            </div>
            <button onClick={toggleMusic} className="p-2 hover:bg-rose-50 rounded-full text-rose-500 transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}

      <main className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 z-10 border border-rose-100 transition-all duration-500 min-h-[600px] flex flex-col justify-center relative">
        {stage === 'QUESTION' && (
          <div className="text-center space-y-12 py-10 animate-fadeIn">
            <div className="inline-block p-4 bg-rose-100 rounded-full animate-float mb-4 self-center">
              <Heart className="text-rose-500 fill-rose-500" size={48} />
            </div>
            <h2 className="text-5xl md:text-7xl font-cursive text-rose-600 animate-pulse px-4 leading-tight">Will you be my Valentine?</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative mt-12">
              <button onClick={handleYes} style={{ transform: `scale(${yesButtonScale})` }} className="px-12 py-6 bg-rose-500 hover:bg-rose-600 text-white text-2xl font-bold rounded-2xl shadow-xl shadow-rose-300 transition-all duration-300 z-30 active:scale-95">YES! ❤️</button>
              <button onMouseEnter={handleNoHover} onClick={handleNoHover} style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`, transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' }} className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-600 text-lg font-semibold rounded-xl whitespace-nowrap z-20 shadow-sm">{NO_PHRASES[noPhraseIndex]}</button>
            </div>
            <p className="text-slate-400 text-sm italic mt-12">Hint: The "Yes" button is feeling very confident! 😉</p>
          </div>
        )}

        {stage === 'PRE_CELEBRATION' && (
          <div className="text-center space-y-8 py-10 animate-fadeIn">
            <div className="h-24 flex items-center justify-center">
              <h2 key={currentPraise} className="text-4xl md:text-5xl font-logo text-rose-600 animate-phraseTransition">{PRAISE_LINES[currentPraise]}</h2>
            </div>
            <div className="py-8 space-y-4">
              <p className="text-xl md:text-2xl font-cursive text-rose-700 italic opacity-80 animate-pulse">"Baby, I'm dancing in the dark, with you between my arms..."</p>
            </div>
          </div>
        )}

        {stage === 'CELEBRATION' && (
          <div className="text-center space-y-8 py-6 animate-fadeIn">
            <div className="p-6 bg-rose-100 rounded-3xl inline-block"><Heart className="text-rose-600 fill-rose-600 animate-bounce" size={64} /></div>
            <h2 className="text-4xl font-logo text-rose-600">Yay! It's Official!</h2>
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl shadow-inner italic">
              <p className="text-xl font-cursive leading-relaxed text-rose-800 whitespace-pre-wrap">"{STATIC_LOVE_NOTE}"</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 animate-pulse">
              <Sparkles size={16} /><span className="text-sm">Wait for the final surprise...</span>
            </div>
          </div>
        )}

        {stage === 'GRAND_FINALE' && (
          <div className="text-center space-y-8 py-4 animate-fadeIn">
             
             <div className="min-h-[350px] flex flex-col items-center justify-center overflow-hidden">
                {finaleStep === 0 && (
                  <div className="animate-revealStep flex flex-col items-center gap-8 w-full">
                    <div className="flex justify-center gap-12 h-40">
                      <FlowerItem type="rose" color="#fb7185" delay="0.1s" />
                      <FlowerItem type="daisy" color="#fef08a" delay="0.3s" />
                      <FlowerItem type="tulip" color="#f472b6" delay="0.5s" />
                      <FlowerItem type="rose" color="#e11d48" delay="0.7s" />
                    </div>
                    <h3 className="text-4xl font-cursive text-rose-600 animate-pulse">Flowers for your beauty...</h3>
                  </div>
                )}
                
                {finaleStep === 1 && (
                  <div className="animate-revealStep flex flex-col items-center gap-8 w-full">
                    <div className="flex items-end justify-center gap-10 h-40">
                      <CandleItem height="80px" color="#fed7aa" delay="0.1s" />
                      <CandleItem height="120px" color="#ffedd5" delay="0.3s" />
                      <CandleItem height="95px" color="#fed7aa" delay="0.5s" />
                    </div>
                    <h3 className="text-4xl font-cursive text-orange-600 animate-pulse">Candles for our spark...</h3>
                  </div>
                )}
                
                {finaleStep === 2 && (
                  <div className="animate-revealStep flex flex-col items-center gap-8 w-full">
                    <div className="grid grid-cols-3 gap-8 p-6 bg-amber-50 rounded-3xl border border-amber-200 shadow-inner">
                      <ChocolateItem shape="heart" delay="0.1s" />
                      <ChocolateItem shape="round" delay="0.3s" />
                      <ChocolateItem shape="square" delay="0.5s" />
                    </div>
                    <h3 className="text-4xl font-cursive text-amber-900 animate-pulse">Chocolates for the sweetness...</h3>
                  </div>
                )}
                
                {finaleStep === 3 && (
                  <div className="animate-revealStep flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-wrap justify-center gap-12 opacity-80 scale-90">
                      <FlowerItem type="rose" color="#fb7185" delay="0s" />
                      <CandleItem height="100px" color="#ffedd5" delay="0.2s" />
                      <ChocolateItem shape="heart" delay="0.4s" />
                    </div>
                    <h2 className="text-5xl font-logo text-rose-600 animate-bounce">The Perfect Valentine! 🎁</h2>
                    <p className="text-2xl font-cursive text-rose-800 max-w-lg">You make my heart full. Every single day.</p>
                  </div>
                )}
             </div>

             {finaleStep === 3 && (
               <div className="animate-fadeIn pt-10">
                 <button onClick={() => { setStage('QUESTION'); setFinaleStep(0); }} className="py-3 px-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all text-lg font-bold shadow-lg shadow-rose-200">
                   Back to start ❤️
                 </button>
               </div>
             )}
          </div>
        )}
      </main>

      <footer className="mt-8 text-rose-400 text-sm font-medium z-10 flex items-center gap-1 opacity-60">
        Made with <Heart size={14} className="fill-rose-400" /> by surazy
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes phraseTransition { 0% { opacity: 0; transform: scale(0.9); } 15%, 85% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.1); } }
        .animate-phraseTransition { animation: phraseTransition 3s infinite; }
        
        @keyframes revealStep {
          0% { opacity: 0; transform: scale(0.9) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-revealStep { animation: revealStep 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        /* --- Flower Garden Styles --- */
        .flower-item { position: relative; width: 60px; height: 140px; display: flex; flex-direction: column; align-items: center; opacity: 0; animation: flower-pop 0.8s forwards; }
        @keyframes flower-pop { to { opacity: 1; } }
        .flower-head { position: relative; width: 60px; height: 60px; animation: flower-sway 4s infinite alternate; }
        .petal { position: absolute; width: 30px; height: 30px; border-radius: 50% 50% 0 50%; transform-origin: bottom right; }
        .p1 { transform: rotate(0deg); } .p2 { transform: rotate(60deg); } .p3 { transform: rotate(120deg); } .p4 { transform: rotate(180deg); } .p5 { transform: rotate(240deg); } .p6 { transform: rotate(300deg); }
        .flower-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 18px; height: 18px; background: #fbbf24; border-radius: 50%; z-index: 5; }
        .flower-stem { width: 4px; height: 80px; background: #4ade80; border-radius: 2px; }
        .flower-leaf { position: absolute; width: 20px; height: 10px; background: #22c55e; border-radius: 0 100%; }
        .l1 { top: 80px; left: -10px; transform: rotate(-30deg); } .l2 { top: 95px; right: -10px; transform: rotate(150deg); }
        @keyframes flower-sway { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }

        /* --- Candle Glow Styles --- */
        .candle-item { width: 35px; position: relative; display: flex; align-items: flex-end; opacity: 0; animation: candle-reveal 1s forwards; }
        @keyframes candle-reveal { to { opacity: 1; } }
        .candle-body { width: 100%; height: 100%; border-radius: 4px 4px 2px 2px; position: relative; }
        .candle-wick { width: 2px; height: 8px; background: #333; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); }
        .candle-flame { width: 14px; height: 24px; background: linear-gradient(to bottom, #fff, #fb923c); border-radius: 50% 50% 20% 20%; position: absolute; top: -30px; left: 50%; transform: translateX(-50%); animation: candle-flicker 0.15s infinite alternate; box-shadow: 0 0 20px #fb923c; }
        @keyframes candle-flicker { 0% { opacity: 0.8; transform: translateX(-50%) scale(0.9); } 100% { opacity: 1; transform: translateX(-50%) scale(1.1) skewX(2deg); } }
        .candle-glow { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: radial-gradient(circle, rgba(251,146,60,0.4), transparent 70%); border-radius: 50%; }

        /* --- Chocolate Box Styles --- */
        .choco-item { width: 60px; height: 60px; position: relative; display: flex; align-items: center; justify-content: center; opacity: 0; animation: choco-reveal 0.8s forwards; }
        @keyframes choco-reveal { to { opacity: 1; } }
        .choco-base { width: 100%; height: 100%; background: #451a03; box-shadow: 2px 2px 10px rgba(0,0,0,0.3); position: relative; }
        .choco-heart .choco-base { transform: rotate(45deg); border-radius: 4px; }
        .choco-heart .choco-base::before, .choco-heart .choco-base::after { content: ""; position: absolute; width: 60px; height: 60px; background: #451a03; border-radius: 50%; }
        .choco-heart .choco-base::before { top: -30px; left: 0; }
        .choco-heart .choco-base::after { left: -30px; top: 0; }
        .choco-round .choco-base { border-radius: 50%; background: #5a2004; }
        .choco-square .choco-base { border-radius: 10px; background: #3c1402; }
        .choco-drizzle { position: absolute; width: 80%; height: 2px; background: rgba(255,255,255,0.2); top: 50%; left: 10%; transform: rotate(-45deg); box-shadow: 0 4px 0 rgba(255,255,255,0.1), 0 -4px 0 rgba(255,255,255,0.1); }
        .choco-topping { position: absolute; width: 10px; height: 10px; background: #92400e; border-radius: 50%; top: 20%; left: 20%; }
      `}</style>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
