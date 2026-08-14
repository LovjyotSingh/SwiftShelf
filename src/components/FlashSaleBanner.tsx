'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, Activity, ArrowRight, Zap } from 'lucide-react';
import { formatTimeRemaining } from '@/lib/utils';
import { Product } from '@/types';

interface FlashSaleBannerProps {
  flashProduct: Product;
  onQuickReserve: (product: Product) => void;
}

export default function FlashSaleBanner({ flashProduct, onQuickReserve }: FlashSaleBannerProps) {
  const [timeLeftMs, setTimeLeftMs] = useState(14 * 3600 * 1000 + 42 * 60 * 1000);
  const [activeConcurrentShoppers, setActiveConcurrentShoppers] = useState(1284);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftMs((prev) => Math.max(0, prev - 1000));
    }, 1000);

    const telemetryInterval = setInterval(() => {
      // Simulate real-time fluctuating concurrency
      setActiveConcurrentShoppers((prev) =>
        Math.max(900, Math.min(2400, prev + Math.floor(Math.random() * 21) - 10))
      );
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(telemetryInterval);
    };
  }, []);

  const totalStock = flashProduct.stock + flashProduct.reservedStock;
  const percentageReserved = Math.round((flashProduct.reservedStock / totalStock) * 100);

  return (
    <div className="w-full bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900/40 border-y border-rose-500/20 py-2.5 px-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Flash Sale Tag & Timer */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold tracking-wider uppercase animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>FLASH DROP ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Drop Ends in:</span>
            <span className="font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
              {formatTimeRemaining(timeLeftMs)}
            </span>
          </div>

          <span className="hidden lg:inline text-slate-400">
            • <strong className="text-white">{flashProduct.title}</strong> discounted to{' '}
            <span className="text-emerald-400 font-bold">${flashProduct.price}</span>
          </span>
        </div>

        {/* Center/Right: Concurrency Telemetry & Stock Lock CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              <strong className="text-cyan-300 font-mono">{activeConcurrentShoppers.toLocaleString()}</strong> live shoppers
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{percentageReserved}% Locked in Redis Engine</span>
            </span>
          </div>

          <button
            onClick={() => onQuickReserve(flashProduct)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-semibold shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all text-xs whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Lock Stock ($389)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
