import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Flame, Star, ShoppingCart, Scale, Heart, ShieldCheck } from 'lucide-react';

export const RecommendedProductsSection: React.FC = () => {
  const { products, setSelectedProductId, setCurrentScreen, addToCart, toggleCompare, compareList, toggleWishlist, wishlist } = useApp();
  const [tab, setTab] = useState<'popular' | 'sheesham' | 'recommended'>('popular');

  const getFiltered = () => {
    if (tab === 'popular') {
      return products.filter(p => p.isBestSeller || p.rating >= 4.8).slice(0, 4);
    }
    if (tab === 'sheesham') {
      return products.filter(p => p.woodType.includes('Sheesham')).slice(0, 4);
    }
    return products.filter(p => p.isFeatured || p.isPremiumCollection).slice(0, 4);
  };

  const list = getFiltered();

  return (
    <div className="space-y-6 my-10">
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended for Your Residence
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-amber-100 mt-1">
            Popular & Curator's Choice
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setTab('popular')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              tab === 'popular' ? 'bg-[#d4af37] text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Popular Demand
          </button>
          <button
            onClick={() => setTab('sheesham')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              tab === 'sheesham' ? 'bg-[#d4af37] text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            Solid Sheesham
          </button>
          <button
            onClick={() => setTab('recommended')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              tab === 'recommended' ? 'bg-[#d4af37] text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            Recommended
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((p) => {
          const isWish = wishlist.includes(p.id);
          const isComp = compareList.includes(p.id);

          return (
            <div
              key={p.id}
              className="group bg-stone-900 border border-stone-800 hover:border-[#d4af37]/60 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                {p.isBestSeller && (
                  <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <span className="bg-stone-950/80 backdrop-blur-md text-[#d4af37] font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-stone-800">
                  {p.code}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(p.id);
                }}
                className={`absolute top-6 right-6 z-10 p-2 rounded-full backdrop-blur-md transition ${
                  isWish ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-stone-950/60 text-stone-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500' : ''}`} />
              </button>

              {/* Image */}
              <div
                onClick={() => {
                  setSelectedProductId(p.id);
                  setCurrentScreen('product-detail');
                }}
                className="relative aspect-4/3 overflow-hidden rounded-xl cursor-pointer"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content */}
              <div className="mt-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono text-[11px] text-amber-300 truncate max-w-[140px]">
                      {p.woodType}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {p.rating}
                    </span>
                  </div>

                  <h3
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setCurrentScreen('product-detail');
                    }}
                    className="font-serif font-bold text-amber-100 text-sm md:text-base mt-1 group-hover:text-[#d4af37] transition cursor-pointer line-clamp-1"
                  >
                    {p.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block font-mono">Price</span>
                      <span className="text-base font-black font-mono text-[#d4af37]">
                        PKR {p.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCompare(p.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                        isComp ? 'bg-[#d4af37] text-stone-950 font-bold border-[#d4af37]' : 'border-stone-700 text-stone-400 hover:text-white'
                      }`}
                      title="Compare Specification"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="w-full py-2.5 bg-[#d4af37] text-stone-950 hover:brightness-110 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Order
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
