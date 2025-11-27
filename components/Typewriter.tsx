/// <reference lib="dom" />
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 20, onComplete, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Clear interval safely
  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Called when finished typing
  const finishTyping = () => {
    clearTimer();
    setDisplayedText(text);
    setIsComplete(true);
    onComplete?.();
  };

  // Restart animation whenever text changes
  useEffect(() => {
    clearTimer();
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    // If text is empty or speed is invalid, just show immediately
    if (!text || speed <= 0) {
      finishTyping();
      return;
    }

    timerRef.current = window.setInterval(() => {
      const i = indexRef.current;

      // Safety guard: stop if text shortens or changes mid-typing
      if (i >= text.length) {
        finishTyping();
        return;
      }

      setDisplayedText(prev => prev + text[i]);
      indexRef.current++;
    }, speed);

    return () => clearTimer();
  }, [text, speed]);

  // User can click to instantly complete
  const handleClick = () => {
    if (!isComplete) finishTyping();
  };

  return (
    <div onClick={handleClick} className={`cursor-pointer min-h-[1.5em] ${className}`}>
      {displayedText}
      {!isComplete && <span className="animate-pulse ml-1 inline-block opacity-70 text-stone-500">|</span>}
    </div>
  );
};

export default Typewriter;
