import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Star, 
  Package, 
  Sparkles, 
  Edit3, 
  Key, 
  LogOut, 
  Building2,
  Home,
  Check,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SavedAddress, UserRole } from '../types';

export const UserProfileView: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    addSavedAddress, 
    deleteSavedAddress, 
    setDefaultAddress,
    setUserRole,
    orders,
    customOrders,
    wishlist,
    logoutUser,
    openAuthModal,
    setCurrentScreen,
    showToast
  } = useApp();

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editCity, setEditCity] = useState(currentUser.city || 'Lahore');

  // New Address Modal / Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home Residence');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [isDefault, setIsDefault] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
      city: editCity
    });
    setIsEditingProfile(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      showToast('Please enter address details.');
      return;
    }
    await addSavedAddress({
      label: newLabel,
      address: newAddress.trim(),
      city: newCity,
      isDefault
    });
    setNewAddress('');
    setIsAddingAddress(false);
  };

  const userOrders = orders.filter(o => o.phone === currentUser.phone || o.email === currentUser.email);
  const userCustomRequests = customOrders.filter(c => c.phone === currentUser.phone || c.email === currentUser.email);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      
      {/* Top Profile Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-[#d4af37]/40 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-500/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl text-2xl font-serif font-bold">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-100">{currentUser.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${currentUser.role === 'Admin' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : currentUser.role === 'Manager' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                  {currentUser.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-500" /> {currentUser.email || 'No email attached'}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-500" /> {currentUser.phone || 'No phone attached'}</span>
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Authenticated via {currentUser.authProvider.toUpperCase()} Provider
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex-1 md:flex-none px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg border border-stone-700 transition flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
              {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={() => openAuthModal('roles')}
              className="flex-1 md:flex-none px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 transition flex items-center justify-center gap-2"
            >
              <Key className="w-3.5 h-3.5" />
              Switch Role
            </button>
            <button
              onClick={logoutUser}
              className="flex-1 md:flex-none px-4 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg border border-red-500/40 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-800/80 text-center">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <div className="text-xl font-bold font-mono text-[#d4af37]">{userOrders.length}</div>
            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1 mt-0.5">
              <Package className="w-3 h-3" /> Total Orders
            </div>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <div className="text-xl font-bold font-mono text-amber-300">{userCustomRequests.length}</div>
            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Custom Requests
            </div>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <div className="text-xl font-bold font-mono text-stone-200">{wishlist.length}</div>
            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3 h-3" /> Saved Items
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Collapsible */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="bg-stone-900 border border-[#d4af37]/40 p-6 rounded-2xl space-y-4 animate-fadeIn">
          <h2 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Edit Profile Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-300 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-[#d4af37] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-300 mb-1">Phone (+92)</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-300 mb-1">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-300 mb-1">Primary City</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d4af37] text-stone-950 font-bold rounded-lg text-xs hover:bg-[#c59e2b] transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Address Management Section */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#d4af37]" /> Saved Delivery Addresses
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Manage your delivery addresses across Pakistan for fast checkout during furniture purchases.
            </p>
          </div>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="px-3.5 py-2 bg-[#d4af37] hover:bg-[#c59e2b] text-stone-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form onSubmit={handleAddAddress} className="p-4 bg-stone-950 border border-[#d4af37]/30 rounded-xl space-y-3 animate-fadeIn">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">New Saved Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Address Label</label>
                <select
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100"
                >
                  <option value="Home Residence">Home Residence</option>
                  <option value="Showroom / Office">Showroom / Office</option>
                  <option value="Chiniot Wood Workshop">Chiniot Wood Workshop</option>
                  <option value="Architect Site">Architect Site</option>
                  <option value="Farmhouse">Farmhouse</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Lahore, Islamabad"
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Complete Delivery Address</label>
              <textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="House #, Street #, Sector/Block, Society, City"
                rows={2}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultCheck"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="accent-[#d4af37] rounded"
              />
              <label htmlFor="defaultCheck" className="text-xs text-stone-300">Set as default delivery address</label>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-3 py-1.5 bg-stone-800 text-stone-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#d4af37] text-stone-950 font-bold rounded text-xs hover:bg-[#c59e2b]"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Address Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(currentUser.savedAddresses && currentUser.savedAddresses.length > 0) ? (
            currentUser.savedAddresses.map((addr: SavedAddress) => (
              <div 
                key={addr.id}
                className={`p-4 rounded-xl border transition relative flex flex-col justify-between ${addr.isDefault ? 'bg-amber-950/20 border-[#d4af37] shadow-lg' : 'bg-stone-950 border-stone-800 hover:border-stone-700'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                      {addr.label.includes('Home') ? <Home className="w-3.5 h-3.5 text-[#d4af37]" /> : <Building className="w-3.5 h-3.5 text-[#d4af37]" />}
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{addr.address}</p>
                  <p className="text-[11px] text-stone-500 font-medium mt-1">{addr.city}, Pakistan</p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-800/80 pt-3 mt-3 text-xs">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-amber-400 hover:underline font-medium text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Make Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteSavedAddress(addr.id)}
                    className="text-stone-500 hover:text-red-400 transition ml-auto p-1"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-stone-950 rounded-xl border border-dashed border-stone-800 text-stone-500 text-xs">
              No saved addresses found. Click "Add Address" to store your home or office delivery location.
            </div>
          )}
        </div>
      </div>

      {/* Orders Quick View Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-bold text-stone-100">My Orders & Cargo Bilty Tracking</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            View live status updates of your active wood workshop orders and dispatched cargo bilty receipts.
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('my-orders')}
          className="px-5 py-2.5 bg-[#d4af37] text-stone-950 font-bold rounded-lg text-xs hover:bg-[#c59e2b] transition shadow"
        >
          View All Orders ({userOrders.length})
        </button>
      </div>

    </div>
  );
};
