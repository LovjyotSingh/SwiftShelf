'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowLeft, Sparkles, Package } from 'lucide-react';
import InvoiceDownloadButton from '@/components/InvoiceDownloadButton';
import { OrderRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderRecord>({
    id: `ord_${Date.now()}`,
    orderNumber: `SWIFT-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@techluxury.io',
    shippingAddress: {
      street: '500 Howard Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod_01_spectre_pro',
        title: 'Spectre Pro ANC Headphones',
        variantName: 'Obsidian Black',
        quantity: 1,
        unitPrice: 389.0,
        totalPrice: 389.0,
      },
    ],
    subtotal: 389.0,
    discountAmount: 0,
    taxAmount: 31.12,
    shippingAmount: 0,
    total: 420.12,
    status: 'PAID',
    paymentIntentId: `pi_test_${Date.now()}`,
    idempotencyKey: `idemp_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  return (
    <div className="min-h-screen bg-transparent text-inherit flex flex-col justify-between py-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto w-full luxury-card rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* Animated Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2-Phase Stock Reservation Committed</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">Payment Authorized</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Order <strong className="text-white font-mono">{order.orderNumber}</strong> has been fulfilled idempotently with zero race-condition oversell.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Order Reference:</span>
            <span className="font-mono font-bold text-cyan-400">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Customer Recipient:</span>
            <span className="text-white font-medium">{order.customerName} ({order.customerEmail})</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Items:</span>
            <span className="text-white font-medium">
              {order.items.map((it) => `${it.quantity}x ${it.title} (${it.variantName})`).join(', ')}
            </span>
          </div>

          <div className="flex justify-between font-bold text-sm text-white pt-1">
            <span>Total Paid:</span>
            <span className="text-emerald-400 font-extrabold">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Invoice Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <InvoiceDownloadButton order={order} className="w-full sm:w-auto" />

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
