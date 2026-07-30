import React from 'react';
import { CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  Bed, 
  Armchair, 
  Sofa, 
  Utensils, 
  Coffee, 
  Briefcase, 
  UserCheck, 
  DoorClosed, 
  Tv, 
  Sparkles, 
  BookOpen, 
  Smile, 
  Sun, 
  Wrench, 
  Package,
  ChevronRight
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Bed: <Bed className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Sofa: <Sofa className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  DoorClosed: <DoorClosed className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
};

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setCurrentScreen, darkMode } = useApp();

  const handleCategoryClick = (catName: string) => {
    if (catName === 'Custom Furniture') {
      setCurrentScreen('custom-order');
    } else {
      setSelectedCategory(catName);
      setCurrentScreen('products');
    }
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b ${
        darkMode ? 'border-amber-900/30' : 'border-amber-200/80'
      }`}>
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${
            darkMode ? 'text-[#d4af37]' : 'text-amber-800'
          }`}>
            Handcrafted Master Collections
          </span>
          <h2 className={`text-2xl md:text-3xl font-black font-serif mt-1 ${
            darkMode ? 'text-amber-100' : 'text-stone-900'
          }`}>
            Shop By Furniture Category
          </h2>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentScreen('products');
          }}
          className={`mt-2 md:mt-0 text-xs font-bold flex items-center gap-1 group transition ${
            darkMode ? 'text-amber-400 hover:text-amber-200' : 'text-amber-800 hover:text-amber-950'
          }`}
        >
          View All Products ({CATEGORIES.length} Categories)
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat, index) => {
          const isCustom = cat.name === 'Custom Furniture';

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                isCustom 
                  ? 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 border-[#d4af37] shadow-lg shadow-amber-950/50 text-white'
                  : darkMode 
                    ? 'bg-stone-900 border-stone-800 hover:border-[#d4af37]/60 hover:shadow-xl'
                    : 'bg-white border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Category Image */}
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  darkMode ? 'from-stone-950 via-stone-950/40' : 'from-stone-900/90 via-stone-900/30'
                } to-transparent`} />
                
                {/* Icon Badge */}
                <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/70 border border-amber-500/40 text-[#d4af37]">
                  {ICON_MAP[cat.iconName] || <Package className="w-4 h-4" />}
                </div>

                {isCustom && (
                  <span className="absolute top-2 right-2 text-[10px] bg-[#d4af37] text-black font-extrabold px-2 py-0.5 rounded shadow">
                    BESPOKE
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className={`font-bold text-sm font-serif line-clamp-1 transition ${
                  isCustom
                    ? 'text-amber-200 group-hover:text-white'
                    : darkMode 
                      ? 'text-amber-100 group-hover:text-[#d4af37]' 
                      : 'text-stone-900 group-hover:text-amber-800'
                }`}>
                  {cat.name}
                </h3>
                <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                  isCustom
                    ? 'text-amber-100/70'
                    : darkMode ? 'text-stone-400' : 'text-stone-600'
                }`}>
                  {cat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
