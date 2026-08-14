'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Check,
  Sparkles,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/types';
import { formatCurrency } from '@/lib/utils';
import ReviewSection from './ReviewSection';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddReview,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const currentPrice = product.price + selectedVariant.priceDelta;

  const handleLock = () => {
    setIsLocked(true);
    onAddToCart(product, selectedVariant);
    setTimeout(() => setIsLocked(false), 900);
  };

  const activeImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 luxury-card rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full luxury-badge hover:scale-110 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Grid: High-Res Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: High-Res Photography Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="w-full h-[360px] md:h-[430px] rounded-2xl bg-black/80 overflow-hidden flex items-center justify-center border border-inherit relative group shadow-xl">
              <img
                src={activeImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/products/chair.svg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />

              {/* Category Pill */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full luxury-badge text-cyan-400 text-xs font-bold font-mono uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-black/80 ${
                    selectedImageIndex === idx
                      ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-400/30'
                      : 'border-inherit opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/products/chair.svg';
                    }}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Spec Selector & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md luxury-badge font-bold uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <h2 className="font-heading text-2xl md:text-3xl font-extrabold shiny-text">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="opacity-60">({product.reviewCount} reviews)</span>
              </div>

              <div className="pt-1">
                <div className="text-2xl font-black shiny-text">
                  {formatCurrency(currentPrice)}
                </div>
                {product.originalPrice && (
                  <div className="text-xs opacity-50 line-through">
                    {formatCurrency(product.originalPrice + selectedVariant.priceDelta)}
                  </div>
                )}
              </div>

              <p className="text-xs opacity-80 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Variant / Finish Options */}
              <div className="space-y-2 pt-2 border-t border-inherit">
                <label className="text-xs font-semibold flex items-center justify-between">
                  <span>Selected Finish:</span>
                  <span className="text-cyan-400 font-bold">{selectedVariant.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        selectedVariant.id === v.id
                          ? 'border-cyan-400 luxury-badge font-bold scale-105'
                          : 'border-inherit opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-inherit"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-1.5 pt-2 border-t border-inherit">
                <span className="text-xs font-semibold">Engineering Specs:</span>
                <ul className="space-y-1 text-xs opacity-85">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lock Stock Action Button */}
            <div className="pt-4 border-t border-inherit space-y-2">
              <button
                onClick={handleLock}
                disabled={isLocked || product.stock === 0}
                className="w-full py-3.5 luxury-button text-sm flex items-center justify-center gap-2"
              >
                {isLocked ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Locked in Redis Engine!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lock Stock & Add to Cart • {formatCurrency(currentPrice)}</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] opacity-70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guaranteed zero overselling via 2-Phase Redis Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Sentiment Analysis Card */}
        {product.aiSummary && (
          <div className="p-4 rounded-2xl luxury-card space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Sentiment & Fit Insights</span>
            </div>
            <p className="text-xs italic opacity-90">{product.aiSummary.summaryText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
              <div className="space-y-1">
                <span className="text-emerald-400 font-semibold">Pros:</span>
                {product.aiSummary.pros.map((p, i) => (
                  <div key={i} className="opacity-80 text-[11px]">
                    • {p}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <span className="text-rose-400 font-semibold">Considerations:</span>
                {product.aiSummary.cons.map((c, i) => (
                  <div key={i} className="opacity-80 text-[11px]">
                    • {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Reviews */}
        <div className="pt-4 border-t border-inherit">
          <ReviewSection
            product={product}
            onAddReview={(review) => onAddReview(product.id, review)}
          />
        </div>
      </div>
    </div>
  );
}
