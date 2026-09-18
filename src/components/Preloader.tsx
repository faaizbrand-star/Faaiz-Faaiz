import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Terminal } from 'lucide-react';

interface PreloaderProps {
  brandName: string;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ brandName, onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('CALIBRATING MARKET ORACLE...');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      setIsVisible(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText('INITIALIZING ORDERFLOW LIQUIDITY ENGINE...');
    }, 280);

    const timer2 = setTimeout(() => {
      setProgress(86);
      setStatusText('VERIFYING RISK & INVALIDATION FRAMEWORKS...');
    }, 620);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('TERMINAL READY');
    }, 950);

    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="site-preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#123D32] text-[#D6F0E5] px-4 select-none"
      >
        {/* Subtle background glow */}
        <div className="absolute w-96 h-96 bg-[#F2D231]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full">
          {/* Logo Mark */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1E5747] border border-[#F2D231]/40 flex items-center justify-center shadow-[0_0_20px_rgba(242,210,49,0.25)]">
              <span className="font-serif-italic text-[#F2D231] text-2xl font-bold">F</span>
            </div>
            <span className="text-2xl font-serif-italic font-bold tracking-wider text-white">
              Faaiz<span className="text-[#F2D231]">Durrani</span>
            </span>
          </div>

          <p className="text-xs font-spacemono text-[#D4B22A] tracking-widest uppercase mb-6 flex items-center gap-2 font-bold">
            <span className="edot" />
            Pakistan's Real Crypto Educator
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-[#194C3D] border border-[#F2D231]/20 rounded-full h-1.5 p-0.5 mb-3 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#F2D231] to-[#FFE873] rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Status Label */}
          <div className="w-full flex items-center justify-between text-[11px] font-spacemono text-[#BFE5D5]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5FC98A] animate-ping" />
              {statusText}
            </span>
            <span>{progress}%</span>
          </div>

          {/* Trust line */}
          <div className="mt-8 flex items-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Disciplined Risk &bull; Probabilistic Clarity</span>
          </div>

          {/* Skip Button for quick entry */}
          <button
            id="preloader-skip-btn"
            onClick={() => {
              setIsVisible(false);
              onComplete();
            }}
            className="mt-6 text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition-colors underline underline-offset-4"
          >
            Skip loading &rarr;
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
