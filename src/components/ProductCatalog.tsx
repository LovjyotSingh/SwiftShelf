'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, Sparkles, AlertCircle } from 'lucide-react';
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
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

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
    <section id="catalog-section" className="w-full py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Catalog Title & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Engineered Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ultra-low latency hardware with real-time stock locks & 3D previews
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar & Sort Options */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Price Range Slider */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Max Price:</span>
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-indigo-500 w-28 cursor-pointer"
            />
            <span className="font-mono font-bold text-white bg-slate-950 px-2 py-1 rounded border border-white/10">
              {formatCurrency(maxPrice)}
            </span>
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded accent-indigo-500 cursor-pointer"
            />
            <span className="text-slate-300 font-medium">In-Stock Only</span>
          </label>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-white">No Matching Hardware Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your maximum price slider, search keyword, or selected category filters.
          </p>
          <button
            onClick={() => {
              setMaxPrice(1500);
              setInStockOnly(false);
              onSelectCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600/80 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
