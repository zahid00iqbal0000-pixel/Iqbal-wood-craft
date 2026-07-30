import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingCart, MessageSquare, ShieldAlert, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    setCurrentScreen,
    contactInfo 
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Cargo estimated fee
  const deliveryEstimate = subtotal > 0 ? (subtotal > 200000 ? 5000 : 8500) : 0;
  const grandTotal = subtotal + deliveryEstimate;

  const generateWhatsAppCartMsg = () => {
    const itemsList = cart.map(i => `- ${i.product.name} (${i.product.code}) x${i.quantity} [${i.selectedColor || 'Default'}]`).join('\n');
    return encodeURIComponent(
      `Assalam-o-Alaikum IQBAL WOODCRAFT!\nI want to place an order for the following items:\n\n${itemsList}\n\nSubtotal: PKR ${subtotal.toLocaleString()}\nCargo Shipping (Est.): PKR ${deliveryEstimate.toLocaleString()}\nGrand Total: PKR ${grandTotal.toLocaleString()}\n\nNote: I am aware of the 100% Advance Payment policy. Please share account details for Bank Transfer / JazzCash / EasyPaisa.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-stone-900 border-l border-[#d4af37]/50 w-full max-w-md h-full flex flex-col justify-between text-white shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif font-bold text-lg text-amber-100">
              Your Furniture Cart ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 100% Advance Payment Warning Banner */}
        <div className="bg-amber-950/90 border-b border-amber-800/80 px-4 py-2.5 text-xs text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold uppercase text-amber-300">Strict Advance Payment Policy:</span>
            <p className="text-[11px] text-stone-300">
              Cash on Delivery (COD) is NOT available for furniture. 100% Advance Payment required via Bank Transfer / JazzCash / EasyPaisa before workshop dispatch.
            </p>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 text-stone-600 mx-auto" />
              <p className="text-stone-400 text-sm">Your shopping cart is currently empty.</p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentScreen('products');
                }}
                className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-lg hover:brightness-110"
              >
                Browse Master Furniture Collection
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.product.salePrice || item.product.price;
              return (
                <div key={item.product.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex gap-3 relative">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-800"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between pr-6">
                      <h4 className="font-serif font-bold text-xs text-amber-100 line-clamp-1">
                        {item.product.name}
                      </h4>
                    </div>

                    <p className="text-[10px] text-amber-400 font-mono">
                      CODE: {item.product.code} | {item.selectedColor || 'Default Finish'}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-extrabold text-[#d4af37]">
                        PKR {(itemPrice * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-2 py-0.5 rounded">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="text-amber-400 font-bold px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="text-amber-400 font-bold px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="absolute top-2 right-2 text-stone-500 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Totals & Checkout Options */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-mono text-amber-100">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Estimated Cargo Shipping:
                </span>
                <span className="font-mono">PKR {deliveryEstimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#d4af37] pt-2 border-t border-stone-800">
                <span>Total Payable (100% Advance):</span>
                <span>PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentScreen('checkout');
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-black font-extrabold rounded-xl text-xs shadow-lg hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>Proceed to Bank / Online Advance Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=${generateWhatsAppCartMsg()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                Order Directly via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
