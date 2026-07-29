import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  CreditCard, 
  Smartphone, 
  ShieldAlert, 
  CheckCircle, 
  ArrowLeft, 
  Truck, 
  Copy, 
  MessageSquare,
  FileText,
  Tag,
  MapPin,
  Check,
  Percent,
  Sparkles,
  Info
} from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';
import { Order } from '../types';

const PROMO_CODES: Record<string, { discountPercent?: number; discountFlat?: number; minSubtotal: number; label: string }> = {
  'IQBAL10': { discountPercent: 10, minSubtotal: 0, label: '10% Royal Customer Discount' },
  'CHINIOT15': { discountPercent: 15, minSubtotal: 100000, label: '15% Master Carving Discount (Orders > 100k)' },
  'WELCOME5000': { discountFlat: 5000, minSubtotal: 50000, label: 'PKR 5,000 Flat Welcome Voucher' }
};

const PAK_CITIES_DELIVERY: Record<string, number> = {
  'Karachi': 3500,
  'Lahore': 6500,
  'Islamabad': 6500,
  'Rawalpindi': 6500,
  'Multan': 7500,
  'Faisalabad': 7500,
  'Peshawar': 8500,
  'Quetta': 8500,
  'Gujranwala': 7500,
  'Sialkot': 7500,
  'Chiniot': 4000,
  'Other Pakistan City': 8500
};

export const CheckoutModal: React.FC = () => {
  const { cart, paymentDetails, placeOrder, setCurrentScreen, showToast, contactInfo, currentUser } = useApp();

  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState(currentUser.addresses?.[0] || '');
  
  // Address selection mode
  const [addressMode, setAddressMode] = useState<'saved' | 'pickup' | 'custom'>('custom');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; label: string; discountPkr: number } | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'JazzCash' | 'EasyPaisa'>('Bank Transfer');
  const [txnRef, setTxnRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isAdvanceConfirmed, setIsAdvanceConfirmed] = useState(false);

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Promo discount calculation
  const discountPkr = appliedPromo ? appliedPromo.discountPkr : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountPkr);

  // Delivery calculation based on city & subtotal threshold
  let baseDeliveryFee = addressMode === 'pickup' ? 0 : (PAK_CITIES_DELIVERY[city] || 8500);
  if (discountedSubtotal >= 300000 || addressMode === 'pickup') {
    baseDeliveryFee = 0; // Free delivery for royal orders > 300k PKR or self pickup
  }

  const deliveryCharge = baseDeliveryFee;
  const totalAmount = discountedSubtotal + deliveryCharge;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const promoDef = PROMO_CODES[code];
    if (!promoDef) {
      showToast('Invalid promo code! Try IQBAL10 or WELCOME5000.');
      return;
    }

    if (subtotal < promoDef.minSubtotal) {
      showToast(`Promo "${code}" requires minimum subtotal of PKR ${promoDef.minSubtotal.toLocaleString()}`);
      return;
    }

    let calculatedDiscount = 0;
    if (promoDef.discountPercent) {
      calculatedDiscount = Math.round((subtotal * promoDef.discountPercent) / 100);
    } else if (promoDef.discountFlat) {
      calculatedDiscount = promoDef.discountFlat;
    }

    setAppliedPromo({
      code,
      label: promoDef.label,
      discountPkr: calculatedDiscount
    });

    showToast(`Promo Code ${code} applied! Saved PKR ${calculatedDiscount.toLocaleString()}`);
    setPromoInput('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const handleSavedAddressSelect = (savedAddrId: string) => {
    const saved = currentUser.savedAddresses?.find(a => a.id === savedAddrId);
    if (saved) {
      setAddress(saved.address);
      setCity(saved.city);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || (!address && addressMode !== 'pickup')) {
      showToast('Please fill all required customer and shipping address fields.');
      return;
    }

    if (!txnRef) {
      showToast('Please enter your payment Transaction Reference / ID.');
      return;
    }

    if (!isAdvanceConfirmed) {
      showToast('Please check the box confirming you transferred 100% advance payment.');
      return;
    }

    const orderItems = cart.map(i => ({
      productId: i.product.id,
      productCode: i.product.code,
      productName: i.product.name,
      price: i.product.salePrice || i.product.price,
      quantity: i.quantity,
      selectedColor: i.selectedColor,
      image: i.product.images[0]
    }));

    const finalAddress = addressMode === 'pickup' 
      ? 'Showroom Self-Pickup (Plot 45-C, Main Blvd, DHA Phase 6, Karachi)'
      : address;

    const order = placeOrder({
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      customerName,
      phone,
      whatsapp: whatsapp || phone,
      email,
      city: addressMode === 'pickup' ? 'Karachi (Pickup)' : city,
      shippingAddress: finalAddress,
      paymentMethod,
      paymentReferenceTxn: txnRef,
      paymentProofNote: `${paymentNotes} ${appliedPromo ? `[Promo Applied: ${appliedPromo.code} - PKR ${appliedPromo.discountPkr.toLocaleString()}]` : ''}`,
      paymentStatus: 'Pending 100% Advance Verification',
      orderStatus: 'Order Received',
      estimatedDeliveryDate: addressMode === 'pickup' ? 'Ready in 24 Hours' : '5-7 Working Days'
    });

    setPlacedOrder(order);
    setIsSubmitted(true);
  };

  if (isSubmitted && placedOrder) {
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum IQBAL WOODCRAFT!\nI have placed order ${placedOrder.orderNumber} on your app.\n\nCustomer: ${customerName}\nPhone: ${phone}\nCity: ${city}\nTotal Amount: PKR ${totalAmount.toLocaleString()}\nPayment Method: ${paymentMethod}\nTxn Reference ID: ${txnRef}\n\nPlease verify my 100% advance payment and begin wood crafting dispatch.`
    );

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-white animate-fadeIn">
        <div className="bg-stone-900 border border-[#d4af37] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#d4af37]/20 border border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs text-amber-400 font-mono uppercase tracking-widest">
              Order Submitted & Advance Payment Received
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 mt-1">
              Order #{placedOrder.orderNumber} Placed
            </h2>
            <p className="text-stone-300 text-xs md:text-sm mt-2 max-w-lg mx-auto">
              Thank you, <strong className="text-amber-200">{customerName}</strong>. Your payment reference (<code className="text-amber-400 font-mono">{txnRef}</code>) is logged with the admin team for verification.
            </p>
          </div>

          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Total Paid (100% Advance):</span>
              <span className="font-bold font-mono text-[#d4af37]">PKR {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Delivery Address:</span>
              <span className="text-amber-100 text-right">{address}, {city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Estimated Delivery:</span>
              <span className="text-emerald-400 font-semibold">5-7 Days via Insured Bilty</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#d4af37] text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
            >
              <FileText className="w-4 h-4" /> View / Print Official Invoice
            </button>

            <a
              href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Send Payment Receipt on WhatsApp
            </a>

            <button
              onClick={() => setCurrentScreen('my-orders')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-800 rounded-xl font-bold text-xs"
            >
              Track Order Status
            </button>
          </div>
        </div>

        {/* Invoice Modal Popup */}
        <InvoiceModal order={placedOrder} onClose={() => setShowInvoiceModal(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-white space-y-6">
      
      {/* Top Bar Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentScreen('cart')}
          className="p-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-amber-100">
            Royal Furniture Checkout & Payment
          </h1>
          <p className="text-xs text-[#d4af37] font-mono">
            100% Advance Payment Policy • Direct Bank Transfer, JazzCash & EasyPaisa
          </p>
        </div>
      </div>

      {/* 100% ADVANCE PAYMENT MANDATORY BANNER */}
      <div className="bg-amber-950/80 border border-amber-600/70 rounded-2xl p-4 flex items-start gap-3 text-amber-200">
        <ShieldAlert className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-extrabold text-sm text-[#d4af37] uppercase tracking-wider block">
            100% ADVANCE PAYMENT MANDATORY — NO CASH ON DELIVERY (COD)
          </span>
          <p className="text-stone-300 leading-relaxed">
            Due to high-value solid Sheesham wood crafting, custom sizing, and heavy cargo bilty logistics, Cash on Delivery is strictly not available. Orders enter wood workshop assembly immediately upon 100% advance payment verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Address & Payment Method Form */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Customer Details & Address Selection */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" /> 1. Customer & Shipping Address
              </span>
              <span className="text-[10px] text-stone-400">Step 1 of 2</span>
            </h3>

            {/* Address Mode Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {currentUser.savedAddresses && currentUser.savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddressMode('saved')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    addressMode === 'saved' ? 'bg-[#d4af37] text-stone-950 border-amber-300' : 'bg-stone-950 text-stone-300 border-stone-800'
                  }`}
                >
                  Saved Addresses
                </button>
              )}

              <button
                type="button"
                onClick={() => setAddressMode('custom')}
                className={`p-2.5 rounded-xl border text-center font-bold transition ${
                  addressMode === 'custom' ? 'bg-[#d4af37] text-stone-950 border-amber-300' : 'bg-stone-950 text-stone-300 border-stone-800'
                }`}
              >
                New Address
              </button>

              <button
                type="button"
                onClick={() => setAddressMode('pickup')}
                className={`p-2.5 rounded-xl border text-center font-bold transition ${
                  addressMode === 'pickup' ? 'bg-amber-600 text-white border-amber-400' : 'bg-stone-950 text-stone-300 border-stone-800'
                }`}
              >
                Showroom Pickup
              </button>
            </div>

            {/* Saved Address Selector Dropdown */}
            {addressMode === 'saved' && currentUser.savedAddresses && (
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs">
                <label className="block text-stone-300 font-bold">Select Saved Address:</label>
                <select
                  onChange={(e) => handleSavedAddressSelect(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-amber-100 outline-none"
                >
                  {currentUser.savedAddresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label} — {addr.address}, {addr.city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pickup Info Banner */}
            {addressMode === 'pickup' && (
              <div className="p-3 bg-stone-950 rounded-xl border border-amber-900/60 text-xs text-amber-200">
                <strong className="block text-amber-300 mb-1">Showroom Pickup Location:</strong>
                <p className="text-stone-300">
                  Plot 45-C, Main Boulevard, DHA Phase 6, Karachi. (Zero Cargo Fee)
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mian Tariq Hassan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  placeholder="0302-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="0309-XXXXXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">City (Cargo Freight Rate) *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={addressMode === 'pickup'}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                >
                  {Object.keys(PAK_CITIES_DELIVERY).map(cName => (
                    <option key={cName} value={cName}>
                      {cName} (Est Cargo: PKR {PAK_CITIES_DELIVERY[cName].toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {addressMode !== 'pickup' && (
              <div>
                <label className="block text-xs text-stone-300 mb-1">Complete Street / Area Shipping Address *</label>
                <textarea
                  placeholder="House No, Street Name, Block / Phase, Nearby Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
                />
              </div>
            )}
          </div>

          {/* Payment Method Selector & Accounts Details */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 text-sm flex items-center justify-between">
              <span>2. Select 100% Advance Payment Method</span>
              <span className="text-[10px] text-stone-400">Step 2 of 2</span>
            </h3>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Bank Transfer')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'Bank Transfer'
                    ? 'bg-[#d4af37] text-stone-950 border-amber-300 shadow'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Bank IBAN</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('JazzCash')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'JazzCash'
                    ? 'bg-amber-600 text-white border-amber-400 shadow'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>JazzCash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('EasyPaisa')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'EasyPaisa'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>EasyPaisa</span>
              </button>
            </div>

            {/* Display Selected Account Details with One-Click Copy */}
            <div className="p-4 bg-stone-950 rounded-xl border border-amber-900/60 text-xs space-y-2">
              {paymentMethod === 'Bank Transfer' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Bank Name:</span>
                    <span className="font-bold text-amber-200">{paymentDetails.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Account Title:</span>
                    <span className="font-bold text-amber-200">{paymentDetails.accountTitle}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-stone-400">IBAN Number:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentDetails.iban, 'IBAN')}
                      className="font-mono text-[#d4af37] font-bold flex items-center gap-1 hover:underline"
                    >
                      {paymentDetails.iban}
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {paymentMethod === 'JazzCash' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">JazzCash Title:</span>
                    <span className="font-bold text-amber-200">{paymentDetails.jazzCashTitle}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-stone-400">JazzCash Mobile:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentDetails.jazzCashNumber, 'JazzCash')}
                      className="font-mono text-[#d4af37] font-bold flex items-center gap-1 hover:underline"
                    >
                      {paymentDetails.jazzCashNumber}
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {paymentMethod === 'EasyPaisa' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">EasyPaisa Title:</span>
                    <span className="font-bold text-amber-200">{paymentDetails.easyPaisaTitle}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-stone-400">EasyPaisa Mobile:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentDetails.easyPaisaNumber, 'EasyPaisa')}
                      className="font-mono text-[#d4af37] font-bold flex items-center gap-1 hover:underline"
                    >
                      {paymentDetails.easyPaisaNumber}
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Transaction Reference ID Input */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Payment Transaction Reference / Txn ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. MEZN-908123 / JazzCash Txn 9821"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-amber-100 font-mono outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Payment Notes / Timestamp (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Transferred PKR 325,000 at 2:30 PM via mobile app"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-100 outline-none"
                />
              </div>

              {/* 100% Advance Payment Confirmation Checkbox */}
              <div className="p-3 bg-stone-950 border border-amber-900/50 rounded-xl flex items-start gap-2">
                <input
                  type="checkbox"
                  id="adv-confirm"
                  checked={isAdvanceConfirmed}
                  onChange={(e) => setIsAdvanceConfirmed(e.target.checked)}
                  required
                  className="mt-1 accent-[#d4af37] w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="adv-confirm" className="text-xs text-stone-300 cursor-pointer select-none">
                  <strong className="text-amber-200">Payment Acknowledgement:</strong> I confirm I have transferred 100% advance payment (PKR {totalAmount.toLocaleString()}) to IQBAL WOODCRAFT official account.
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-stone-950 font-extrabold text-sm rounded-xl shadow-2xl hover:brightness-110 uppercase tracking-wider transition"
          >
            Submit Order & Verify 100% Advance Payment
          </button>
        </form>

        {/* Right Column: Promo Code & Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Promo Code Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-xs space-y-3">
            <h4 className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#d4af37]" /> Apply Royal Promo Code
            </h4>
            
            {appliedPromo ? (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{appliedPromo.code}</span>
                  <p className="text-[10px] text-stone-300">{appliedPromo.label}</p>
                </div>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="text-xs text-red-400 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. IQBAL10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-amber-100 font-mono uppercase outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#d4af37] text-stone-950 font-bold rounded-xl hover:brightness-110"
                >
                  Apply
                </button>
              </div>
            )}
            
            <div className="text-[10px] text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d4af37]" /> Available: <code className="text-amber-300">IQBAL10</code> (10% OFF), <code className="text-amber-300">WELCOME5000</code>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-xs space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-amber-200 border-b border-stone-800 pb-2 text-sm">
              Order Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 border-b border-stone-800/60 pb-2">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-stone-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h5 className="font-serif font-bold text-amber-100 line-clamp-1">{item.product.name}</h5>
                    <span className="text-[10px] text-stone-400">
                      Qty: {item.quantity} | {item.selectedColor || 'Default Finish'}
                    </span>
                  </div>
                  <span className="font-bold text-[#d4af37] font-mono">
                    PKR {((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-800">
              <div className="flex justify-between text-stone-300">
                <span>Items Subtotal:</span>
                <span className="font-mono">PKR {subtotal.toLocaleString()}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({appliedPromo.code}):</span>
                  <span className="font-mono">- PKR {appliedPromo.discountPkr.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-emerald-400">
                <span>Insured Cargo Shipping:</span>
                <span className="font-mono">
                  {deliveryCharge === 0 ? 'FREE (Over 300k / Pickup)' : `PKR ${deliveryCharge.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-[#d4af37] pt-2 border-t border-stone-800">
                <span>Total Payable (100% Advance):</span>
                <span>PKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              Safe Pan-Pakistan Cargo Delivery
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              All furniture pieces are enclosed in multi-layer corrugated padding and custom timber crates for 100% transit safety.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
