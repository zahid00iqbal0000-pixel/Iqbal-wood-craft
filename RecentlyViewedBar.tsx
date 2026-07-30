import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Eye, Star, ChevronRight } from 'lucide-react';

export const RecentlyViewedBar: React.FC = () => {
  const { recentlyViewed, products, setSelectedProductId, setCurrentScreen } = useApp();

  if (recentlyViewed.length === 0) return null;

  const viewedProducts = products.filter(p => recentlyViewed.includes(p.id));
  if (viewedProducts.length === 0) return null;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4 my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-lg text-amber-100">
            Recently Viewed Furniture
          </h3>
        </div>
        <span className="text-xs text-stone-400 font-mono">
          {viewedProducts.length} Items Saved in History
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {viewedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProductId(p.id);
              setCurrentScreen('product-detail');
            }}
            className="group bg-stone-950 border border-stone-800 hover:border-[#d4af37] rounded-xl p-2.5 cursor-pointer transition shadow-md flex flex-col justify-between space-y-2"
          >
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 left-1 bg-stone-950/80 backdrop-blur-sm text-[#d4af37] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                {p.code}
              </span>
            </div>

            <div>
              <h4 className="font-serif text-xs font-bold text-stone-200 truncate group-hover:text-amber-200">
                {p.name}
              </h4>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="font-bold font-mono text-[#d4af37]">
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
    </div>
  );
};
