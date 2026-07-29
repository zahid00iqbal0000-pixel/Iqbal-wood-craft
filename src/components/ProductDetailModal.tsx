import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ImageZoomModal } from './ImageZoomModal';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageSquare, 
  PhoneCall, 
  ShoppingCart, 
  Heart, 
  Share2, 
  CheckCircle,
  Ruler,
  Palette,
  Sparkles,
  Rotate3d,
  Layers,
  Box,
  Eye,
  ArrowRight,
  Package,
  Check,
  RefreshCw,
  Copy,
  Scale,
  Maximize2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product: initialProduct, 
  onClose,
  onSelectProduct
}) => {
  if (!initialProduct) return null;

  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setCurrentScreen,
    contactInfo,
    showToast,
    setProducts,
    products,
    addRecentlyViewed,
    toggleCompare,
    compareList
  } = useApp();

  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(initialProduct.availableColors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // 360 Studio View State
  const [viewMode, setViewMode] = useState<'gallery' | '360'>('gallery');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragStartAngle = useRef<number>(0);

  // New Review Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sync state when product prop changes & register in recently viewed
  useEffect(() => {
    setActiveProduct(initialProduct);
    setActiveImageIndex(0);
    setSelectedColor(initialProduct.availableColors[0] || 'Default');
    setQuantity(1);
    setRotationAngle(0);
    setViewMode('gallery');
    if (initialProduct.id) {
      addRecentlyViewed(initialProduct.id);
    }
  }, [initialProduct]);


  // Auto 360 Rotation Timer
  useEffect(() => {
    let interval: any = null;
    if (isAutoRotating && viewMode === '360') {
      interval = setInterval(() => {
        setRotationAngle(prev => (prev + 5) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating, viewMode]);

  const isWishlisted = wishlist.includes(activeProduct.id);
  const displayPrice = activeProduct.salePrice || activeProduct.price;

  // Compute Related Products (Same category or wood type, excluding current)
  const relatedProducts = products
    .filter(p => p.id !== activeProduct.id && (p.category === activeProduct.category || p.woodType === activeProduct.woodType))
    .slice(0, 3);

  const whatsappOrderMessage = encodeURIComponent(
    `Assalam-o-Alaikum IQBAL WOODCRAFT!\nI want to place an order for this product:\n- Name: ${activeProduct.name}\n- Product Code: ${activeProduct.code}\n- Price: PKR ${(displayPrice * quantity).toLocaleString()}\n- Quantity: ${quantity}\n- Selected Polish/Color: ${selectedColor}\n- Wood Type: ${activeProduct.woodType}\n\nPlease share payment details (Bank Transfer / JazzCash / EasyPaisa) to confirm my 100% advance order.`
  );

  const handleShare = () => {
    const productUrl = window.location.origin + `?product=${activeProduct.code}`;
    if (navigator.share) {
      navigator.share({
        title: activeProduct.name,
        text: `Check out ${activeProduct.name} (Code: ${activeProduct.code}) at IQBAL WOODCRAFT - ${activeProduct.description}`,
        url: productUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(productUrl);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, quantity, selectedColor);
    onClose();
    setCurrentScreen('checkout');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      authorName: newReviewAuthor,
      rating: newReviewRating,
      date: 'Today',
      comment: newReviewComment,
      verifiedPurchase: true
    };

    setProducts(prev => prev.map(p => {
      if (p.id === activeProduct.id) {
        const existingReviews = p.reviews || [];
        const updatedReviews = [newRev, ...existingReviews];
        const newAvg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        const updatedProduct = {
          ...p,
          reviews: updatedReviews,
          rating: newAvg,
          reviewCount: updatedReviews.length
        };
        setActiveProduct(updatedProduct);
        return updatedProduct;
      }
      return p;
    }));

    showToast('Thank you! Your verified review has been published.');
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  // Mouse Drag handlers for 360 interactive rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== '360') return;
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartX.current = e.clientX;
    dragStartAngle.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || viewMode !== '360') return;
    const deltaX = e.clientX - dragStartX.current;
    let newAngle = (dragStartAngle.current + deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setRotationAngle(Math.round(newAngle));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Default features list if not custom specified
  const defaultFeatures = activeProduct.features || [
    '100% Kiln-Dried Solid Hardwood Construction',
    'Hand-Carved Traditional Chinioti Floral Relief Work',
    'Multi-Stage Termite & Moisture Resistant Treatment',
    'Premium Lacquer Polish with Natural Wood Grain Visibility',
    'Hand-Fitted Heavy Duty Brass Joinery & Reinforcements'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-4 flex items-center justify-center animate-fadeIn">
      <div className="bg-stone-900 border border-[#d4af37]/50 rounded-2xl max-w-5xl w-full text-white shadow-2xl my-6 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#d4af37] bg-stone-900 border border-[#d4af37]/30 px-2.5 py-1 rounded-md">
              CODE: {activeProduct.code}
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">•</span>
            <span className="text-xs text-stone-300 font-medium hidden sm:inline">{activeProduct.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition"
            aria-label="Close detail view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* LEFT COLUMN: Gallery & Interactive 360 Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* View Mode Toggle Switcher */}
            <div className="flex border border-stone-800 bg-stone-950 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setViewMode('gallery')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  viewMode === 'gallery' ? 'bg-[#d4af37] text-stone-950 font-bold shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Photo Gallery
              </button>
              <button
                onClick={() => setViewMode('360')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  viewMode === '360' ? 'bg-[#d4af37] text-stone-950 font-bold shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" /> 360° Studio View
              </button>
            </div>

            {/* Gallery View Mode */}
            {viewMode === 'gallery' ? (
              <div className="space-y-3">
                <div className="relative aspect-[4/3] bg-stone-950 rounded-xl overflow-hidden border border-stone-800 group shadow-inner">
                  <img
                    src={activeProduct.images[activeImageIndex] || activeProduct.images[0]}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Zoom Lens Button Overlay */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-3 right-3 bg-stone-950/80 hover:bg-[#d4af37] text-amber-200 hover:text-stone-950 p-2 rounded-xl backdrop-blur-md border border-stone-800 hover:border-[#d4af37] transition shadow-lg flex items-center gap-1.5 text-xs font-bold"
                    title="Click for High-Res Inspection Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Zoom Carving</span>
                  </button>

                  {/* Compare Specs Overlay Button */}
                  <button
                    onClick={() => toggleCompare(activeProduct.id)}
                    className={`absolute bottom-3 left-3 p-2 rounded-xl backdrop-blur-md border transition text-xs font-bold flex items-center gap-1.5 shadow-lg ${
                      compareList.includes(activeProduct.id)
                        ? 'bg-[#d4af37] text-stone-950 border-[#d4af37]'
                        : 'bg-stone-950/80 text-amber-200 border-stone-800 hover:border-[#d4af37]'
                    }`}
                    title="Add to Furniture Comparison"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{compareList.includes(activeProduct.id) ? 'Comparing' : 'Compare Specs'}</span>
                  </button>

                  {activeProduct.discountPercent && activeProduct.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-[#d4af37] text-stone-950 font-extrabold text-xs px-2.5 py-1 rounded shadow-md">
                      {activeProduct.discountPercent}% OFF
                    </span>
                  )}

                  {activeProduct.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-amber-950/90 text-amber-300 border border-amber-600/50 font-bold text-[10px] px-2 py-0.5 rounded">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* Thumbnails list */}
                {activeProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {activeProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                          activeImageIndex === idx ? 'border-[#d4af37] scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* 360 Studio View Mode */
              <div className="space-y-3">
                <div 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative aspect-[4/3] bg-stone-950 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                >
                  {/* Rotating Image Projection */}
                  <img
                    src={activeProduct.images[0]}
                    alt={activeProduct.name}
                    style={{
                      transform: `rotateY(${rotationAngle}deg) scale(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05})`,
                      transition: isDragging ? 'none' : 'transform 0.1s linear'
                    }}
                    className="w-full h-full object-cover filter brightness-105 contrast-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* 360 Overlay Badge & Angle Indicator */}
                  <div className="absolute top-3 left-3 bg-stone-950/90 border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-mono px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
                    <Rotate3d className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Angle: {rotationAngle}°</span>
                  </div>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-stone-300 text-[10px] px-3 py-1 rounded-full border border-stone-700 pointer-events-none">
                    Drag horizontally to spin 360°
                  </div>
                </div>

                {/* 360 Controls */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span className="font-bold flex items-center gap-1">
                      <Rotate3d className="w-3.5 h-3.5 text-[#d4af37]" /> Interactive Rotation:
                    </span>
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                        isAutoRotating ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
                      {isAutoRotating ? 'Auto-Spinning' : 'Start Auto-Spin'}
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={rotationAngle}
                    onChange={(e) => {
                      setIsAutoRotating(false);
                      setRotationAngle(Number(e.target.value));
                    }}
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Quick Guarantees Badge */}
            <div className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-200">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="font-bold">{activeProduct.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Delivery: {activeProduct.estimatedDeliveryTime}</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Product Details & Purchase Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                <span className="font-bold uppercase tracking-wider text-[11px] text-[#d4af37]">
                  {activeProduct.brand} • Handcrafted in Chiniot
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleWishlist(activeProduct.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      isWishlisted ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition"
                    title="Share Product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl font-serif font-black text-stone-100 leading-tight">
                {activeProduct.name}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{activeProduct.rating}</span>
                </div>
                <span className="text-stone-400">({activeProduct.reviewCount} Verified Reviews)</span>
                <span className="text-stone-600">|</span>
                <span className="text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
                  {activeProduct.availability} {activeProduct.stockCount ? `(${activeProduct.stockCount} Ready)` : ''}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-stone-950 rounded-xl border border-[#d4af37]/30 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-2xl md:text-3xl font-black font-mono text-[#d4af37]">
                  PKR {displayPrice.toLocaleString()}
                </span>
                {activeProduct.salePrice && (
                  <span className="ml-3 text-sm text-stone-500 line-through font-mono">
                    PKR {activeProduct.price.toLocaleString()}
                  </span>
                )}
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Includes 100% Solid Timber Crafting & Packing
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Material Grade
                </span>
                <span className="text-xs font-semibold text-stone-200">
                  A-Class Solid Wood
                </span>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="space-y-2 text-xs text-stone-300 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">Wood Type:</strong> {activeProduct.woodType}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Box className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">Material & Construction:</strong> {activeProduct.material}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Ruler className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">Dimensions:</strong> {activeProduct.dimensions}
                </div>
              </div>

              {/* Polish & Color Selection */}
              {activeProduct.availableColors.length > 0 && (
                <div className="pt-2 border-t border-stone-800/80">
                  <span className="block text-amber-200 font-bold mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                    Select Polish Finish / Stain:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selectedColor === color
                            ? 'bg-[#d4af37] text-stone-950 font-bold border-amber-300 shadow'
                            : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features Bullet List */}
            <div>
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Mastercraft Features:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-300">
                {defaultFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 bg-stone-950/40 p-2 rounded border border-stone-800/60">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-3">
              <p>{activeProduct.description}</p>
            </div>

            {/* Quantity & Action Buttons Bar */}
            <div className="space-y-3 pt-3 border-t border-stone-800">
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-200 font-bold">Select Quantity:</span>
                <div className="flex items-center gap-3 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-amber-400 font-bold text-base px-2 hover:text-white"
                  >
                    -
                  </button>
                  <span className="font-bold font-mono text-amber-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-amber-400 font-bold text-base px-2 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add To Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => addToCart(activeProduct, quantity, selectedColor)}
                  className="py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-stone-950 font-extrabold rounded-xl text-xs shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Buy Now (Direct Checkout)
                </button>
              </div>

              {/* Direct WhatsApp & Call Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=${whatsappOrderMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Order
                </a>

                <a
                  href={`tel:${contactInfo.salesPhone}`}
                  className="py-2.5 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-600/40 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4" /> Call Sales Team
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="px-6 py-4 bg-stone-950/80 border-t border-stone-800">
            <h3 className="font-serif font-bold text-sm text-amber-200 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#d4af37]" /> Related Chinioti Woodcraft Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setActiveProduct(rel);
                    if (onSelectProduct) onSelectProduct(rel);
                  }}
                  className="p-2.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-[#d4af37]/60 rounded-xl cursor-pointer transition flex items-center gap-3 group"
                >
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0 border border-stone-800 group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden text-xs">
                    <div className="text-[10px] text-amber-400 font-mono">{rel.code}</div>
                    <div className="font-serif font-bold text-stone-200 truncate group-hover:text-[#d4af37]">
                      {rel.name}
                    </div>
                    <div className="text-[#d4af37] font-bold font-mono mt-0.5">
                      PKR {(rel.salePrice || rel.price).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS & RATINGS SECTION */}
        <div className="p-6 bg-stone-950 border-t border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-200">
                Verified Customer Reviews ({activeProduct.reviews?.length || 0})
              </h3>
              <p className="text-xs text-stone-400">Authentic patron feedback across Pakistan</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              {showReviewForm ? 'Cancel Review' : '+ Write Verified Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={submitReview} className="mb-6 p-4 bg-stone-900 rounded-xl border border-amber-900/50 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name & City (e.g. Mian Tariq - Lahore)"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  required
                  className="bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-300">Rating:</span>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-amber-400 outline-none"
                  >
                    <option value={5}>5 Stars - Masterpiece Quality</option>
                    <option value={4}>4 Stars - High Quality Finish</option>
                    <option value={3}>3 Stars - Satisfactory</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Write your review about wood finish, carving, delivery, or custom fit..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                required
                rows={3}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#d4af37] text-stone-950 font-bold text-xs rounded-lg hover:brightness-110"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {activeProduct.reviews && activeProduct.reviews.length > 0 ? (
              activeProduct.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-100">{rev.authorName}</span>
                    <span className="text-stone-500">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`} />
                    ))}
                    {rev.verifiedPurchase && (
                      <span className="ml-2 text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Verified Customer
                      </span>
                    )}
                  </div>
                  <p className="text-stone-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 italic">No customer reviews posted yet. Be the first to review this furniture item!</p>
            )}
          </div>
        </div>

      </div>

      {/* Ultra High-Res Zoom Modal */}
      <ImageZoomModal
        imageUrl={activeProduct.images[activeImageIndex] || activeProduct.images[0]}
        title={activeProduct.name}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

