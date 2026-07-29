import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ChevronRight,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentScreen, setSelectedCategory, contactInfo } = useApp();

  return (
    <footer className="bg-stone-950 border-t border-[#d4af37]/40 text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800 text-xs">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/iqbal_woodcraft_logo_1785234354516.jpg"
              alt="IQBAL WOODCRAFT"
              className="w-12 h-12 object-cover rounded-xl border border-[#d4af37]/60"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="block text-xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#d4af37] to-amber-500">
                IQBAL WOODCRAFT
              </span>
              <span className="text-[10px] text-amber-200/80 uppercase tracking-widest font-sans font-medium">
                Premium Furniture Store
              </span>
            </div>
          </div>

          <p className="text-stone-300 leading-relaxed max-w-sm">
            Pakistan’s premier furniture showroom specializing in 100% Solid Sheesham (Chinioti Rosewood), Teak, and Walnut hand-carved furniture. Engineered for multi-generational durability with a 10-Year Termite Guarantee.
          </p>

          <div className="p-3 bg-stone-900 rounded-xl border border-amber-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>100% Advance Payment Policy</span>
            </div>
            <p className="text-[10px] text-stone-400">
              No COD available. Orders processed upon bank/mobile advance confirmation.
            </p>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 text-sm uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-stone-300">
            <li>
              <button onClick={() => setCurrentScreen('home')} className="hover:text-[#d4af37] transition">
                Home Showroom
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory(null); setCurrentScreen('products'); }} className="hover:text-[#d4af37] transition">
                All Furniture Catalog
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentScreen('custom-order')} className="hover:text-[#d4af37] text-amber-300 font-bold">
                Custom Furniture Order
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentScreen('catalogue')} className="hover:text-[#d4af37] transition">
                Digital PDF Catalogue
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentScreen('my-orders')} className="hover:text-[#d4af37] transition">
                Track Order & Cargo Bilty
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentScreen('contact')} className="hover:text-[#d4af37] transition">
                Contact Showroom
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Furniture Categories */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 text-sm uppercase tracking-wider">
            Furniture Categories
          </h4>
          <ul className="space-y-1.5 text-stone-300 max-h-48 overflow-y-auto pr-1">
            {CATEGORIES.slice(0, 10).map(c => (
              <li key={c.id}>
                <button
                  onClick={() => { setSelectedCategory(c.name); setCurrentScreen('products'); }}
                  className="hover:text-[#d4af37] transition truncate w-full text-left"
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Official Contacts */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 text-sm uppercase tracking-wider">
            Management Contacts
          </h4>
          <div className="space-y-2 text-stone-300">
            <p><strong>CEO:</strong> {contactInfo.ceo} ({contactInfo.ceoPhone})</p>
            <p><strong>Business Mgr:</strong> {contactInfo.businessManager} ({contactInfo.bmPhone})</p>
            <p><strong>Sales & App:</strong> {contactInfo.salesAndApp} ({contactInfo.salesPhone})</p>
            <p className="text-emerald-400 font-bold"><strong>WhatsApp:</strong> {contactInfo.whatsappBusiness}</p>
            <p className="text-amber-300 font-mono">{contactInfo.email}</p>
            <p className="text-[11px] text-stone-400">{contactInfo.address}</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
        <span>© {new Date().getFullYear()} IQBAL WOODCRAFT. All Rights Reserved. Designed for Pakistan.</span>
        <div className="flex items-center gap-4">
          <span className="text-amber-400">DHA Phase 6 Karachi</span>
          <span>100% Solid Wood Craftsmanship</span>
        </div>
      </div>
    </footer>
  );
};
