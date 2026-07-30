import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCheck, Trash2, Shield, Truck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    pushNotificationsEnabled,
    requestPushPermission,
    setPushNotificationsEnabled,
    notifications,
    markNotificationRead,
    clearNotifications
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => filter === 'all' || !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-stone-900 border-l border-stone-800 h-full shadow-2xl flex flex-col z-10 text-stone-100"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] rounded-xl relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-stone-950 animate-ping" />
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-100 text-lg">Push Notifications</h3>
                <p className="text-[11px] text-stone-400">Order tracking, Bilty numbers & woodcraft updates</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Push Permission Banner */}
          <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {pushNotificationsEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
              <span className="text-xs font-bold text-stone-200">
                {pushNotificationsEnabled ? 'Notifications Active' : 'Enable Device Push Alerts'}
              </span>
            </div>

            <button
              onClick={requestPushPermission}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                pushNotificationsEnabled
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-[#d4af37] text-stone-950 hover:brightness-110 shadow'
              }`}
            >
              {pushNotificationsEnabled ? 'Permission Granted' : 'Turn On Alerts'}
            </button>
          </div>

          {/* Subheader Filters */}
          <div className="px-5 py-3 border-b border-stone-800/60 bg-stone-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filter === 'all' ? 'bg-[#d4af37] text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filter === 'unread' ? 'bg-[#d4af37] text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-stone-500 hover:text-red-400 font-bold flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-20 text-center space-y-2 text-stone-500">
                <Bell className="w-12 h-12 text-stone-700 mx-auto" />
                <p className="text-sm font-bold text-stone-300">No Notifications</p>
                <p className="text-xs">You are up to date on all woodcraft orders.</p>
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-1.5 relative ${
                    n.read
                      ? 'bg-stone-950/60 border-stone-800/80 text-stone-400'
                      : 'bg-stone-800/90 border-[#d4af37]/50 text-amber-100 shadow-md ring-1 ring-[#d4af37]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs flex items-center gap-1.5 text-amber-200">
                      {n.type === 'order' && <Truck className="w-3.5 h-3.5 text-[#d4af37]" />}
                      {n.type === 'system' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                      {n.type === 'promo' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">{n.timestamp}</span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{n.message}</p>

                  {!n.read && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#d4af37] font-bold pt-1">
                      <CheckCheck className="w-3 h-3" /> Mark as Read
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-stone-800 bg-stone-950 text-xs text-stone-400 flex items-center justify-between">
            <span>IQBAL WOODCRAFT Cargo Broadcast</span>
            <span className="font-mono text-[10px] text-[#d4af37]">Pan-Pakistan</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
