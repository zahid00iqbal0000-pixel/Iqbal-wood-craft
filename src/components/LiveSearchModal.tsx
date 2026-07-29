import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Mic, MicOff, X, ArrowRight, Sparkles, Tag, Star, ChevronRight, PackageCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RECENT_SEARCHES = [
  'Royal Chinioti Bed',
  'Sheesham Sofa Set',
  'Teak Wood Dining Table',
  'Console Table Brass',
  'Hand-Carved Executive Desk'
];

export const LiveSearchModal: React.FC = () => {
  const {
    isLiveSearchOpen,
    setIsLiveSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProductId,
    setCurrentScreen,
    startVoiceSearch,
    isVoiceSearchListening,
    setSelectedWoodType
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'sheesham' | 'teak' | 'walnut'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsLiveSearchOpen(true);
      }
      if (e.key === 'Escape' && isLiveSearchOpen) {
        setIsLiveSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLiveSearchOpen, setIsLiveSearchOpen]);

  if (!isLiveSearchOpen) return null;

  const filteredProducts = products.filter(p => {
    if (activeTab === 'sheesham' && !p.woodType.includes('Sheesham')) return false;
    if (activeTab === 'teak' && !p.woodType.includes('Teak')) return false;
    if (activeTab === 'walnut' && !p.woodType.includes('Walnut')) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
           p.code.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           p.woodType.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentScreen('product-detail');
    setIsLiveSearchOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        
        {/* Click outside backdrop */}
        <div className="absolute inset-0" onClick={() => setIsLiveSearchOpen(false)} />

        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Top Search Input Header */}
          <div className="p-4 md:p-6 border-b border-stone-800 bg-stone-950/80 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#d4af37]" />
            <input
              type="text"
              autoFocus
              placeholder="Search handcrafted beds, Sheesham sofas, dining tables or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-amber-100 placeholder-stone-500 text-sm md:text-base outline-none font-sans"
            />

            {/* Voice Search Mic Button */}
            <button
              onClick={() => startVoiceSearch()}
              title="Voice Search via Microphone"
              className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
                isVoiceSearchListening 
                  ? 'bg-red-950 text-red-400 border-red-800 animate-pulse ring-2 ring-red-500/50' 
                  : 'bg-stone-800/80 text-amber-300 border-stone-700 hover:bg-[#d4af37] hover:text-stone-950'
              }`}
            >
              {isVoiceSearchListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => setIsLiveSearchOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Voice Search Banner */}
          {isVoiceSearchListening && (
            <div className="bg-amber-950/60 border-b border-amber-800/60 px-6 py-2 text-xs text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold animate-pulse">
                <Sparkles className="w-4 h-4 text-[#d4af37]" /> Listening for speech in Urdu or English...
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Speak clearly near your microphone</span>
            </div>
          )}

          {/* Quick Category / Wood Filters */}
          <div className="px-6 py-3 border-b border-stone-800/60 bg-stone-900 flex items-center justify-between overflow-x-auto gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium text-[11px] uppercase tracking-wider">Wood Type:</span>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'all' ? 'bg-[#d4af37] text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                All Wood
              </button>
              <button
                onClick={() => setActiveTab('sheesham')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'sheesham' ? 'bg-[#d4af37] text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Solid Sheesham
              </button>
              <button
                onClick={() => setActiveTab('teak')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'teak' ? 'bg-[#d4af37] text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Teak Wood
              </button>
            </div>

            <span className="text-[11px] font-mono text-stone-500 hidden sm:inline">
              ESC to close • Press ⌘K
            </span>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            
            {/* Recent Searches Tags if query empty */}
            {!searchQuery.trim() && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Popular Woodcraft Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl text-xs text-stone-300 transition flex items-center gap-1.5"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Results Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {searchQuery ? `Matching Furniture (${filteredProducts.length})` : 'Featured Royal Collections'}
                </span>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={() => {
                      setCurrentScreen('products');
                      setIsLiveSearchOpen(false);
                    }}
                    className="text-xs text-[#d4af37] font-bold hover:underline flex items-center gap-1"
                  >
                    View All Collections <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2 bg-stone-950/50 rounded-2xl border border-stone-800/80">
                  <p className="text-sm font-bold text-amber-200">No furniture matches "{searchQuery}"</p>
                  <p className="text-xs text-stone-500">Try searching for "Bed", "Sofa", "Dining", "Chiniot" or a wood type.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="group bg-stone-950 hover:bg-stone-800/90 border border-stone-800 hover:border-[#d4af37]/60 rounded-xl p-3 flex gap-3 cursor-pointer transition shadow-md"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg border border-stone-800 group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[10px] text-[#d4af37] font-bold">{p.code}</span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                              <PackageCheck className="w-3 h-3" /> {p.availability}
                            </span>
                          </div>
                          <h4 className="text-xs font-serif font-bold text-stone-100 truncate group-hover:text-amber-200 transition">
                            {p.name}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="font-bold text-amber-400 font-mono">
                            PKR {p.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 text-[11px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Live Woodcraft Catalog Sync Enabled
            </span>
            <span className="text-stone-500 font-mono">Pan-Pakistan Shipping</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
