'use client';

import React from 'react';
import {
  ShoppingBag,
  Search,
  Camera,
  Sparkles,
  Zap,
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
  activeCategory: ProductCategory | 'ALL';
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onToggleView('store')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-lg tracking-tight leading-none block">
                SWIFT<span className="text-slate-400">SHELF</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">
                Hardware Lab
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search & AI Concierge Trigger */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hardware catalog..."
              className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-white transition-all shadow-inner"
            />
            <button
              onClick={onOpenVisualSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold border border-white/10 transition-all"
              title="Search by Image (Multimodal AI)"
            >
              <Camera className="w-3 h-3 text-white" />
              <span>Visual</span>
            </button>
          </div>

          {/* AI Command Concierge Trigger */}
          <button
            onClick={onOpenAIConcierge}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-slate-200 hover:text-white hover:border-white/40 text-xs font-medium backdrop-blur-md transition-all whitespace-nowrap"
            title="Open AI Concierge (Cmd+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden lg:inline">AI Concierge</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-white/20 hover:border-white transition-all text-xs text-white shadow-md"
              title="View Account & Invoices"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border border-white/30 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-white hidden sm:inline truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-extrabold transition-all shadow-md hover:scale-[1.02]"
              title="Sign In or Create Account"
            >
              <LogIn className="w-3.5 h-3.5 text-black" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admin BI Dashboard Toggle */}
          <button
            onClick={() => onToggleView(currentView === 'store' ? 'admin' : 'store')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              currentView === 'admin'
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-slate-950 border-white/20 text-slate-300 hover:text-white hover:border-white/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {currentView === 'admin' ? 'Storefront' : 'Admin BI'}
            </span>
          </button>

          {/* Theme Selector (Monochrome Black & White, Light, Cyber, Obsidian) */}
          <ThemeSelector />

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-black font-extrabold text-xs border border-white shadow-md hover:bg-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-2.5 md:hidden flex items-center gap-2">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-9 pr-20 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
          />
          <button
            onClick={onOpenVisualSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300"
          >
            Visual
          </button>
        </div>
      </div>
    </header>
  );
}
