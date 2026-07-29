import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, ShoppingCart, ShieldCheck, Star, Truck, Award, Sparkles, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductComparisonModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareList,
    toggleCompare,
    clearCompare,
    products,
    addToCart,
    setSelectedProductId,
    setCurrentScreen
  } = useApp();

  if (!isCompareOpen) return null;

  const compareProducts = products.filter(p => compareList.includes(p.id));

  const handleBuyNow = (p: any) => {
    addToCart(p, 1);
    setIsCompareOpen(false);
    setCurrentScreen('cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] rounded-xl">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-black text-amber-100">
                  Royal Furniture Specification Comparison
                </h2>
                <p className="text-xs text-stone-400">
                  Side-by-side comparison of wood grade, dimensions, warranty, polish finish & pricing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs text-stone-400 hover:text-red-400 font-bold px-3 py-1.5 border border-stone-800 hover:border-red-900 rounded-lg transition"
              >
                Clear Comparison
              </button>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comparison Content Table */}
          <div className="p-6 overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            {compareProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Scale className="w-16 h-16 text-stone-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-serif font-bold text-amber-200">No Furniture Models Selected</h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Click the "Compare" button on any furniture card in the catalog to add up to 4 models for side-by-side technical evaluation.
                </p>
              </div>
            ) : (
              <div className="min-w-[700px] grid grid-cols-5 gap-4 divide-x divide-stone-800 text-xs">
                
                {/* Specs Column Labels */}
                <div className="space-y-6 pt-36 text-stone-400 font-bold font-mono uppercase text-[11px]">
                  <div className="h-10 flex items-center">Wood Material</div>
                  <div className="h-10 flex items-center">Dimensions</div>
                  <div className="h-10 flex items-center">Polish Finish</div>
                  <div className="h-10 flex items-center">Termite Warranty</div>
                  <div className="h-10 flex items-center">Availability</div>
                  <div className="h-10 flex items-center">Customer Rating</div>
                  <div className="h-10 flex items-center">Delivery Time</div>
                  <div className="h-10 flex items-center">Custom Staining</div>
                </div>

                {/* Compared Product Columns */}
                {compareProducts.map((p) => (
                  <div key={p.id} className="pl-4 space-y-6 flex flex-col justify-between relative group">
                    
                    {/* Top Remove Button */}
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute top-0 right-0 p-1 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Product Card Header */}
                    <div className="space-y-2 h-36">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-20 object-cover rounded-xl border border-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-[#d4af37] font-mono font-bold block">{p.code}</span>
                      <h3
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setCurrentScreen('product-detail');
                          setIsCompareOpen(false);
                        }}
                        className="font-serif font-bold text-amber-100 line-clamp-1 hover:underline cursor-pointer"
                      >
                        {p.name}
                      </h3>
                      <div className="text-sm font-black text-[#d4af37] font-mono">
                        PKR {p.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Attribute Rows */}
                    <div className="h-10 flex items-center font-bold text-amber-200 border-t border-stone-800/60 pt-2">
                      {p.woodType}
                    </div>

                    <div className="h-10 flex items-center text-stone-300 border-t border-stone-800/60 pt-2 font-mono text-[11px]">
                      {p.dimensions}
                    </div>

                    <div className="h-10 flex items-center text-stone-300 border-t border-stone-800/60 pt-2">
                      {p.polishFinish || 'High Gloss Walnut Stained'}
                    </div>

                    <div className="h-10 flex items-center text-emerald-400 font-bold border-t border-stone-800/60 pt-2 gap-1">
                      <ShieldCheck className="w-4 h-4" /> {p.warranty}
                    </div>

                    <div className="h-10 flex items-center border-t border-stone-800/60 pt-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-800">
                        {p.availability}
                      </span>
                    </div>

                    <div className="h-10 flex items-center text-amber-300 font-bold border-t border-stone-800/60 pt-2 gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {p.rating} ({p.reviewCount} reviews)
                    </div>

                    <div className="h-10 flex items-center text-stone-300 border-t border-stone-800/60 pt-2 font-mono">
                      <Truck className="w-3.5 h-3.5 text-stone-400 mr-1" /> {p.estimatedDeliveryTime}
                    </div>

                    <div className="h-10 flex items-center text-stone-300 border-t border-stone-800/60 pt-2">
                      <Check className="w-4 h-4 text-emerald-400 mr-1" /> Custom Polish Included
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-800 space-y-2">
                      <button
                        onClick={() => handleBuyNow(p)}
                        className="w-full py-2 bg-[#d4af37] text-stone-950 hover:brightness-110 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                      >
                        <ShoppingCart className="w-4 h-4" /> Buy Now
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#d4af37]" /> Hand-Carved Authentic Chiniot Craftsmanship Guaranteed
            </span>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-bold"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
