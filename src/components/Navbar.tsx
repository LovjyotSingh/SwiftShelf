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
} from 'lucide-react';
import { ProductCategory } from '@/types';
import { UserSession } from './AuthModal';

interface NavbarProps {
  cartCount: number;
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onOpenVisualSearch: () => void;
  onOpenAIConcierge: () => void;
  onSelectCategory: (category: ProductCategory | 'ALL') => void;
  selectedCategory: ProductCategory | 'ALL';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentView: 'store' | 'admin';
  onToggleView: (view: 'store' | 'admin') => void;
}

export default function Navbar({
  cartCount,
  user,
  onOpenAuth,
  onOpenAccount,
  onOpenCart,
  onOpenVisualSearch,
  onOpenAIConcierge,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  currentView,
  onToggleView,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full px-4 lg:px-8 py-3.5 glass-panel border-b border-white/5 bg-[#090B10]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onToggleView('store')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                SWIFT<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SHELF</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wider">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI & Concurrency E-Commerce</p>
          </div>
        </div>

        {/* Center: Search & AI Controls */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search flagship audio, titanium wearables, 6K OLED..."
              className="w-full pl-10 pr-24 py-2 text-xs rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
            {/* Visual Search Button Inside Input */}
            <button
              onClick={onOpenVisualSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 text-[11px] font-medium transition-all"
              title="Multimodal Visual Search"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
          </div>

          {/* AI Command Concierge Trigger */}
          <button
            onClick={onOpenAIConcierge}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 text-xs font-medium backdrop-blur-md transition-all whitespace-nowrap"
            title="Open AI Concierge (Cmd+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">AI Concierge</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right Controls: User Profile + Mode Switcher + Cart */}
        <div className="flex items-center gap-2.5">
          {/* User Auth / Account Trigger */}
          {user ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-white/15 hover:border-indigo-400 transition-all text-xs text-slate-200"
            >
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                }
                alt="avatar"
                className="w-6 h-6 rounded-lg object-cover bg-slate-950"
              />
              <span className="font-semibold hidden sm:inline truncate max-w-[90px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-400 text-slate-200 hover:text-white text-xs font-semibold transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admin BI Dashboard Toggle */}
          <button
            onClick={() => onToggleView(currentView === 'store' ? 'admin' : 'store')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              currentView === 'admin'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {currentView === 'admin' ? 'Storefront' : 'Admin BI'}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-xs border border-white/20 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-[#090B10] font-bold text-[11px] flex items-center justify-center animate-pulse">
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
