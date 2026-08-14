'use client';

import React from 'react';
import { Code2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-inherit py-10 px-4 lg:px-8 bg-current/5 text-xs opacity-90 select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Architecture */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-heading font-extrabold text-lg tracking-tight shiny-text">
              SWIFT<span className="opacity-70">SHELF</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full theme-card font-mono font-bold">
              v1.0.0
            </span>
          </div>
          <p className="text-[11px] opacity-70">
            Engineered with Next.js 15, Redis 2-Phase Stock Locking, MongoDB &amp; Gemini AI
          </p>
        </div>

        {/* Creator & Copyright Badge */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center">
          <div className="flex items-center gap-1.5 font-semibold theme-card px-3.5 py-1.5 rounded-full shadow-md">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Designed &amp; Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by <strong className="shiny-text">Lovjyot Singh</strong></span>
          </div>

          <div className="text-[11px] opacity-70 font-mono font-medium">
            &copy; 2026 <span className="font-bold shiny-text">SwiftShelf Inc.</span> • All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
