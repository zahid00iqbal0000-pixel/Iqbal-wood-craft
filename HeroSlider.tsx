import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Wrench, Award, MessageSquare, Sparkles, Tag, CreditCard } from 'lucide-react';
import { BannerSlide } from '../types';
import { AutoScrollTrustBar } from './AutoScrollTrustBar';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { bannerSlides, setCurrentScreen, setSelectedCategory, contactInfo, darkMode } = useApp();

  const slides: BannerSlide[] = bannerSlides && bannerSlides.length > 0 ? bannerSlides : [
    {
      id: 'banner-1',
      title: 'Master Handcrafted Solid Wood Furniture',
      subtitle: 'Complete furniture and woodwork solutions for Home, Office, Indoor, and Outdoor spaces, crafted by master artisans.',
      image: '/src/assets/images/iqbal_hero_bedroom_1785234338239.jpg',
      badge: 'NEW 2026 ROYAL COLLECTION',
      ctaText: 'View Bedroom Furniture',
      categoryFilter: 'Bedroom'
    },
    {
      id: 'banner-2',
      title: 'Opulent Living Room & Luxury Sofa Sets',
      subtitle: 'High-density Master MoltyFoam upholstered in royal Turkish velvet with solid teak & rosewood carved frames.',
      image: '/src/assets/images/iqbal_hero_living_1785234317919.jpg',
      badge: 'EXECUTIVE LUXURY SHOWROOM',
      ctaText: 'Explore Sofa Sets',
      categoryFilter: 'Sofa'
    },
    {
      id: 'banner-3',
      title: 'American & Modern Kitchen Solutions',
      subtitle: 'Open-concept island counters, high-gloss acrylic cabinets, and luxury quartz breakfast bars.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      badge: 'INTERIOR WOODWORK & KITCHEN',
      ctaText: 'Explore Kitchen Collection',
      categoryFilter: 'American Kitchen'
    },
    {
      id: 'banner-4',
      title: 'Custom Furniture Made To Your Specifications',
      subtitle: 'Bespoke designs, custom dimensions, wood choice (Sheesham, Teak, Walnut), and velvet polish stains.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      badge: '100% TAILOR MADE',
      ctaText: 'Submit Custom Order',
      isCustomOrder: true
    }
  ];

  // Auto-Slide timer
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle Swipe Gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40) {
      // Swipe Left -> Next Slide
      setCurrentSlide(prev => (prev + 1) % slides.length);
    } else if (diff < -40) {
      // Swipe Right -> Prev Slide
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStartX(null);
  };

  const handleCta = (slide: BannerSlide) => {
    if (slide.isCustomOrder) {
      setCurrentScreen('custom-order');
    } else {
      setSelectedCategory(slide.categoryFilter || null);
      setCurrentScreen('products');
    }
  };

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white">
      {/* Full Width Hero Slider */}
      <div 
        className="relative h-[480px] sm:h-[540px] md:h-[620px] w-full select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id || currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Hero Image */}
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Vignette Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />

            {/* Slide Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="max-w-2xl space-y-4"
              >
                {activeSlide.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#d4af37]/25 border border-[#d4af37]/70 text-[#d4af37] font-bold text-xs rounded-full tracking-widest uppercase shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                    {activeSlide.badge}
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-50 font-serif leading-tight tracking-tight drop-shadow-md">
                  {activeSlide.title}
                </h1>

                <p className="text-sm md:text-base lg:text-lg text-amber-100/90 leading-relaxed font-sans max-w-xl">
                  {activeSlide.subtitle}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={() => handleCta(activeSlide)}
                    className="px-7 py-3.5 bg-gradient-to-r from-[#d4af37] via-amber-500 to-amber-600 text-stone-950 font-black text-xs md:text-sm rounded-xl shadow-xl hover:brightness-110 active:scale-95 transition uppercase tracking-wider"
                  >
                    {activeSlide.ctaText || 'Explore Collection'}
                  </button>

                  <a
                    href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(activeSlide.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl border border-emerald-500/50 flex items-center gap-2 transition shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
                    WhatsApp Order
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe Hint & Touch Indicator */}
        <div className="absolute bottom-12 right-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[11px] font-medium backdrop-blur-sm">
          <span>Swipe to explore slides</span>
        </div>

        {/* Slide Indicator Dots (No manual arrow buttons cluttering the view) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-9 bg-[#d4af37] shadow-lg shadow-amber-500/50' : 'w-2.5 bg-stone-600/80 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Auto Scrolling Trust Bar */}
      <AutoScrollTrustBar />
    </section>
  );
};
