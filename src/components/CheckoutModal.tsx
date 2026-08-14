'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { CartItem, DiscountCoupon, OrderRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: DiscountCoupon | null;
  onOrderSuccess: (order: OrderRecord) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderSuccess,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Alex Rivera');
  const [customerEmail, setCustomerEmail] = useState('alex.rivera@techluxury.io');
  const [street, setStreet] = useState('500 Howard Street, Suite 400');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94105');
  const [country, setCountry] = useState('United States');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: `SWIFT-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      customerEmail,
      shippingAddress: {
        street,
        city,
        state,
        zip,
        country,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount: 0,
      total,
      status: 'PAID',
      paymentIntentId: `pi_test_${Date.now()}`,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl luxury-card rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-cyan-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>Stripe Instant 1-Click Checkout</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  TLS 1.3 / 256-Bit
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Idempotent transactional pipeline with automated PDF invoicing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="space-y-4 text-xs">
          {/* Contact Details */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300">1. Customer Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="font-bold text-slate-300">2. Shipping Destination</span>
            <div className="space-y-2">
              <div>
                <label className="block text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">State / Zip</label>
                  <input
                    type="text"
                    required
                    value={`${state} ${zip}`}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card Simulation */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">3. Payment Credentials</span>
              <span className="text-[11px] text-indigo-400 font-mono">Test Card: 4242</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="font-mono text-white font-bold">{cardNumber}</div>
                  <div className="text-[10px] text-slate-400">Exp 12/28 • CVC 888</div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Stripe Verified
              </div>
            </div>
          </div>

          {/* Totals & Submit */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>Total Authorization:</span>
              <span className="text-cyan-400 text-lg font-extrabold">{formatCurrency(total)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Idempotent Charge...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize Payment & Generate Invoice ({formatCurrency(total)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
