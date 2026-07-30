import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAiCustomFurnitureEstimate, CustomAiEstimateResponse } from '../services/geminiService';
import { WoodType } from '../types';
import { 
  Wrench, 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  Ruler, 
  Palette, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

const WOOD_OPTIONS: WoodType[] = [
  'Solid Sheesham (Chinioti Rosewood)',
  'Teak Wood (Sagwan)',
  'Walnut Wood (Akhrot)',
  'Oak Wood',
  'High-Grade MDF with Tactile Veneer',
  'Mahogany Wood'
];

export const CustomOrderModal: React.FC = () => {
  const { submitCustomOrder, setCurrentScreen, showToast, contactInfo } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [category, setCategory] = useState('Bedroom Furniture');
  const [designTitle, setDesignTitle] = useState('');
  const [dimensions, setDimensions] = useState('10ft x 12ft room fit');
  const [woodType, setWoodType] = useState<WoodType>('Solid Sheesham (Chinioti Rosewood)');
  const [colourStain, setColourStain] = useState('Walnut High Gloss');
  const [fabricOption, setFabricOption] = useState('Royal Velvet Upholstery');
  const [budgetPkr, setBudgetPkr] = useState(250000);
  const [specialReqs, setSpecialReqs] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // AI Estimation
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<CustomAiEstimateResponse | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchAiQuote = async () => {
    setIsAiLoading(true);
    try {
      const res = await getAiCustomFurnitureEstimate({
        category,
        dimensions,
        woodType,
        colourStain,
        fabricOption,
        specialRequirements: specialReqs
      });
      setAiEstimate(res);
      showToast('AI Woodcraft Estimate generated successfully!');
    } catch (e) {
      showToast('Failed to calculate AI quote. Standard quote applies.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !designTitle) {
      showToast('Please fill out all required custom order fields.');
      return;
    }

    submitCustomOrder({
      customerName,
      phone,
      email,
      city,
      category,
      preferredDesignTitle: designTitle,
      dimensions,
      woodType,
      colourStain,
      fabricOption,
      budgetPkr,
      specialRequirements: specialReqs,
      referenceImageUrl: imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      estimatedPricePkr: aiEstimate ? aiEstimate.estimatedPriceMinPkr : budgetPkr
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const waCustomMsg = encodeURIComponent(
      `Assalam-o-Alaikum IQBAL WOODCRAFT!\nI submitted a Custom Furniture Order:\n\nDesign: ${designTitle}\nCategory: ${category}\nWood: ${woodType}\nDimensions: ${dimensions}\nStain: ${colourStain}\nCustomer: ${customerName}\nPhone: ${phone} (${city})\nBudget: PKR ${budgetPkr.toLocaleString()}\n\nPlease review and provide official shop drawings & pricing.`
    );

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-white">
        <div className="bg-stone-900 border border-[#d4af37] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#d4af37]/20 border border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs text-amber-400 font-mono uppercase tracking-widest">Custom Request Sent</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 mt-1">
              Custom Furniture Order Received!
            </h2>
            <p className="text-stone-300 text-xs md:text-sm mt-2 max-w-lg mx-auto">
              Our Senior Master Craftsman team is reviewing your custom requirements for <strong className="text-amber-200">{designTitle}</strong>. We will contact you shortly on phone or WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=${waCustomMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Discuss Custom Design on WhatsApp
            </a>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-800 rounded-xl font-bold text-xs"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-white">
      {/* Title */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950 border border-amber-700/60 rounded-full text-xs font-bold text-amber-300">
          <Wrench className="w-3.5 h-3.5 text-[#d4af37]" />
          100% Tailor-Made Woodcrafting
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-amber-100">
          Request Custom Furniture Creation
        </h1>
        <p className="text-xs md:text-sm text-stone-300 max-w-xl mx-auto">
          Specify your room dimensions, preferred wood species (Solid Sheesham, Teak, Walnut), finish stain, and design photos for bespoke creation by Iqbal Woodcraft artisans.
        </p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Info */}
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 mb-3">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mian Tariq Hassan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="0300-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="Karachi / Lahore / etc."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Custom Furniture Specs */}
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 mb-3">
              2. Custom Furniture Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Design Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Custom 8-Seater Carved Sheesham Dining Table"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Furniture Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                >
                  <option value="Bedroom Furniture">Bedroom Furniture</option>
                  <option value="Living Room Furniture">Living Room Furniture</option>
                  <option value="Luxury Sofa Sets">Luxury Sofa Sets</option>
                  <option value="Dining Tables">Dining Tables</option>
                  <option value="Coffee Tables">Coffee Tables</option>
                  <option value="Office Furniture">Office Furniture</option>
                  <option value="Executive Chairs">Executive Chairs</option>
                  <option value="Wardrobes">Wardrobes</option>
                  <option value="TV Units">TV Units</option>
                  <option value="Custom Furniture">Custom Furniture</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Preferred Wood Species *</label>
                <select
                  value={woodType}
                  onChange={(e) => setWoodType(e.target.value as WoodType)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                >
                  {WOOD_OPTIONS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Dimensions (L x W x H) *</label>
                <input
                  type="text"
                  placeholder="e.g. 84 inches x 78 inches x 60 inches"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Colour Polish / Stain Finish</label>
                <input
                  type="text"
                  placeholder="e.g. Walnut High Gloss / Antique Gold Leaf"
                  value={colourStain}
                  onChange={(e) => setColourStain(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Fabric / Upholstery Choice</label>
                <input
                  type="text"
                  placeholder="e.g. Emerald Green Velvet / Genuine Brown Leather"
                  value={fabricOption}
                  onChange={(e) => setFabricOption(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Target Budget (PKR)</label>
                <input
                  type="number"
                  step={5000}
                  value={budgetPkr}
                  onChange={(e) => setBudgetPkr(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Reference Image Link (Optional)</label>
                <input
                  type="url"
                  placeholder="Paste URL of design inspiration image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Special Crafting Instructions</label>
                <textarea
                  placeholder="Mention carving style, drawer lock requirement, brass work, or glass thickness..."
                  value={specialReqs}
                  onChange={(e) => setSpecialReqs(e.target.value)}
                  rows={2}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* AI Quote Button & Result Box */}
          <div className="p-4 bg-stone-950 rounded-xl border border-amber-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-amber-200">AI Valuation & Woodcraft Estimate</span>
              </div>
              <button
                type="button"
                onClick={fetchAiQuote}
                disabled={isAiLoading}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isAiLoading ? 'Calculating AI Cost...' : 'Calculate AI Valuation'}
              </button>
            </div>

            {aiEstimate && (
              <div className="p-3 bg-stone-900 rounded-lg border border-[#d4af37]/40 text-xs space-y-2">
                <div className="flex justify-between items-center text-amber-300 font-extrabold text-sm">
                  <span>Estimated Cost Range:</span>
                  <span className="font-mono text-[#d4af37]">
                    PKR {aiEstimate.estimatedPriceMinPkr.toLocaleString()} - PKR {aiEstimate.estimatedPriceMaxPkr.toLocaleString()}
                  </span>
                </div>
                <p className="text-stone-300">{aiEstimate.woodcraftNotes}</p>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Recommended Polish: {aiEstimate.recommendedFinish}</span>
                  <span className="text-amber-400 font-mono">Time: ~{aiEstimate.productionDays} Days</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-xl hover:brightness-110 uppercase tracking-wider"
          >
            Submit Custom Order To Iqbal Woodcraft Admin
          </button>
        </form>
      </div>
    </div>
  );
};
