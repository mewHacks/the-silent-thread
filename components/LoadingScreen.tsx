
import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';

interface LoadingScreenProps {
    onComplete: () => void;
}

const BOOT_LOGS = [
    "INITIALIZING_CORTEX...",
    "MOUNTING_VOLUME: MEMORY_089",
    "BYPASSING_TRAUMA_GATES...",
    "ERROR: SEGMENT_FAULT AT 0x000000",
    "RETRYING_CONNECTION...",
    "THE_SEAMSTRESS_PROTOCOL: ACTIVE",
    "LOADING_ASSETS: FEAR.DAT",
    "STITCHING_REALITY...",
    "WAKE_UP_WAKE_UP_WAKE_UP",
    "SYNCHRONIZATION_COMPLETE"
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [glitchActive, setGlitchActive] = useState(false);
    
    // Audio ref simulation (visual only)
    const [audioBars, setAudioBars] = useState<number[]>(new Array(10).fill(10));

    useEffect(() => {
        // Progress Logic
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Non-linear progress for realism (fast start, slow middle, fast end)
                const increment = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 2 : 1;
                return Math.min(100, prev + increment);
            });
        }, 80);

        // Completion trigger
        if (progress >= 100) {
            const timeout = setTimeout(onComplete, 1200); // Slight hang at 100%
            return () => clearTimeout(timeout);
        }

        return () => clearInterval(interval);
    }, [progress, onComplete]);

    // System Log Logic
    useEffect(() => {
        if (progress > 0 && progress % 10 === 0) {
            const nextLog = BOOT_LOGS[Math.floor((progress / 100) * BOOT_LOGS.length)] || "PROCESSING...";
            setLogs(prev => [...prev.slice(-4), `> ${nextLog}`]); // Keep last 5 logs
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 150);
        }
    }, [progress]);

    // Audio Bar / Noise Animation
    useEffect(() => {
        const interval = setInterval(() => {
            setAudioBars(prev => prev.map(() => Math.floor(Math.random() * 100)));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black z-50 overflow-hidden cursor-wait font-mono">
            
            {/* --- ATMOSPHERIC BACKGROUND LAYERS --- */}
            
            {/* 1. Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }} 
            />
            
            {/* 2. CRT Scanlines */}
            <div className="absolute inset-0 z-10 opacity-30 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            
            {/* 3. Vignette */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

            {/* --- CONTENT --- */}

            <div className={`relative z-20 flex flex-col items-center w-full max-w-lg p-8 transition-all duration-100 ${glitchActive ? 'translate-x-1 opacity-90' : ''}`}>
                
                {/* Logo Section */}
                <div className="relative mb-12">
                    <div className={`${glitchActive ? 'animate-pulse text-red-500' : 'text-stone-400'}`}>
                        <Logo size={96} spinning={true} />
                    </div>
                    {/* RGB Split Glitch Effect for Logo */}
                    {glitchActive && (
                        <>
                            <div className="absolute inset-0 text-red-500 opacity-50 translate-x-1 mix-blend-screen"><Logo size={96} /></div>
                            <div className="absolute inset-0 text-cyan-500 opacity-50 -translate-x-1 mix-blend-screen"><Logo size={96} /></div>
                        </>
                    )}
                </div>

                {/* Main Progress Bar */}
                <div className="w-full space-y-2 mb-8">
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                        <span>System_Integrity</span>
                        <span className={`${progress === 100 ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`}>
                            {progress < 100 ? `${progress}%` : "CRITICAL"}
                        </span>
                    </div>
                    
                    <div className="h-2 w-full bg-stone-900 border border-stone-800 relative overflow-hidden group">
                        {/* Fill */}
                        <div 
                            className={`h-full transition-all duration-150 ease-out relative
                                ${progress > 90 ? 'bg-red-700 shadow-[0_0_15px_red]' : 'bg-stone-200 shadow-[0_0_10px_cyan]'}
                            `}
                            style={{ width: `${progress}%` }}
                        >
                            {/* Scanning Head */}
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="w-full h-24 bg-black/50 border-t border-stone-800 p-4 font-mono text-[10px] leading-relaxed text-stone-400 shadow-inner flex flex-col justify-end">
                    {logs.map((log, i) => (
                        <div key={i} className={`${i === logs.length - 1 ? 'text-stone-100 animate-pulse' : 'opacity-50'} truncate`}>
                            {log}
                        </div>
                    ))}
                    {progress < 100 && <span className="animate-pulse">_</span>}
                </div>

                {/* Decorative Audio Bars */}
                <div className="flex gap-1 h-8 items-end mt-6 opacity-30">
                    {audioBars.map((h, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-stone-500 transition-all duration-75" 
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

            </div>

            {/* Subliminal Glitch Text Background */}
            <div className="absolute top-1/2 left-0 w-full text-center text-[12rem] font-bold text-stone-800 opacity-[0.02] pointer-events-none select-none overflow-hidden whitespace-nowrap blur-sm">
                {glitchActive ? "089" : "SILENT"}
            </div>
            
            {/* Version ID */}
            <div className="absolute bottom-4 right-4 text-[9px] text-stone-700 font-mono tracking-widest opacity-50">
                THREAD_OS v0.8.9 // BUILD: NIGHTMARE
            </div>

        </div>
    );
};

export default LoadingScreen;
