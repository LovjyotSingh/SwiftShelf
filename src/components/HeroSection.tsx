'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ChevronRight,
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headlines, Architecture Pills & Value Prop */}
        <div className="lg:col-span-7 space-y-6">
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full luxury-badge text-[10px] sm:text-xs font-semibold shadow-md max-w-full flex-wrap leading-tight">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">Next.js 15 App Router • Redis 2-Phase Locks • Gemini AI</span>
          </div>

          {/* Main Headline with Shimmering Metallic Text */}
          <h1 className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] break-words">
            <span className="shiny-text">Next-Gen Hardware.</span>{' '}
            <span className="opacity-80">
              Zero Race Conditions.
            </span>
          </h1>

          <p className="text-sm sm:text-lg opacity-85 max-w-2xl font-light leading-relaxed">
            Experience ultra-low latency e-commerce engineered for high-concurrency flash sales. Atomic
            inventory reservation, verified sub-millisecond stock safety, and AI-assisted catalog intelligence.
          </p>

          {/* Technical USP Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl luxury-card flex items-start gap-3">
              <div className="p-2 rounded-xl bg-current/10 shrink-0">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Sub-ms Locking</h4>
                <p className="text-[11px] opacity-70">Redis 2-Phase atomic locks</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl luxury-card flex items-start gap-3">
              <div className="p-2 rounded-xl bg-current/10 shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold">AI Catalog</h4>
                <p className="text-[11px] opacity-70">Gemini-powered visual match</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl luxury-card flex items-start gap-3">
              <div className="p-2 rounded-xl bg-current/10 shrink-0">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold">ACID Resilient</h4>
                <p className="text-[11px] opacity-70">Zero overselling guaranteed</p>
              </div>
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={() => onQuickReserve(flagshipProduct)}
              className="luxury-button w-full sm:w-auto px-7 py-3.5 text-sm flex items-center justify-center gap-2"
            >
              <span>Instant Reserve Flagship</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="luxury-button-secondary w-full sm:w-auto px-6 py-3.5 text-sm justify-center"
            >
              Explore Full Catalog (8 Items)
            </button>
          </div>
        </div>

        {/* Right Column: Flagship Hardware Studio Spotlight */}
        <div className="lg:col-span-5 relative">
          <div className="luxury-card rounded-3xl p-5 relative overflow-hidden shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest">
                    FLAGSHIP SPOTLIGHT
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md luxury-badge font-bold">
                    🔥 24 Left
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold mt-0.5 shiny-text">
                  {flagshipProduct.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold shiny-text">
                  {formatCurrency(flagshipProduct.price + currentVariant.priceDelta)}
                </div>
                {flagshipProduct.originalPrice && (
                  <div className="text-xs opacity-50 line-through">
                    {formatCurrency(flagshipProduct.originalPrice + currentVariant.priceDelta)}
                  </div>
                )}
              </div>
            </div>

            {/* Showcase Visual Area */}
            <div
              className="my-4 relative rounded-2xl overflow-hidden bg-black/80 border border-inherit h-[320px] flex items-center justify-center group cursor-pointer"
              onClick={() => onOpenInspectModal(flagshipProduct)}
            >
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
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400 text-black font-extrabold font-mono">
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
                <span className="text-xs opacity-70 font-medium">Finish:</span>
                <div className="flex items-center gap-2">
                  {flagshipProduct.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedVariantIndex === idx
                          ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-400/40'
                          : 'border-inherit hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
                <span className="text-xs opacity-80 font-medium truncate max-w-[100px]">
                  {currentVariant.colorName}
                </span>
              </div>

              <button
                onClick={() => onOpenInspectModal(flagshipProduct)}
                className="text-xs font-bold text-cyan-400 hover:opacity-80 flex items-center gap-1 transition-opacity"
              >
                <span>Inspect Specs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
