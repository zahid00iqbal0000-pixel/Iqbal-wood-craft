import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Wrench, Award, MessageSquare } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Royal Chinioti Sheesham Craftsmanship',
    subtitle: 'Handcrafted luxury bedroom suites and carved dining tables created by Pakistan’s finest wood artisans.',
    image: '/src/assets/images/iqbal_hero_bedroom_1785234338239.jpg',
    badge: 'NEW 2026 ROYAL COLLECTION',
    ctaText: 'View Bedroom Furniture',
    categoryFilter: 'Bedroom Furniture'
  },
  {
    id: 2,
    title: 'Opulent Living Room & Sofa Sets',
    subtitle: 'High-density Master MoltyFoam upholstered in royal Turkish velvet with solid teak & rosewood carved frames.',
    image: '/src/assets/images/iqbal_hero_living_1785234317919.jpg',
    badge: 'EXECUTIVE LUXURY SHOWROOM',
    ctaText: 'Explore Sofa Sets',
    categoryFilter: 'Luxury Sofa Sets'
  },
  {
    id: 3,
    title: 'Custom Furniture Made To Your Specifications',
    subtitle: 'Bespoke designs, custom dimensions, wood choice (Sheesham, Teak, Walnut), and velvet polish stains.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    badge: '100% TAILOR MADE',
    ctaText: 'Submit Custom Order',
    isCustomOrder: true
  }
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCurrentScreen, setSelectedCategory, contactInfo } = useApp();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCta = (slide: typeof SLIDES[0]) => {
    if (slide.isCustomOrder) {
      setCurrentScreen('custom-order');
    } else {
      setSelectedCategory(slide.categoryFilter || null);
      setCurrentScreen('products');
    }
  };

  return (
    <section className="relative bg-stone-950 text-white overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-[480px] md:h-[580px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Background Image with Dark Gradient Vignette */}
            <img
              src={SLIDES[currentSlide].image}
              alt={SLIDES[currentSlide].title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />

            {/* Slide Content */}
            <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-2xl space-y-4"
              >
                <span className="inline-block px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#d4af37] font-semibold text-xs rounded-full tracking-widest uppercase">
                  {SLIDES[currentSlide].badge}
                </span>

                <h2 className="text-3xl md:text-5xl font-black text-amber-50 font-serif leading-tight">
                  {SLIDES[currentSlide].title}
                </h2>

                <p className="text-sm md:text-lg text-amber-100/80 leading-relaxed font-sans">
                  {SLIDES[currentSlide].subtitle}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleCta(SLIDES[currentSlide])}
                    className="px-6 py-3 bg-gradient-to-r from-[#d4af37] via-amber-500 to-amber-600 text-black font-extrabold text-sm rounded-lg shadow-lg hover:brightness-110 transition uppercase tracking-wider"
                  >
                    {SLIDES[currentSlide].ctaText}
                  </button>

                  <a
                    href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(SLIDES[currentSlide].title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg border border-emerald-500/50 flex items-center gap-2 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Order
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow Controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-[#d4af37] hover:text-black text-white transition border border-amber-500/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-[#d4af37] hover:text-black text-white transition border border-amber-500/30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-[#d4af37]' : 'w-2 bg-stone-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Highlights Strip */}
      <div className="bg-[#17120c] border-t border-b border-[#d4af37]/30 py-4 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-800/50 text-[#d4af37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase">100% Solid Sheesham</h4>
              <p className="text-[11px] text-stone-400">10 Years Termite Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-800/50 text-[#d4af37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase">Pan Pakistan Cargo</h4>
              <p className="text-[11px] text-stone-400">Reliable Bilty Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-800/50 text-[#d4af37]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase">Custom Woodcraft</h4>
              <p className="text-[11px] text-stone-400">Dimensions & Stains to Order</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-800/50 text-[#d4af37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase">Master Chinioti Finish</h4>
              <p className="text-[11px] text-stone-400">Craftsmanship Since 1995</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
