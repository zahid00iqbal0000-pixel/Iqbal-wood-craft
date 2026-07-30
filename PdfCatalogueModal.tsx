import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Download, Printer, ShieldCheck, MessageSquare, PhoneCall, FileText } from 'lucide-react';

export const PdfCatalogueModal: React.FC = () => {
  const { products, contactInfo, showToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast('Downloading IQBAL WOODCRAFT 2026 Master Catalogue (PDF)...');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-white">
      {/* Header Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#d4af37]/20 border border-[#d4af37] rounded-xl text-[#d4af37]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black text-amber-100">
              Official Digital Furniture Catalogue 2026
            </h1>
            <p className="text-xs text-amber-400 font-mono">
              IQBAL WOODCRAFT • DHA Phase 6 Karachi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/50 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print Catalogue
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-[#d4af37] text-black font-extrabold text-xs rounded-xl shadow hover:brightness-110 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Catalogue Page Layout */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-8 space-y-8 print:bg-white print:text-black">
        {/* Cover Header */}
        <div className="border-b-2 border-[#d4af37] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/iwc_karachi_gold_logo_1785338810799.jpg"
              alt=""
              className="w-16 h-16 object-cover rounded-xl border border-amber-500/50"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-3xl font-serif font-black text-amber-100 tracking-wider">
                IQBAL WOOD CRAFT
              </h2>
              <p className="text-xs text-amber-400 font-serif italic">
                Master Woodcraft & Complete Furniture Solutions Since 1995
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-stone-300">
            <span className="block font-bold text-amber-200">Showroom Address:</span>
            <span>Khayaban-e-Ittehad, DHA Phase 6, Karachi</span>
            <span className="block font-mono text-amber-400">Sales: {contactInfo.salesPhone}</span>
          </div>
        </div>

        {/* Catalogue Product Showcase */}
        <div>
          <h3 className="text-lg font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 mb-4">
            2026 Master Collections Inventory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.slice(0, 8).map((prod) => (
              <div key={prod.id} className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex gap-4">
                <img
                  src={prod.images[0]}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg border border-stone-800 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1 text-xs">
                  <span className="font-mono text-amber-400 font-bold text-[10px]">{prod.code}</span>
                  <h4 className="font-serif font-bold text-amber-100 text-sm">{prod.name}</h4>
                  <p className="text-stone-300">Wood: {prod.woodType}</p>
                  <p className="text-stone-400">Dim: {prod.dimensions}</p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="font-extrabold text-[#d4af37] text-sm">
                      PKR {(prod.salePrice || prod.price).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400">{prod.warranty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Policy & Order Terms */}
        <div className="p-5 bg-stone-900 border border-amber-900/60 rounded-xl text-xs space-y-2">
          <h4 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            Official Ordering & Delivery Terms
          </h4>
          <p className="text-stone-300 leading-relaxed">
            1. All items are made from 100% kiln-dried seasoned solid Sheesham (Rosewood) / Teak wood.<br/>
            2. <strong>100% Advance Payment Policy:</strong> Cash On Delivery (COD) is strictly NOT available.<br/>
            3. Cargo delivery charges are calculated based on destination city across Pakistan.<br/>
            4. Custom furniture orders are crafted according to client dimensions and finish preferences.
          </p>
        </div>
      </div>
    </div>
  );
};
