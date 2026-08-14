'use client';

import React from 'react';
import { ShieldCheck, Cpu, Code2, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-10 px-4 lg:px-8 bg-[#07090E] text-xs text-slate-400 select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Architecture */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-heading font-extrabold text-white text-lg tracking-tight">
              SWIFT<span className="text-cyan-400">SHELF</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              v1.0.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Engineered with Next.js 15, Redis 2-Phase Stock Locking, MongoDB & Gemini AI
          </p>
        </div>

        {/* Creator & Copyright Badge */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Designed &amp; Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
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
