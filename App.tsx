
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Heart, Sparkles, Music, Star, Flower, Pause, Play, Volume2 } from 'lucide-react';
import { AppStage, UserContext } from './types';
import { generateRomanticLetter } from './services/geminiService';
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
];

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('QUESTION');
  const [context, setContext] = useState<UserContext>({
    isValentine: false
  });
  
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noPhraseIndex, setNoPhraseIndex] = useState(0);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentPraise, setCurrentPraise] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound effects logic
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
    } catch (e) {
      console.warn("Audio context failed", e);
    }
  };

  const playCelebrationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + start + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      
      playNote(523.25, 0, 0.4); // C5
      playNote(659.25, 0.1, 0.4); // E5
      playNote(783.99, 0.2, 0.4); // G5
      playNote(1046.50, 0.3, 0.6); // C6
    } catch (e) {
      console.warn("Audio context failed", e);
    }
  };

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleYes = async () => {
    playSparkle();
    setLoading(true);
    
    // Play the song "Perfect"
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay prevented:", err));
      setIsPlaying(true);
    }

    // Start generating early
    const letterPromise = generateRomanticLetter();
    
    setStage('PRE_CELEBRATION');
    triggerFireworks();
    playCelebrationSound();

    // Cycle through praise lines
    const praiseInterval = setInterval(() => {
      setCurrentPraise(prev => (prev + 1) % PRAISE_LINES.length);
    }, 1200);

    // After celebration, show the letter
    setTimeout(async () => {
      clearInterval(praiseInterval);
      try {
        const letter = await letterPromise;
        setContext(prev => ({ ...prev, isValentine: true, generatedLetter: letter }));
      } catch (err) {
        console.error(err);
      } finally {
        setStage('CELEBRATION');
        setLoading(false);
      }
    }, 6000);
  };

  const handleNoHover = () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;
    setNoButtonPos({ x, y });
    setNoPhraseIndex((prev) => (prev + 1) % NO_PHRASES.length);
    setYesButtonScale(prev => Math.min(prev + 0.15, 3.5));
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-rose-50">
      <FloatingHearts />
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src="https://efyewfqnrtbianfdcxnp.supabase.co/storage/v1/object/sign/storafe/perfect.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZGRiMTNlMS0wZTg1LTRhNTgtYWUzZS0zNTEzZDU0ZmJhNTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdG9yYWZlL3BlcmZlY3QubXAzIiwiaWF0IjoxNzcwMzkwNjMwLCJleHAiOjE3NzI5ODI2MzB9.h1KEinMC6xfe1Z3W00yiAiAaehEVWIh_vYbVZyfFIQ4" // Placeholder for romantic instrumental
        loop
      />

      {/* Music Player Widget */}
      {(stage === 'PRE_CELEBRATION' || stage === 'CELEBRATION') && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md border border-rose-100 rounded-2xl p-3 shadow-xl flex items-center gap-4 group transition-all hover:pr-6">
            <div className={`p-2 rounded-full ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Music size={20} />
            </div>
            <div className="hidden group-hover:block transition-all duration-300">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Now Playing</p>
              <p className="text-sm font-semibold text-slate-700 truncate w-32">Perfect - Ed Sheeran</p>
            </div>
            <button 
              onClick={toggleMusic}
              className="p-2 hover:bg-rose-50 rounded-full text-rose-500 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <main className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 z-10 border border-rose-100 transition-all duration-500 min-h-[500px] flex flex-col justify-center">
        
        {stage === 'QUESTION' && (
          <div className="text-center space-y-12 py-10 animate-fadeIn">
            <div className="inline-block p-4 bg-rose-100 rounded-full animate-float mb-4 self-center">
              <Heart className="text-rose-500 fill-rose-500" size={48} />
            </div>
            <h2 className="text-5xl md:text-7xl font-cursive text-rose-600 animate-pulse px-4 leading-tight">
              Will you be my Valentine?
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative mt-12">
              <button
                onClick={handleYes}
                disabled={loading}
                style={{ transform: `scale(${yesButtonScale})` }}
                className="px-12 py-6 bg-rose-500 hover:bg-rose-600 text-white text-2xl font-bold rounded-2xl shadow-xl shadow-rose-300 transition-all duration-300 z-30 active:scale-95"
              >
                {loading ? 'Celebration time!' : 'YES! ❤️'}
              </button>
              
              <button
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                style={{ 
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                  transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-600 text-lg font-semibold rounded-xl whitespace-nowrap z-20 shadow-sm"
              >
                {NO_PHRASES[noPhraseIndex]}
              </button>
            </div>
            
            <p className="text-slate-400 text-sm italic mt-12">Hint: The "Yes" button is feeling very confident! 😉</p>
          </div>
        )}

        {stage === 'PRE_CELEBRATION' && (
          <div className="text-center space-y-8 py-10 animate-fadeIn relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <Flower className="text-rose-400 animate-spin-slow" size={200} />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-center gap-4">
                <Flower className="text-rose-400 animate-bounce delay-100" size={32} />
                <Flower className="text-rose-500 animate-bounce delay-300" size={48} />
                <Flower className="text-rose-400 animate-bounce delay-500" size={32} />
              </div>

              <h2 className="text-4xl md:text-5xl font-logo text-rose-600 transition-all duration-500 transform scale-110">
                {PRAISE_LINES[currentPraise]}
              </h2>

              <div className="py-8 space-y-4">
                <p className="text-xl md:text-2xl font-cursive text-rose-700 italic opacity-80 animate-pulse">
                  "Baby, I'm dancing in the dark, with you between my arms..."
                </p>
                <div className="flex items-center justify-center gap-2 text-rose-400">
                  <Volume2 size={16} className={isPlaying ? "animate-pulse" : ""} />
                  <span className="text-sm font-semibold tracking-widest uppercase">Perfect - Ed Sheeran</span>
                </div>
              </div>

              <div className="flex justify-center gap-8">
                <Sparkles className="text-amber-400 animate-ping" size={24} />
                <Star className="text-amber-300 animate-pulse" size={24} />
                <Sparkles className="text-amber-400 animate-ping delay-700" size={24} />
              </div>
            </div>
          </div>
        )}

        {stage === 'CELEBRATION' && (
          <div className="text-center space-y-8 py-6 animate-fadeIn">
            <div className="relative inline-block">
              <Sparkles className="absolute -top-4 -right-4 text-amber-400 animate-spin-slow" size={32} />
              <div className="p-6 bg-rose-100 rounded-3xl">
                <Heart className="text-rose-600 fill-rose-600 animate-bounce" size={64} />
              </div>
            </div>
            
            <h2 className="text-4xl font-logo text-rose-600">Yay! It's Official!</h2>
            
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                <Music size={24} className="text-rose-400" />
              </div>
              <p className="text-xl font-cursive leading-relaxed text-rose-800 whitespace-pre-wrap italic">
                "{context.generatedLetter || "You've made me the happiest person in the world! ❤️"}"
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => {
                  setStage('QUESTION');
                  setYesButtonScale(1);
                  setNoButtonPos({ x: 0, y: 0 });
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  setIsPlaying(false);
                }}
                className="py-3 px-8 text-rose-400 hover:text-rose-600 font-semibold transition-colors"
              >
                Ask again?
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="mt-8 text-rose-400 text-sm font-medium z-10 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
        Made with <Heart size={14} className="fill-rose-400" /> by surazy
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
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
