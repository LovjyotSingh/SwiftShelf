'use client';

import React, { useState } from 'react';
import { Star, Box, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onInspect: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onInspect }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product, selectedVariant);
    setTimeout(() => setIsAdding(false), 800);
  };

  const currentPrice = product.price + selectedVariant.priceDelta;
  const isLowStock = product.stock <= 10;
  const currentImageSrc = product.images[0];

  return (
    <div
      onClick={() => onInspect(product)}
      className="group glass-card rounded-2xl p-4 flex flex-col justify-between cursor-pointer border border-white/10 hover:border-white/40 transition-all duration-300 relative overflow-hidden bg-black/60 shadow-lg"
    >
      {/* Product Image & Badges Container */}
      <div className="relative w-full h-56 rounded-xl bg-black overflow-hidden mb-4 flex items-center justify-center border border-white/10">
        <img
          src={currentImageSrc}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (product.images[1] && e.currentTarget.src !== product.images[1]) {
              e.currentTarget.src = product.images[1];
            } else {
              e.currentTarget.src = '/images/products/chair.svg';
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="eager"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              product.badge === 'FLASH SALE'
                ? 'bg-white text-black shadow-md font-mono animate-pulse'
                : 'bg-white/90 text-black shadow-md'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Inspect Trigger Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          <Eye className="w-3 h-3 text-white" />
          <span>Quick Inspect</span>
        </div>

        {/* Stock Level Bar */}
        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Stock Availability</span>
          <span
            className={`font-semibold font-mono ${
              isLowStock ? 'text-white' : 'text-slate-300'
            }`}
          >
            {product.stock} units left
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold tracking-wide uppercase text-[11px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-white font-medium">
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            <span className="text-white text-xs">{product.rating}</span>
            <span className="text-slate-500 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-heading text-base font-bold text-white group-hover:text-slate-300 transition-colors line-clamp-1">
          {product.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
          {product.subtitle || product.description}
        </p>

        {/* Variant Swatches */}
        <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-slate-400">Finish:</span>
          <div className="flex items-center gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedVariant.id === v.id
                    ? 'border-white scale-125 shadow-sm'
                    : 'border-white/20 hover:border-white/50'
                }`}
                style={{ backgroundColor: v.colorHex }}
                title={`${v.colorName} (${v.priceDelta > 0 ? `+$${v.priceDelta}` : 'Included'})`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
            {selectedVariant.colorName}
          </span>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-white">
            {formatCurrency(currentPrice)}
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-slate-500 line-through">
              {formatCurrency(product.originalPrice + selectedVariant.priceDelta)}
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={isAdding}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            isAdding
              ? 'bg-white text-black font-extrabold'
              : 'bg-white hover:bg-slate-200 text-black shadow-md active:scale-95'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 text-black" />
              <span>Locked!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span>Lock Stock</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
