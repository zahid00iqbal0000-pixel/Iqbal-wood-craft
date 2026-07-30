import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Ruler, 
  Gem, 
  Sparkles, 
  Palette, 
  Crown, 
  CheckCircle2, 
  Compass, 
  Feather, 
  Star, 
  ShieldCheck,
  Check
} from 'lucide-react';

export const AutoScrollTrustBar: React.FC = () => {
  const { trustMessages, darkMode } = useApp();

  const messages = trustMessages && trustMessages.length > 0 ? trustMessages : [
    { id: 'tm-1', text: 'Custom Furniture Designed for Your Space', icon: 'Ruler' },
    { id: 'tm-2', text: 'Premium Quality Craftsmanship', icon: 'Gem' },
    { id: 'tm-3', text: 'Elegant Designs for Modern Living', icon: 'Sparkles' },
    { id: 'tm-4', text: 'Tailored Solutions for Every Home', icon: 'Palette' },
    { id: 'tm-5', text: 'Built to Match Your Style & Space', icon: 'Crown' },
    { id: 'tm-6', text: 'Quality, Comfort & Lasting Beauty', icon: 'CheckCircle2' },
    { id: 'tm-7', text: 'Expert Design Consultation', icon: 'Compass' },
    { id: 'tm-8', text: 'Precision in Every Detail', icon: 'Feather' },
    { id: 'tm-9', text: 'Creating Beautiful Spaces Together', icon: 'Star' },
    { id: 'tm-10', text: 'Furniture That Reflects Your Lifestyle', icon: 'ShieldCheck' }
  ];

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Ruler': return <Ruler className="w-4 h-4 text-[#d4af37]" />;
      case 'Gem': return <Gem className="w-4 h-4 text-[#d4af37]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
      case 'Palette': return <Palette className="w-4 h-4 text-[#d4af37]" />;
      case 'Crown': return <Crown className="w-4 h-4 text-[#d4af37]" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />;
      case 'Compass': return <Compass className="w-4 h-4 text-[#d4af37]" />;
      case 'Feather': return <Feather className="w-4 h-4 text-[#d4af37]" />;
      case 'Star': return <Star className="w-4 h-4 text-[#d4af37]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-[#d4af37]" />;
      default: return <Check className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  // Duplicate the messages list to create a smooth, seamless infinite loop
  const duplicatedList = [...messages, ...messages];

  return (
    <div className={`relative w-full overflow-hidden border-t border-b py-3 transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-r from-stone-950 via-[#1a140d] to-stone-950 border-[#d4af37]/30 text-amber-100'
        : 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 border-amber-800 text-amber-100'
    }`}>
      {/* Subtle fade edges for ultra-premium look */}
      <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />

      {/* Ticker marquee container */}
      <div className="animate-marquee flex items-center gap-6 sm:gap-8 select-none">
        {duplicatedList.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-stone-900/60 border border-amber-500/30 text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:border-[#d4af37] transition"
          >
            <div className="p-1 rounded-full bg-amber-500/20 shrink-0">
              {renderIcon(item.icon)}
            </div>
            <span className="whitespace-nowrap font-serif text-amber-100">{item.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
