'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CartItem, DiscountCoupon } from '@/types';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: DiscountCoupon | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [reservationRemainingMs, setReservationRemainingMs] = useState(600 * 1000); // 10 minutes

  useEffect(() => {
    if (cartItems.length === 0) return;

    const timer = setInterval(() => {
      setReservationRemainingMs((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const taxAmount = Math.max(0, (subtotal - discountAmount) * 0.08);
  const total = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try "VIP20" or "SWIFT50"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0C101A] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          {/* Top Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Reserved Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 10-Minute Concurrency Lock Timer */}
            {cartItems.length > 0 && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <div>
                    <div className="font-bold text-white">Stock Lock Active</div>
                    <div className="text-[10px] text-slate-400">Held in 2-Phase Redis Engine</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-white/10 text-xs">
                  {formatTimeRemaining(reservationRemainingMs)}
                </span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1 text-xs">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-400">Your reserved cart is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="p-3 rounded-xl glass-card border border-white/5 flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-950 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{item.variantName}</p>
                    <div className="font-bold text-cyan-400 mt-1">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-white/10">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, -1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, 1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.productId, item.variantId)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Release Stock"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
              {/* Coupon Engine */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon "{appliedCoupon.code}" Applied ({appliedCoupon.value}% OFF)</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Promo Code (e.g. VIP20)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-slate-200 hover:text-white font-bold whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-400">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-medium">{formatCurrency(taxAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Complimentary Shipping</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span>Total Amount</span>
                  <span className="text-cyan-400 font-extrabold">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={onProceedToCheckout}
                className="btn-luxury-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
              >
                <span>Proceed to 1-Click Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
