import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { WoodType } from '../types';
import { Filter, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

const WOOD_TYPES: (WoodType | 'All')[] = [
  'All',
  'Solid Sheesham (Chinioti Rosewood)',
  'Teak Wood (Sagwan)',
  'Walnut Wood (Akhrot)',
  'Oak Wood',
  'High-Grade MDF with Tactile Veneer',
  'Mahogany Wood'
];

export const SmartSearchFilter: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedWoodType,
    setSelectedWoodType,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery
  } = useApp();

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedWoodType('All');
    setPriceRange([0, 500000]);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-white space-y-6">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-base text-amber-100">Smart Furniture Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
          Filter By Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition ${
              selectedCategory === null ? 'bg-[#d4af37] text-black font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === null && <Check className="w-3.5 h-3.5" />}
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition ${
                selectedCategory === cat.name ? 'bg-[#d4af37] text-black font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.name && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Wood Type Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
          Wood & Timber Type
        </label>
        <select
          value={selectedWoodType}
          onChange={(e) => setSelectedWoodType(e.target.value as any)}
          className="w-full bg-stone-950 border border-stone-700 text-amber-100 text-xs rounded-xl p-2.5 outline-none focus:border-[#d4af37]"
        >
          {WOOD_TYPES.map(wood => (
            <option key={wood} value={wood}>{wood}</option>
          ))}
        </select>
      </div>

      {/* Price Filter Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
          <span>Max Price Limit</span>
          <span className="text-[#d4af37] font-mono">PKR {priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={30000}
          max={500000}
          step={10000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#d4af37] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
          <span>PKR 30,000</span>
          <span>PKR 500,000+</span>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
          Sort Products By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full bg-stone-950 border border-stone-700 text-amber-100 text-xs rounded-xl p-2.5 outline-none focus:border-[#d4af37]"
        >
          <option value="featured">Featured Showroom Picks</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
          <option value="newest">New Arrivals First</option>
        </select>
      </div>
    </div>
  );
};
