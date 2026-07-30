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
  const { setCurrentScreen, setSelectedCategory, contactInfo, darkMode } = useApp();

  return (
    <footer className={`border-t transition-colors duration-300 pt-12 pb-6 px-4 ${
      darkMode 
        ? 'bg-stone-950 border-[#d4af37]/40 text-white' 
        : 'bg-stone-900 border-amber-800 text-stone-100'
    }`}>
      <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b text-xs ${
        darkMode ? 'border-stone-800' : 'border-stone-800'
      }`}>
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/iwc_karachi_gold_logo_1785338810799.jpg"
              alt="IQBAL WOOD CRAFT"
              className="w-12 h-12 object-cover rounded-xl border border-[#d4af37]/60 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="block text-xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#d4af37] to-amber-500">
                IQBAL WOOD CRAFT
              </span>
              <span className="block text-[10px] text-amber-300 uppercase tracking-widest font-semibold">
                Furniture • Woodwork • Karachi
              </span>
              <span className="text-[10px] text-amber-200/80 uppercase tracking-widest font-sans font-medium">
                Premium Furniture Store
              </span>
            </div>
          </div>

          <p className="text-stone-300 leading-relaxed max-w-sm">
            Iqbal Wood Craft is a complete furniture and woodwork business that provides solutions for Home Furniture, Office Furniture, Indoor Furniture, Outdoor Furniture, Custom Furniture, Wood Work, Chipboard Work, MDF/Soft Board Work, Foam Board and other sheet-based work. The name "Wood Craft" represents our complete woodworking and furniture services.
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
        <span>© {new Date().getFullYear()} Iqbal Wood Craft – Karachi</span>
        <div className="flex items-center gap-4">
          <span className="text-amber-400">DHA Phase 6 Karachi</span>
          <span>100% Solid Wood Craftsmanship</span>
        </div>
      </div>
    </footer>
  );
};
