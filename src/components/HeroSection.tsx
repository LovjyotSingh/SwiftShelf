'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  Headphones,
} from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface HeroSectionProps {
  flagshipProduct: Product;
  onExploreClick: () => void;
  onQuickReserve: (product: Product) => void;
  onOpenInspectModal: (product: Product) => void;
}

export default function HeroSection({
  flagshipProduct,
  onExploreClick,
  onQuickReserve,
  onOpenInspectModal,
}: HeroSectionProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = flagshipProduct.variants[selectedVariantIndex] || flagshipProduct.variants[0];

  return (
    <section className="relative w-full pt-6 pb-16 px-4 lg:px-8 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headlines, Architecture Pills & Value Prop */}
        <div className="lg:col-span-7 space-y-6">
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next.js 15 App Router • Redis 2-Phase Stock Locks • Gemini AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Next-Gen Hardware.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
              Zero Race Conditions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
            Experience ultra-low latency e-commerce engineered for high-concurrency flash sales. Atomic
            inventory reservation, verified sub-millisecond stock safety, and AI-assisted catalog intelligence.
          </p>

          {/* Technical USP Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sub-ms Locking</h4>
                <p className="text-[11px] text-slate-400">Redis 2-Phase atomic reservations</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Catalog</h4>
                <p className="text-[11px] text-slate-400">Gemini-powered semantic visual match</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ACID Resilient</h4>
                <p className="text-[11px] text-slate-400">Zero overselling guaranteed</p>
              </div>
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onQuickReserve(flagshipProduct)}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Instant Reserve Flagship</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              Explore Full Catalog (8 Items)
            </button>
          </div>
        </div>

        {/* Right Column: Flagship Hardware Studio Spotlight */}
        <div className="lg:col-span-5 relative">
          <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden bg-slate-900/60 shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                    FLAGSHIP SPOTLIGHT
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                    🔥 24 Left
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                  {flagshipProduct.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-white">
                  {formatCurrency(flagshipProduct.price + currentVariant.priceDelta)}
                </div>
                {flagshipProduct.originalPrice && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatCurrency(flagshipProduct.originalPrice + currentVariant.priceDelta)}
                  </div>
                )}
              </div>
            </div>

            {/* Showcase Visual Area */}
            <div className="my-4 relative rounded-2xl overflow-hidden bg-slate-950 border border-white/5 h-[320px] flex items-center justify-center group cursor-pointer"
                 onClick={() => onOpenInspectModal(flagshipProduct)}>
              <img
                src={flagshipProduct.images[0]}
                alt={flagshipProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      50mm Planar Transducers
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                      LDAC 24-Bit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    Custom planar magnetic architecture with active hybrid noise cancellation
                  </p>
                </div>
              </div>
            </div>

            {/* Color Swatch Material Switcher */}
            <div className="pt-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Finish:</span>
                <div className="flex items-center gap-2">
                  {flagshipProduct.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedVariantIndex === idx
                          ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-500/30'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  {currentVariant.colorName}
                </span>
              </div>

              <button
                onClick={() => onOpenInspectModal(flagshipProduct)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Inspect Specs & Reviews</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
