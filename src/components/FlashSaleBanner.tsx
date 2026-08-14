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
    <div className="w-full max-w-[100vw] overflow-hidden border-b border-inherit bg-current/5 py-2.5 px-3 sm:px-4 backdrop-blur-md relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs">
        {/* Left: Flash Sale Tag & Timer */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full luxury-badge font-bold tracking-wider uppercase text-[10px] sm:text-xs">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
            <span>FLASH DROP ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium opacity-85 text-[11px] sm:text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Ends:</span>
            <span className="font-mono font-bold px-2 py-0.5 rounded luxury-badge">
              {formatTimeRemaining(timeLeftMs)}
            </span>
          </div>

          <span className="hidden lg:inline opacity-70">
            • <strong className="shiny-text">{flashProduct.title}</strong> discounted to{' '}
            <span className="font-bold text-cyan-400">${flashProduct.price}</span>
          </span>
        </div>

        {/* Center/Right: Concurrency Telemetry & Stock Lock CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="hidden sm:flex items-center gap-2 opacity-80 text-[11px] sm:text-xs">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              <strong className="font-mono text-cyan-400">{activeConcurrentShoppers.toLocaleString()}</strong> shoppers
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{percentageReserved}% Locked</span>
            </span>
          </div>

          <button
            onClick={() => onQuickReserve(flashProduct)}
            className="luxury-button w-full sm:w-auto py-1.5 px-3 text-xs flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Lock Stock (${flashProduct.price})</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
