'use client';

import React from 'react';
import {
  ShoppingBag,
  Search,
  Camera,
  Sparkles,
  BarChart3,
  Command,
  User as UserIcon,
  LogIn,
} from 'lucide-react';
import { ProductCategory } from '@/types';
import { UserSession } from './AuthModal';
import ThemeSelector from './ThemeSelector';

interface NavbarProps {
  cartCount: number;
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onOpenVisualSearch: () => void;
  onOpenAIConcierge: () => void;
  currentView: 'store' | 'admin';
  onToggleView: (view: 'store' | 'admin') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory?: ProductCategory | 'ALL';
  activeCategory?: ProductCategory | 'ALL';
  onSelectCategory: (cat: ProductCategory | 'ALL') => void;
}

export default function Navbar({
  cartCount,
  user,
  onOpenAuth,
  onOpenAccount,
  onOpenCart,
  onOpenVisualSearch,
  onOpenAIConcierge,
  currentView,
  onToggleView,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full theme-header px-4 lg:px-8 py-3 transition-colors shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onToggleView('store')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl luxury-button flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight leading-none block shiny-text">
                SWIFT<span className="opacity-70">SHELF</span>
              </span>
              <span className="text-[10px] opacity-60 font-mono tracking-widest block uppercase">
                Hardware Lab
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search & AI Concierge Trigger */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hardware catalog..."
              className="luxury-input pl-10 pr-24 py-2 text-xs"
            />
            <button
              onClick={onOpenVisualSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-lg luxury-badge text-[10px] font-bold transition-all hover:scale-105"
              title="Search by Image (Multimodal AI)"
            >
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>Visual</span>
            </button>
          </div>

          {/* AI Command Concierge Trigger */}
          <button
            onClick={onOpenAIConcierge}
            className="luxury-button-secondary flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap"
            title="Open AI Concierge (Cmd+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden lg:inline font-bold">AI Concierge</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] opacity-60 px-1.5 py-0.5 rounded bg-current/10 font-mono">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right Controls: User Auth / Profile + Theme Selector + Mode Switcher + Cart */}
        <div className="flex items-center gap-2.5">
          {/* User Auth / Account Trigger */}
          {user ? (
            <button
              onClick={onOpenAccount}
              className="luxury-button-secondary flex items-center gap-2 px-3 py-2 text-xs"
              title="View Account & Invoices"
            >
              <div className="w-5 h-5 rounded-md bg-current/10 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-cyan-400" />
              </div>
              <span className="font-bold hidden sm:inline truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="luxury-button flex items-center gap-1.5 px-3.5 py-2 text-xs"
              title="Sign In or Create Account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admin BI Dashboard Toggle */}
          <button
            onClick={() => onToggleView(currentView === 'store' ? 'admin' : 'store')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'admin'
                ? 'luxury-button'
                : 'luxury-button-secondary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {currentView === 'admin' ? 'Storefront' : 'Admin BI'}
            </span>
          </button>

          {/* Theme Selector (Pitch Black, Pearl White, Aurora Cyber) */}
          <ThemeSelector />

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="luxury-button relative flex items-center gap-2 px-3.5 py-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black font-bold text-[11px] flex items-center justify-center animate-pulse shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-2.5 md:hidden flex items-center gap-2">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search catalog..."
            className="luxury-input pl-9 pr-20 py-2 text-xs"
          />
          <button
            onClick={onOpenVisualSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded luxury-badge"
          >
            Visual
          </button>
        </div>
      </div>
    </header>
  );
}
