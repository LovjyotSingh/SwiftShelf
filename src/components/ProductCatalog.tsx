'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, AlertCircle } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product, ProductCategory, ProductVariant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: ProductCategory | 'ALL';
  onSelectCategory: (cat: ProductCategory | 'ALL') => void;
  searchQuery: string;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onInspect: (product: Product) => void;
}

export default function ProductCatalog({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onAddToCart,
  onInspect,
}: ProductCatalogProps) {
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories: Array<ProductCategory | 'ALL'> = [
    'ALL',
    'Audio',
    'Wearables',
    'Computing',
    'Ergonomics',
    'Smart Living',
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTags) return false;
        }

        // Max price filter
        if (p.price > maxPrice) return false;

        // In-stock filter
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  return (
    <section id="catalog-section" className="w-full py-8 sm:py-10 px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10 overflow-hidden">
      {/* Catalog Title & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <h2 className="font-heading text-xl sm:text-3xl font-extrabold shiny-text">
            Engineered Catalog
          </h2>
          <p className="text-xs sm:text-sm opacity-70 mt-1">
            Ultra-low latency hardware with real-time stock locks &amp; multimodal AI match
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'luxury-button shadow-md'
                  : 'luxury-badge hover:opacity-100 opacity-70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar & Sort Options */}
      <div className="luxury-card rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 text-xs">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Price Range Slider */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="opacity-70 font-medium">Max Price:</span>
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-cyan-400 w-24 sm:w-28 cursor-pointer"
            />
            <span className="font-mono font-bold px-2 py-0.5 sm:py-1 rounded luxury-badge text-[11px] sm:text-xs">
              {formatCurrency(maxPrice)}
            </span>
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="opacity-80 font-medium">In-Stock Only</span>
          </label>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-inherit">
          <span className="opacity-70 text-[11px] sm:text-xs">
            Showing <strong className="shiny-text">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="luxury-badge rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-black text-white">Featured Picks</option>
              <option value="price-asc" className="bg-black text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-black text-white">Price: High to Low</option>
              <option value="rating" className="bg-black text-white">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onInspect={onInspect}
            />
          ))}
        </div>
      ) : (
        <div className="luxury-card rounded-2xl p-8 sm:p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="font-heading text-base sm:text-lg font-bold shiny-text">No Matching Hardware Found</h3>
          <p className="text-xs opacity-70 max-w-md mx-auto">
            Try adjusting your maximum price slider, search keyword, or selected category filters.
          </p>
          <button
            onClick={() => {
              setMaxPrice(1500);
              setInStockOnly(false);
              onSelectCategory('ALL');
            }}
            className="luxury-button text-xs py-2 px-4"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
