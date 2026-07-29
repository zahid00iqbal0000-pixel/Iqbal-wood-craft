import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Award } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d0d] text-white overflow-hidden"
        >
          {/* Subtle Ambient Wood Texture & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg">
            {/* Logo Crest Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative p-2 rounded-2xl bg-gradient-to-b from-[#d4af37]/40 via-[#8b5a2b]/20 to-black shadow-[0_0_50px_rgba(212,175,55,0.25)] border border-[#d4af37]/30 mb-6"
            >
              <img
                src="/src/assets/images/iqbal_woodcraft_logo_1785234354516.jpg"
                alt="IQBAL WOODCRAFT"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-2xl border border-dashed border-[#d4af37]/40 pointer-events-none"
              />
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b8860b] uppercase font-serif"
            >
              IQBAL WOODCRAFT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-2 text-xs md:text-sm font-medium tracking-widest text-amber-200/80 uppercase"
            >
              Handcrafted Luxury Furniture & Chinioti Mastercraft
            </motion.p>

            {/* Quality Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 flex items-center justify-center gap-4 text-xs text-amber-300/70 border-t border-amber-900/40 pt-4 w-full"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>100% Solid Sheesham</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-amber-600" />
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>10 Year Warranty</span>
              </div>
            </motion.div>

            {/* Loader Bar */}
            <div className="mt-8 w-48 h-1 bg-amber-950 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-[#8b5a2b] via-[#d4af37] to-[#f8e7a1]"
              />
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                onComplete();
              }}
              className="mt-6 text-xs text-amber-400/60 hover:text-amber-200 underline tracking-wider"
            >
              Skip Intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
