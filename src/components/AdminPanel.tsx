import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, CustomOrderRequest, PaymentAccountDetails, WoodType } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Wrench, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Bell, 
  TrendingUp, 
  Truck, 
  ShieldCheck,
  Search,
  Bot,
  Sparkles,
  HelpCircle,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

const WOOD_OPTIONS: WoodType[] = [
  'Solid Sheesham (Chinioti Rosewood)',
  'Teak Wood (Sagwan)',
  'Walnut Wood (Akhrot)',
  'Oak Wood',
  'High-Grade MDF with Tactile Veneer',
  'Mahogany Wood'
];

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    setProducts, 
    orders, 
    updateOrderStatus, 
    customOrders, 
    updateCustomOrderStatus, 
    paymentDetails, 
    updatePaymentDetails,
    aiFaqs,
    addAiFaq,
    deleteAiFaq,
    aiConversations,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'custom' | 'ai' | 'payments' | 'notifications'>('dashboard');

  // FAQ Form State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState<'Products' | 'Payment' | 'Delivery' | 'Custom Furniture' | 'Warranty'>('Payment');
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(CATEGORIES[0].name);
  const [prodPrice, setProdPrice] = useState(150000);
  const [prodSalePrice, setProdSalePrice] = useState(125000);
  const [prodWood, setProdWood] = useState<WoodType>('Solid Sheesham (Chinioti Rosewood)');
  const [prodDimensions, setProdDimensions] = useState('78" L x 72" W x 48" H');
  const [prodImgUrl, setProdImgUrl] = useState('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80');
  const [prodDesc, setProdDesc] = useState('');

  // Payment Details Form State
  const [editingPayment, setEditingPayment] = useState<PaymentAccountDetails>(paymentDetails);

  // Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus.includes('Pending')).length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCode) return;

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        code: prodCode,
        name: prodName,
        category: prodCategory,
        price: prodPrice,
        salePrice: prodSalePrice,
        woodType: prodWood,
        dimensions: prodDimensions,
        images: [prodImgUrl, ...p.images.slice(1)],
        description: prodDesc || p.description
      } : p));
      showToast('Product updated successfully!');
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        code: prodCode,
        name: prodName,
        brand: 'IQBAL WOODCRAFT',
        category: prodCategory,
        images: [prodImgUrl],
        price: prodPrice,
        salePrice: prodSalePrice,
        discountPercent: Math.round(((prodPrice - prodSalePrice) / prodPrice) * 100),
        material: `Seasoned ${prodWood}`,
        woodType: prodWood,
        dimensions: prodDimensions,
        availableColors: ['Walnut High Gloss', 'Dark Mahogany'],
        description: prodDesc || 'Handcrafted masterpiece engineered by Iqbal Woodcraft master artisans.',
        warranty: '10 Years Termite Guarantee',
        availability: 'In Stock',
        estimatedDeliveryTime: '5-7 Working Days',
        rating: 5.0,
        reviewCount: 1
      };
      setProducts(prev => [newProd, ...prev]);
      showToast('New Furniture Product added to Showroom Catalog!');
    }

    setIsProductModalOpen(false);
    resetProductForm();
  };

  const editProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setProdCode(prod.code);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdSalePrice(prod.salePrice || prod.price);
    setProdWood(prod.woodType);
    setProdDimensions(prod.dimensions);
    setProdImgUrl(prod.images[0]);
    setProdDesc(prod.description);
    setIsProductModalOpen(true);
  };

  const deleteProductClick = (id: string) => {
    if (confirm('Are you sure you want to delete this furniture item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted from catalog.');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdCode(`IWC-${Math.floor(100 + Math.random() * 900)}`);
    setProdName('');
    setProdPrice(150000);
    setProdSalePrice(125000);
    setProdDesc('');
  };

  const handleSavePaymentAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentDetails(editingPayment);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle) return;
    showToast(`Push Notification Sent: "${notifTitle}"`);
    setNotifTitle('');
    setNotifMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 text-white">
      {/* Admin Header */}
      <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#d4af37] text-black font-extrabold px-2 py-0.5 rounded uppercase">
              Admin Access Active
            </span>
            <span className="text-xs text-stone-400 font-mono">DHA Phase 6 Showroom Terminal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-amber-100 mt-1">
            IQBAL WOODCRAFT Management Dashboard
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'dashboard' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'products' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'orders' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'custom' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Custom Inquiries ({customOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'ai' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" />
            AI Assistant & Knowledge ({aiConversations.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'payments' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank Accounts
          </button>
        </div>
      </div>

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Total Showroom Revenue</span>
              <div className="text-2xl font-black text-[#d4af37] font-mono">
                PKR {totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">100% Advance Verified Payments</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Total Customer Orders</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {orders.length} Orders
              </div>
              <span className="text-[10px] text-amber-400 font-medium">{pendingPayments} Pending Verification</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Custom Order Inquiries</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {customOrders.length} Requests
              </div>
              <span className="text-[10px] text-stone-400">Tailor-made Sheesham & Teak</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Furniture Catalog Items</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {products.length} Products
              </div>
              <span className="text-[10px] text-stone-400">Across 15 Categories</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-amber-200 text-lg border-b border-stone-800 pb-2">
              Quick Admin Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#d4af37] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                Add New Furniture Product
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2.5 bg-stone-800 border border-stone-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                Update Cargo Bilty Numbers
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2.5 bg-stone-800 border border-stone-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                Update Bank IBAN Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-amber-100">
              Showroom Furniture Inventory ({products.length})
            </h2>
            <button
              onClick={() => {
                resetProductForm();
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#d4af37] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-amber-300 font-bold uppercase border-b border-stone-800">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Wood Species</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-950/50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={prod.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <span className="font-bold text-amber-100">{prod.name}</span>
                      </td>
                      <td className="p-3 font-mono text-amber-400">{prod.code}</td>
                      <td className="p-3">{prod.category}</td>
                      <td className="p-3">{prod.woodType}</td>
                      <td className="p-3 font-bold text-[#d4af37]">PKR {(prod.salePrice || prod.price).toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => editProductClick(prod)}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProductClick(prod.id)}
                          className="p-1.5 bg-stone-800 hover:bg-red-900 text-red-300 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-amber-100">
            Customer Orders & Cargo Dispatch ({orders.length})
          </h2>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#d4af37] font-bold">Order #{ord.orderNumber}</span>
                    <h4 className="font-serif font-bold text-amber-100 text-base">{ord.customerName} ({ord.phone})</h4>
                    <p className="text-stone-400 text-xs">{ord.shippingAddress}, {ord.city}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-[#d4af37]">PKR {ord.totalAmount.toLocaleString()}</span>
                    <p className="text-[11px] text-amber-300 font-mono">
                      Txn Ref: <code className="text-white bg-black px-1 rounded">{ord.paymentReferenceTxn || 'N/A'}</code> ({ord.paymentMethod})
                    </p>
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Payment Verification Status:</label>
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => updateOrderStatus(ord.id, ord.orderStatus, e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-300 rounded-lg p-2 font-bold"
                    >
                      <option value="Pending 100% Advance Verification">Pending 100% Advance Verification</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Production & Crafting Lifecycle:</label>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-300 rounded-lg p-2 font-bold"
                    >
                      <option value="Order Received">Order Received</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Wood Workshop Assembly">Wood Workshop Assembly</option>
                      <option value="Polishing & Quality Check">Polishing & Quality Check</option>
                      <option value="Dispatched via Cargo Bilty">Dispatched via Cargo Bilty</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Cargo Bilty Tracking Number:</label>
                    <input
                      type="text"
                      placeholder="e.g. NLC-KAR-89104"
                      defaultValue={ord.cargoBiltyNumber || ''}
                      onBlur={(e) => updateOrderStatus(ord.id, ord.orderStatus, ord.paymentStatus, e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-100 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Manage Custom Inquiries */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-amber-100">
            Custom Furniture Requests ({customOrders.length})
          </h2>

          <div className="space-y-4">
            {customOrders.map((cust) => (
              <div key={cust.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-stone-800 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-amber-200 text-base">{cust.preferredDesignTitle}</h4>
                    <p className="text-stone-300">Client: {cust.customerName} ({cust.phone}) - {cust.city}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-bold">
                    {cust.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-300">
                  <div><strong>Category:</strong> {cust.category}</div>
                  <div><strong>Wood:</strong> {cust.woodType}</div>
                  <div><strong>Dimensions:</strong> {cust.dimensions}</div>
                  <div><strong>Budget:</strong> PKR {cust.budgetPkr.toLocaleString()}</div>
                </div>

                <p className="text-stone-400 italic">"{cust.specialRequirements}"</p>

                {/* Admin Status Updater */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-400 font-bold">Update Status:</span>
                  {(['Pending Review', 'In Discussion', 'Quote Sent', 'Payment Received', 'In Crafting Phase', 'Dispatched'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateCustomOrderStatus(cust.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        cust.status === st ? 'bg-[#d4af37] text-black border-amber-300' : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payment Account Details */}
      {activeTab === 'payments' && (
        <div className="max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-xl text-amber-100 border-b border-stone-800 pb-2">
            Update Official Showroom Payment Accounts
          </h2>

          <form onSubmit={handleSavePaymentAccounts} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 mb-1">Bank Name & Branch</label>
              <input
                type="text"
                value={editingPayment.bankName}
                onChange={(e) => setEditingPayment({ ...editingPayment, bankName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1">Account Title</label>
                <input
                  type="text"
                  value={editingPayment.accountTitle}
                  onChange={(e) => setEditingPayment({ ...editingPayment, accountTitle: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">IBAN Number</label>
                <input
                  type="text"
                  value={editingPayment.iban}
                  onChange={(e) => setEditingPayment({ ...editingPayment, iban: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1">JazzCash Mobile</label>
                <input
                  type="text"
                  value={editingPayment.jazzCashNumber}
                  onChange={(e) => setEditingPayment({ ...editingPayment, jazzCashNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">EasyPaisa Mobile</label>
                <input
                  type="text"
                  value={editingPayment.easyPaisaNumber}
                  onChange={(e) => setEditingPayment({ ...editingPayment, easyPaisaNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl shadow hover:brightness-110 uppercase"
            >
              Save Official Account Details
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: AI Assistant & Knowledge Base Management */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Bot System Status Header */}
          <div className="bg-stone-900 border border-[#d4af37]/50 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-stone-950 border border-[#d4af37] rounded-xl text-[#d4af37]">
                  <Bot className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
                    IQBAL WOODCRAFT AI Assistant Console
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  </h2>
                  <p className="text-xs text-amber-300">
                    24/7 Showroom Sales Consultant • Connected to Gemini API & Local Timber Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  AI Agent Online (24/7)
                </span>
                <span className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800 rounded-xl">
                  100% Advance Policy Active (No COD)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-stone-800">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">Sales Escalation WhatsApp</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">0309-3509242</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">Custom Furniture AI Wizard</span>
                <span className="text-amber-300 font-bold text-sm">Active & Capturing Inquiries</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">System Knowledge Base</span>
                <span className="text-amber-100 font-bold text-sm">{aiFaqs.length} Active FAQs Configured</span>
              </div>
            </div>
          </div>

          {/* Section A: AI Knowledge Base & FAQs Manager */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#d4af37]" />
                  AI Knowledge Base & FAQs Manager
                </h3>
                <p className="text-xs text-stone-400">
                  Update questions, pricing policies, and delivery knowledge used by the AI Assistant.
                </p>
              </div>
            </div>

            {/* Add New FAQ Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFaqQ || !newFaqA) return;
                addAiFaq({
                  question: newFaqQ,
                  answer: newFaqA,
                  category: newFaqCat
                });
                setNewFaqQ('');
                setNewFaqA('');
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3 text-xs"
            >
              <h4 className="font-bold text-amber-300">Add New AI FAQ Entry:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-stone-300 mb-1">Customer Question *</label>
                  <input
                    type="text"
                    required
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder="e.g. Do you deliver furniture to Islamabad and Lahore?"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Topic Category *</label>
                  <select
                    value={newFaqCat}
                    onChange={(e) => setNewFaqCat(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                  >
                    <option value="Payment">Payment</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Products">Products</option>
                    <option value="Custom Furniture">Custom Furniture</option>
                    <option value="Warranty">Warranty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-stone-300 mb-1">AI Official Answer *</label>
                <textarea
                  required
                  rows={2}
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  placeholder="Enter the exact answer the AI should provide customers..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#d4af37] text-black font-extrabold rounded-xl hover:brightness-110 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add FAQ to AI Knowledge Base
              </button>
            </form>

            {/* List of FAQs */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-300 text-xs">Active Knowledge Base Entries ({aiFaqs.length}):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {aiFaqs.map((faq) => (
                  <div key={faq.id} className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] font-bold rounded text-[10px] uppercase">
                        {faq.category}
                      </span>
                      <button
                        onClick={() => deleteAiFaq(faq.id)}
                        className="text-stone-500 hover:text-red-400 p-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-amber-100">{faq.question}</p>
                    <p className="text-stone-300 text-[11px] leading-relaxed bg-stone-900/60 p-2 rounded-lg">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section B: Customer AI Conversations Log */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                  Customer AI Conversations & Chat Logs
                </h3>
                <p className="text-xs text-stone-400">
                  Review real-time customer conversations captured by the AI Assistant.
                </p>
              </div>
            </div>

            {aiConversations.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No customer AI conversations logged yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {aiConversations.map((conv) => {
                  const isExpanded = expandedConvId === conv.id;
                  return (
                    <div key={conv.id} className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-900 pb-2">
                        <div>
                          <h4 className="font-serif font-bold text-amber-200 text-sm">
                            Customer: {conv.customerName}
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            Phone: <span className="text-emerald-400 font-mono">{conv.phone || 'N/A'}</span> • Last Active: {new Date(conv.lastActive).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            conv.status.includes('Custom') 
                              ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {conv.status}
                          </span>
                          <button
                            onClick={() => setExpandedConvId(isExpanded ? null : conv.id)}
                            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl"
                          >
                            {isExpanded ? 'Hide Chat' : `View Thread (${conv.messages.length} msgs)`}
                          </button>
                        </div>
                      </div>

                      {/* Thread Transcript */}
                      {isExpanded && (
                        <div className="bg-stone-900 p-3 rounded-xl space-y-2 max-h-60 overflow-y-auto mt-2 border border-stone-800">
                          {conv.messages.map((m, idx) => (
                            <div key={idx} className={`p-2 rounded-lg text-[11px] ${
                              m.sender === 'user' 
                                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-amber-100 ml-4' 
                                : 'bg-stone-950 border border-stone-800 text-stone-300 mr-4'
                            }`}>
                              <span className="font-bold text-[#d4af37] block mb-0.5">
                                {m.sender === 'user' ? 'Customer' : 'IQBAL AI Assistant'} ({m.timestamp}):
                              </span>
                              <p className="whitespace-pre-wrap">{m.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="font-serif font-bold text-lg text-amber-100">
                {editingProduct ? 'Edit Furniture Item' : 'Add New Furniture Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Product Code *</label>
                  <input
                    type="text"
                    value={prodCode}
                    onChange={(e) => setProdCode(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Furniture Product Name *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-bold text-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Wood Species</label>
                  <select
                    value={prodWood}
                    onChange={(e) => setProdWood(e.target.value as WoodType)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                  >
                    {WOOD_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Main Image URL</label>
                <input
                  type="url"
                  value={prodImgUrl}
                  onChange={(e) => setProdImgUrl(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={prodDimensions}
                  onChange={(e) => setProdDimensions(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Description</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl shadow hover:brightness-110"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
