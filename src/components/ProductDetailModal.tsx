'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Zap,
  Box,
  Image as ImageIcon,
  Check,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import ThreeDProductViewer from './ThreeDProductViewer';
import ReviewSection from './ReviewSection';
import { Product, ProductVariant, ReviewItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onAddReview: (productId: string, review: ReviewItem) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddReview,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'gallery'>('3d');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const currentPrice = product.price + selectedVariant.priceDelta;

  const handleLock = () => {
    setIsLocked(true);
    onAddToCart(product, selectedVariant);
    setTimeout(() => setIsLocked(false), 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl bg-[#0C101A] max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Grid: Media (3D or Photos) & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Media Showcase */}
          <div className="lg:col-span-7 space-y-3">
            {/* Media Mode Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMediaTab('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeMediaTab === '3d'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Interactive 3D Mesh</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeMediaTab === 'gallery'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>High-Res Gallery</span>
              </button>
            </div>

            {/* Media Content */}
            {activeMediaTab === '3d' ? (
              <ThreeDProductViewer
                productType={product.model3dUrl || 'headphones'}
                selectedColor={selectedVariant.colorHex}
              />
            ) : (
              <div className="space-y-3">
                <div className="w-full h-[360px] md:h-[440px] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-white/5">
                  <img
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx ? 'border-cyan-400 scale-105' : 'border-white/10 opacity-60'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = product.images[0];
                        }}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Spec Selector & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-bold">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>

              <div className="pt-1">
                <div className="text-2xl font-black text-white">
                  {formatCurrency(currentPrice)}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatCurrency(product.originalPrice + selectedVariant.priceDelta)}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Finish & Material:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedVariant.id === v.id
                          ? 'border-cyan-400 bg-indigo-950/40 text-white shadow-md shadow-cyan-500/20'
                          : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{v.colorName}</div>
                        <div className="text-[10px] text-slate-400">
                          {v.priceDelta > 0 ? `+$${v.priceDelta}` : 'Standard'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="pt-2 space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Hardware Highlights:</span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lock Stock CTA Button */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Inventory Pool:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {product.stock} units available (Instant Lock)
                </span>
              </div>

              <button
                onClick={handleLock}
                disabled={isLocked}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isLocked
                    ? 'bg-emerald-600 text-white'
                    : 'btn-luxury-primary shadow-lg shadow-indigo-600/40 active:scale-98'
                }`}
              >
                {isLocked ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Inventory Locked (10-Min TTL)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lock In Cart ({formatCurrency(currentPrice)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        {product.specs && (
          <div className="border-t border-white/10 pt-6 space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Technical Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                  <div className="text-slate-400 font-medium">{key}</div>
                  <div className="text-white font-semibold mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews & AI Synthesis Section */}
        <ReviewSection
          product={product}
          onAddReview={(rev) => onAddReview(product.id, rev)}
        />
      </div>
    </div>
  );
}
