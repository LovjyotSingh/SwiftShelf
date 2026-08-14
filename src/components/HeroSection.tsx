'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Box,
  Image as ImageIcon,
  Activity,
  Headphones,
} from 'lucide-react';
import ThreeDProductViewer from './ThreeDProductViewer';
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
  const [selectedColorHex, setSelectedColorHex] = useState(
    flagshipProduct.variants[0]?.colorHex || '#121316'
  );
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

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

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
            Experience high-velocity luxury hardware with{' '}
            <strong className="text-white font-medium">atomic flash-sale stock reservation</strong>,{' '}
            multimodal visual AI search, and real-time 3D WebGL material customization.
          </p>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                <Zap className="w-3.5 h-3.5" />
                <span>&lt;15ms p95</span>
              </div>
              <p className="text-[11px] text-slate-400">Atomic MongoDB / Prisma</p>
            </div>

            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Oversell</span>
              </div>
              <p className="text-[11px] text-slate-400">10-Min Redis Lua TTL Locks</p>
            </div>

            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multimodal AI</span>
              </div>
              <p className="text-[11px] text-slate-400">Gemini 1.5 Flash + Vision</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onQuickReserve(flagshipProduct)}
              className="btn-luxury-primary px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 text-white shadow-xl"
            >
              <span>Instant Reserve Flagship</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-mono">
                {formatCurrency(flagshipProduct.price)}
              </span>
            </button>

            <button
              onClick={onExploreClick}
              className="btn-luxury-secondary px-5 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:text-cyan-300 transition-all"
            >
              <span>Browse Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Featured Hardware Showcase Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative glass-card rounded-3xl p-5 border border-white/10 shadow-2xl bg-gradient-to-b from-slate-900/90 to-[#0B0E17]/95">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">
                    FEATURED FLAGSHIP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    🔥 24 Left
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                  {flagshipProduct.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-white">
                  {formatCurrency(flagshipProduct.price)}
                </div>
                {flagshipProduct.originalPrice && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatCurrency(flagshipProduct.originalPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* View Mode Switcher: Photo vs 3D */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'photo'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Studio Photo</span>
                </button>

                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === '3d'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-cyan-300" />
                  <span>3D Interactive</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                50mm Planar Magnetic
              </span>
            </div>

            {/* Showcase Visual Area */}
            <div className="my-3 relative rounded-2xl overflow-hidden bg-slate-950 border border-white/5 h-[320px] flex items-center justify-center">
              {viewMode === 'photo' ? (
                <div className="relative w-full h-full group">
                  <img
                    src={flagshipProduct.images[0]}
                    alt={flagshipProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Acoustic Planar Transducers
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                          LDAC 24-Bit
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        Ultra-low latency active noise cancellation with 60h battery life
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <ThreeDProductViewer
                  productType={flagshipProduct.model3dUrl || 'headphones'}
                  productImage={flagshipProduct.images[0]}
                  selectedColor={selectedColorHex}
                />
              )}
            </div>

            {/* Color Swatch Material Switcher */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Finishes:</span>
                <div className="flex items-center gap-2">
                  {flagshipProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColorHex(v.colorHex)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedColorHex === v.colorHex
                          ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-500/30'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
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
