import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingCompareBar: React.FC = () => {
  const { compareList, setIsCompareOpen, clearCompare, products } = useApp();

  if (compareList.length === 0) return null;

  const compareProducts = products.filter(p => compareList.includes(p.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 border border-[#d4af37]/60 backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 text-white max-w-xl w-[92vw]"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#d4af37] text-stone-950 rounded-xl font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-serif font-bold text-amber-200 block">
              Comparing ({compareList.length}/4 Models)
            </span>
            <div className="flex items-center gap-1.5 mt-1 overflow-x-auto">
              {compareProducts.map((p) => (
                <span
                  key={p.id}
                  className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono truncate max-w-[100px]"
                >
                  {p.code}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2 bg-[#d4af37] text-stone-950 hover:brightness-110 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={clearCompare}
            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
            title="Clear comparison list"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
