import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, MessageSquare, Star, ShieldCheck, Eye, PhoneCall } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, wishlist, toggleWishlist, contactInfo } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const displayPrice = product.salePrice || product.price;

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum IQBAL WOODCRAFT!\nI want to order this furniture item:\n- Name: ${product.name}\n- Code: ${product.code}\n- Price: PKR ${displayPrice.toLocaleString()}\n- Wood: ${product.woodType}\n\nPlease confirm availability & delivery details.`
  );

  return (
    <div className="group bg-stone-900 border border-stone-800 hover:border-[#d4af37]/60 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#d4af37] text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow uppercase">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-900/90 text-amber-200 border border-amber-600/50 font-bold text-[10px] px-2 py-0.5 rounded">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition ${
            isWishlisted ? 'bg-amber-600 text-white' : 'bg-black/60 text-stone-300 hover:text-white'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Hint */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black/80 text-amber-300 text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 font-medium border border-amber-500/30">
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Code & Category */}
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-1">
            <span>{product.code}</span>
            <span className="text-stone-400 font-sans">{product.category}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-serif font-bold text-base text-amber-100 hover:text-[#d4af37] cursor-pointer transition line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Wood Type Badge */}
          <div className="mt-2 flex items-center gap-1 text-[11px] text-stone-300 bg-stone-950/80 px-2 py-1 rounded border border-stone-800 w-fit">
            <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
            <span className="truncate max-w-[200px]">{product.woodType}</span>
          </div>

          {/* Price & Rating */}
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <div>
              <span className="text-lg font-extrabold text-[#d4af37]">
                PKR {displayPrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="ml-2 text-xs text-stone-500 line-through">
                  PKR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-4 pt-3 border-t border-stone-800 grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add To Cart
          </button>

          <a
            href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
