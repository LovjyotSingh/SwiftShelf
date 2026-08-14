'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Eye } from 'lucide-react';
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
      className="group luxury-card rounded-2xl p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Product Image & Badges Container */}
      <div className="relative w-full h-56 rounded-xl bg-black/85 overflow-hidden mb-4 flex items-center justify-center border border-inherit">
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
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="eager"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              product.badge === 'FLASH SALE'
                ? 'luxury-button font-mono animate-pulse'
                : 'luxury-button'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Inspect Trigger Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg luxury-badge text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>Quick Inspect</span>
        </div>

        {/* Stock Level Bar */}
        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg luxury-badge flex items-center justify-between text-[11px]">
          <span className="opacity-70 font-medium">Stock Availability</span>
          <span className="font-bold font-mono text-cyan-400">
            {product.stock} units left
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="opacity-70 font-bold tracking-wider uppercase text-[10px] font-mono">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{product.rating}</span>
            <span className="opacity-60 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-heading text-base font-bold shiny-text line-clamp-1">
          {product.title}
        </h3>

        <p className="text-xs opacity-75 line-clamp-2 leading-relaxed font-light">
          {product.subtitle || product.description}
        </p>

        {/* Variant Swatches */}
        <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] opacity-70">Finish:</span>
          <div className="flex items-center gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedVariant.id === v.id
                    ? 'border-cyan-400 scale-125 shadow-sm'
                    : 'border-inherit hover:scale-110'
                }`}
                style={{ backgroundColor: v.colorHex }}
                title={`${v.colorName} (${v.priceDelta > 0 ? `+$${v.priceDelta}` : 'Included'})`}
              />
            ))}
          </div>
          <span className="text-[11px] opacity-70 truncate max-w-[120px]">
            {selectedVariant.colorName}
          </span>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="pt-4 mt-2 border-t border-inherit flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-extrabold shiny-text">
            {formatCurrency(currentPrice)}
          </div>
          {product.originalPrice && (
            <div className="text-[11px] opacity-50 line-through">
              {formatCurrency(product.originalPrice + selectedVariant.priceDelta)}
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="luxury-button text-xs py-2 px-3.5"
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Locked!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              <span>Lock Stock</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
