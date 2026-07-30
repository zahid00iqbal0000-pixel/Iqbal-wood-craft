import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SmartSearchFilter } from '../components/SmartSearchFilter';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Product } from '../types';
import { SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    selectedWoodType, 
    priceRange, 
    sortBy, 
    searchQuery,
    setSelectedCategory 
  } = useApp();

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtering Logic
  let filtered = products.filter(p => {
    // Category Collection Match
    if (selectedCategory) {
      const targetCat = selectedCategory.toLowerCase().trim();
      const pCat = p.category.toLowerCase().trim();
      
      const exactMatch = pCat === targetCat;
      const partialMatch = pCat.includes(targetCat) || targetCat.includes(pCat);
      // Keyword collection match (e.g., 'Wardrobe' matching 'American Wardrobe' or 'Sliding Wardrobe')
      const targetKeywords = targetCat.split(' ').filter(k => k.length > 3);
      const keywordMatch = targetKeywords.some(kw => pCat.includes(kw));

      if (!exactMatch && !partialMatch && !keywordMatch) return false;
    }

    // Wood Type match
    if (selectedWoodType !== 'All' && p.woodType !== selectedWoodType) return false;

    // Price range match
    const price = p.salePrice || p.price;
    if (price > priceRange[1]) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchWood = p.woodType.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCat && !matchWood && !matchDesc) return false;
    }

    return true;
  });

  // Sorting Logic
  filtered.sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 text-white">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-amber-900/40 pb-4 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            {selectedCategory ? `Category: ${selectedCategory}` : 'Full Showroom Inventory'}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-amber-100 mt-1">
            Handcrafted Furniture Collection
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <span className="text-xs text-stone-400 font-mono">
            Showing {filtered.length} of {products.length} Products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filter Sidebar */}
        <div className={`lg:col-span-3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <SmartSearchFilter />
        </div>

        {/* Right Column: Product Cards Grid */}
        <div className="lg:col-span-9">
          {filtered.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-3">
              <PackageX className="w-12 h-12 text-stone-600 mx-auto" />
              <h3 className="font-serif font-bold text-amber-200 text-lg">No Matching Furniture Found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try adjusting your search criteria or price range filter.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-lg hover:brightness-110"
              >
                Reset Category Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProductForModal(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />
    </div>
  );
};
