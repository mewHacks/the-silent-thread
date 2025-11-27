
import React, { useRef, useEffect, useState } from 'react';
import { SkipForward } from 'lucide-react';
import Typewriter from './Typewriter';

interface CinematicPlayerProps {
  src: string;
  onComplete: () => void;
  volume: number;
  text?: string;
}

const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ src, onComplete, volume, text }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
        // We rely on App.tsx to handle BGM/Voice, so we mute the video track to avoid conflicts
        videoRef.current.volume = 0; 
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.warn("Video autoplay blocked", e));
        }
    }
    
    // Delay text slightly for dramatic effect
    const timer = setTimeout(() => setShowText(true), 1500);
    return () => clearTimeout(timer);
  }, [src]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Loop progress visual just for effect, or clamp it
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleTextComplete = () => {
      // Wait 3 seconds after text finishes for user to read, then auto-advance
      setTimeout(() => {
          onComplete();
      }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Video Layer - Darkened for Text Readability */}
      <video 
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.4]"
        onTimeUpdate={handleTimeUpdate}
        playsInline
        autoPlay
        loop // Loop video so it acts as a background for the text
        muted // Mute video file audio, game audio is handled separately
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 scanlines opacity-30" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-[url('/THE_SILENT_THREAD/images/noise.svg')] opacity-15 mix-blend-overlay" />
      
      {/* Vignette Gradient to focus center */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_90%)]" />

      {/* Narrative Text Layer - No Box, Movie Style */}
      {text && showText && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 md:p-32 pointer-events-none">
            <div className="max-w-5xl w-full text-center">
                <Typewriter 
                    text={text} 
                    speed={45} 
                    onComplete={handleTextComplete}
                    className="font-serif text-2xl md:text-4xl text-stone-200 leading-loose tracking-[0.15em] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-shadow-horror animate-in fade-in duration-1000" 
                />
            </div>
        </div>
      )}

      {/* Minimal Progress Line (Decorative for loops) */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-stone-900 w-full z-20">
          <div className="h-full bg-stone-500/50 shadow-[0_0_10px_white] transition-all ease-linear" style={{ width: `${progress}%` }} />
      </div>

      {/* Skip Button - Minimalist */}
      <button 
        onClick={onComplete}
        className="absolute bottom-8 right-8 z-30 group flex items-center gap-3 text-stone-600 hover:text-stone-300 transition-colors uppercase tracking-[0.2em] text-[10px] font-mono border border-transparent hover:border-stone-800 px-4 py-2 hover:bg-black/50"
      >
        <span>Skip Sequence</span>
        <SkipForward size={12} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default CinematicPlayer;
