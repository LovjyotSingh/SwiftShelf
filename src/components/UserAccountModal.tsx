'use client';

import React from 'react';
import {
  X,
  User,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { UserSession } from './AuthModal';
import { OrderRecord } from '@/types';
import { formatCurrency, formatTimestamp } from '@/lib/utils';
import InvoiceDownloadButton from './InvoiceDownloadButton';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  orders: OrderRecord[];
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export default function UserAccountModal({
  isOpen,
  onClose,
  user,
  orders,
  onLogout,
  onOpenAdmin,
}: UserAccountModalProps) {
  if (!isOpen || !user) return null;

  const userOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl bg-[#0D111A] space-y-6 max-h-[88vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/10 pb-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 p-0.5 shrink-0 shadow-lg shadow-indigo-500/20">
            <img
              src={
                user.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt={user.name}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-heading text-lg font-bold text-white">{user.name}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {user.role === 'ADMIN' ? '⚡ Executive SuperAdmin' : 'Verified VIP Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            {user.role === 'ADMIN' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Open Admin BI
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Personal Purchase History ({userOrders.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">100% Tax Invoiced</span>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-2 text-xs text-slate-400">
              <Package className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No transactions yet on this profile.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">
                      {ord.items.map((it) => `${it.quantity}x ${it.title}`).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500">{formatTimestamp(ord.createdAt)}</div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="font-extrabold text-white sm:text-right">
                      {formatCurrency(ord.total)}
                    </div>
                    <InvoiceDownloadButton order={ord} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
