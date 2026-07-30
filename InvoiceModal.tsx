import React from 'react';
import { Order } from '../types';
import { X, Printer, ShieldCheck, Download, CheckCircle2, Building2 } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../data/mockData';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto p-4 flex items-center justify-center animate-fadeIn">
      <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-6 relative print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-950 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <span className="font-serif font-bold text-amber-100 text-sm">
              Official Tax & Crafting Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#d4af37] text-stone-950 font-bold text-xs rounded-lg hover:brightness-110 flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 space-y-6 bg-stone-900 print:bg-white print:text-black">
          
          {/* Company Branding & Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-stone-800 print:border-stone-300 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-serif font-black text-[#d4af37] print:text-amber-800">
                  IQBAL WOODCRAFT
                </span>
              </div>
              <p className="text-xs text-stone-300 print:text-stone-700 font-serif italic">
                Handcrafted Solid Sheesham & Teak Furniture • Master Artisans Since 1984
              </p>
              <p className="text-[11px] text-stone-400 print:text-stone-600 mt-2 leading-relaxed">
                Plot 45-C, Main Boulevard, DHA Phase 6, Karachi, Pakistan<br/>
                Showroom Tel: 0302-0940219 | WhatsApp: 0309-3509242<br/>
                NTN/GST Registered: 892041-3
              </p>
            </div>

            <div className="text-left sm:text-right bg-stone-950 print:bg-stone-100 p-4 rounded-xl border border-stone-800 print:border-stone-300 text-xs space-y-1">
              <span className="font-mono text-xs font-bold text-[#d4af37] print:text-amber-800 block">
                INVOICE #{order.orderNumber.replace('IWC-', 'INV-')}
              </span>
              <div className="text-stone-300 print:text-stone-800">
                <strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026-07-28'}
              </div>
              <div className="text-stone-300 print:text-stone-800">
                <strong>Payment Type:</strong> 100% Advance ({order.paymentMethod})
              </div>
              <div className="text-emerald-400 print:text-emerald-700 font-bold flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {order.paymentStatus}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-950 print:bg-stone-50 rounded-xl border border-stone-800 print:border-stone-300">
              <span className="font-bold text-amber-200 print:text-stone-900 block mb-1 uppercase tracking-wider text-[10px]">
                Billed & Shipped To:
              </span>
              <div className="font-bold text-stone-100 print:text-stone-900 text-sm">{order.customerName}</div>
              <div className="text-stone-300 print:text-stone-700 mt-0.5">{order.shippingAddress}</div>
              <div className="text-stone-400 print:text-stone-600 mt-0.5">{order.city}, Pakistan</div>
              <div className="text-stone-400 print:text-stone-600 mt-1 font-mono">
                Phone: {order.phone} {order.whatsapp ? `| WA: ${order.whatsapp}` : ''}
              </div>
            </div>

            <div className="p-3.5 bg-stone-950 print:bg-stone-50 rounded-xl border border-stone-800 print:border-stone-300">
              <span className="font-bold text-amber-200 print:text-stone-900 block mb-1 uppercase tracking-wider text-[10px]">
                Advance Payment Txn Info:
              </span>
              <div className="text-stone-300 print:text-stone-800">
                <strong>Method:</strong> {order.paymentMethod}
              </div>
              <div className="text-stone-300 print:text-stone-800 font-mono">
                <strong>Txn Ref ID:</strong> <code className="text-[#d4af37] print:text-stone-900 font-bold">{order.paymentReferenceTxn}</code>
              </div>
              {order.cargoBiltyNumber && (
                <div className="text-emerald-400 print:text-emerald-800 font-mono mt-1 font-bold">
                  Cargo Bilty No: {order.cargoBiltyNumber}
                </div>
              )}
              <div className="text-stone-400 print:text-stone-600 text-[11px] mt-1 italic">
                Verified by IQBAL WOODCRAFT Accounts Department.
              </div>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-950 print:bg-stone-200 text-amber-200 print:text-stone-900 border-b border-stone-800 print:border-stone-400">
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Item Description & Finish</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Total (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 print:divide-stone-300">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-950/50">
                    <td className="p-2.5 font-mono text-[#d4af37] print:text-stone-800">{item.productCode}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-stone-100 print:text-stone-900">{item.productName}</div>
                      <div className="text-[10px] text-stone-400 print:text-stone-600">Finish: {item.selectedColor || 'Natural Sheesham Polish'}</div>
                    </td>
                    <td className="p-2.5 text-center font-bold text-stone-200 print:text-stone-900">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono text-stone-300 print:text-stone-800">PKR {item.price.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-stone-100 print:text-stone-900">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-stone-800 print:border-stone-300">
            
            {/* Warranty Certificate Badge */}
            <div className="p-3 bg-amber-950/40 print:bg-amber-50 border border-amber-800/60 print:border-amber-300 rounded-xl max-w-sm text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#d4af37] print:text-amber-800">
                <ShieldCheck className="w-4 h-4" /> 10-Year Termite & Seasoning Warranty
              </div>
              <p className="text-stone-300 print:text-stone-700 leading-snug">
                This document certifies that all wood used is 100% Kiln-Dried Solid Sheesham / Teak. Guaranteed against termites, splitting, and warping under standard indoor use for 10 years.
              </p>
            </div>

            {/* Price Calculations */}
            <div className="w-full sm:w-64 space-y-2 text-xs bg-stone-950 print:bg-stone-100 p-4 rounded-xl border border-stone-800 print:border-stone-300">
              <div className="flex justify-between text-stone-300 print:text-stone-700">
                <span>Subtotal:</span>
                <span className="font-mono">PKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Insured Cargo Shipping:</span>
                <span className="font-mono">PKR {order.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#d4af37] print:text-stone-900 pt-2 border-t border-stone-800 print:border-stone-400">
                <span>Grand Total Paid:</span>
                <span>PKR {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Footer Terms */}
          <div className="text-center pt-4 border-t border-stone-800 print:border-stone-300 text-[10px] text-stone-400 print:text-stone-600 space-y-1">
            <p className="font-bold text-amber-200 print:text-stone-800">
              Thank you for choosing IQBAL WOODCRAFT. Handcrafted with devotion in Chiniot & Karachi.
            </p>
            <p>
              For dispatch status or modifications, contact Sales & App Executive Muhammad Zahid Iqbal: 0302-0940219
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
