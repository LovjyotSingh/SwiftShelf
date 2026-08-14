'use client';

import React from 'react';
import { Code2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-10 px-4 lg:px-8 bg-black text-xs text-slate-400 select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Architecture */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-heading font-extrabold text-white text-lg tracking-tight">
              SWIFT<span className="text-slate-400">SHELF</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-mono">
              v1.0.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Engineered with Next.js 15, Redis 2-Phase Stock Locking, MongoDB &amp; Gemini AI
          </p>
        </div>

        {/* Creator & Copyright Badge */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold bg-black px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
            <Code2 className="w-3.5 h-3.5 text-white" />
            <span>Designed &amp; Built with</span>
            <Heart className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
            <span>by <strong className="text-white">Lovjyot Singh</strong></span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono font-medium">
            &copy; 2026 <span className="text-white font-bold">SwiftShelf Inc.</span> • All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
