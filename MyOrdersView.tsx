import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Truck, Search, CheckCircle2, Clock, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order } from '../types';

const LIFECYCLE_STEPS = [
  'Order Received',
  'Payment Confirmed',
  'Wood Workshop Assembly',
  'Polishing & Quality Check',
  'Dispatched via Cargo Bilty',
  'Delivered'
];

export const MyOrdersView: React.FC = () => {
  const { orders, contactInfo, setCurrentScreen } = useApp();
  const [biltySearch, setBiltySearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (!biltySearch.trim()) return true;
    const q = biltySearch.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || 
           (o.cargoBiltyNumber && o.cargoBiltyNumber.toLowerCase().includes(q)) ||
           o.customerName.toLowerCase().includes(q) ||
           o.phone.includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-white space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Cargo Bilty Tracking & Realtime History
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-amber-100 mt-1">
            My Orders & Cargo Shipment Tracking
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track real-time woodcrafting progress, view tax invoices, and check cargo bilty numbers across Pakistan.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search Order # or Bilty ID..."
            value={biltySearch}
            onChange={(e) => setBiltySearch(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 pl-9 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
          />
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="font-serif font-bold text-amber-200 text-lg">No Orders Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              You have not placed any furniture orders yet or no match for "{biltySearch}".
            </p>
            <button
              onClick={() => setCurrentScreen('products')}
              className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-lg hover:brightness-110"
            >
              Browse Furniture Collection
            </button>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const currentStepIdx = LIFECYCLE_STEPS.indexOf(ord.orderStatus);

            return (
              <div key={ord.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6 relative">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-[#d4af37] font-extrabold">Order #{ord.orderNumber}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold ${
                        ord.paymentStatus === 'Payment Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-800 text-stone-300 border border-stone-700">
                        {ord.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1">
                      Customer: <strong className="text-amber-100">{ord.customerName}</strong> ({ord.phone}) • {ord.city}
                    </p>
                  </div>

                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                    <div>
                      <span className="text-xl font-black text-[#d4af37]">PKR {ord.totalAmount.toLocaleString()}</span>
                      {ord.cargoBiltyNumber ? (
                        <p className="text-xs text-emerald-400 font-mono font-bold flex items-center justify-end gap-1 mt-0.5">
                          <Truck className="w-3.5 h-3.5" />
                          Cargo Bilty: {ord.cargoBiltyNumber}
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-500 italic mt-0.5">Bilty assigned upon cargo dispatch</p>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Official Invoice
                    </button>
                  </div>
                </div>

                {/* Status Timeline Steps */}
                <div className="py-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Woodcrafting & Delivery Progress</span>
                    <span className="text-stone-400 font-mono text-[10px] font-normal">
                      Est. Delivery: {ord.estimatedDeliveryDate || '5-7 Working Days'}
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {LIFECYCLE_STEPS.map((stepName, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div
                          key={stepName}
                          className={`p-2.5 rounded-xl border text-center text-xs space-y-1 transition ${
                            isCurrent
                              ? 'bg-[#d4af37] text-stone-950 font-extrabold border-amber-300 shadow-md'
                              : isCompleted
                              ? 'bg-amber-950/80 text-amber-200 border-amber-800'
                              : 'bg-stone-950 text-stone-600 border-stone-800'
                          }`}
                        >
                          <div className="flex justify-center">
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <span className="block text-[10px] leading-tight">{stepName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 text-xs space-y-2">
                  <span className="font-bold text-amber-200 block mb-2">Order Items ({ord.items.length}):</span>
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-800" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-stone-200 font-bold block">{item.productName}</span>
                            <span className="text-[10px] text-amber-400 font-mono">Code: {item.productCode} | Finish: {item.selectedColor || 'Standard'}</span>
                          </div>
                        </div>
                        <span className="text-stone-300 font-mono font-bold">
                          Qty: {item.quantity} • PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls & WhatsApp Help */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400 pt-2 border-t border-stone-800">
                  <div className="font-mono text-[11px]">
                    Txn Ref: <span className="text-amber-300 font-bold">{ord.paymentReferenceTxn}</span>
                  </div>

                  <a
                    href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT,%20I%20am%20inquiring%20about%20Order%20${ord.orderNumber}%20(Txn:%20${ord.paymentReferenceTxn})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp Support Inquiry
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal for selected order */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
