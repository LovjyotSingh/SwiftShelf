'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Sparkles, Check } from 'lucide-react';

export default function ThemeSelector() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'cyber'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swiftshelf_theme');
      if (saved && ['dark', 'light', 'cyber'].includes(saved)) {
        return saved as 'dark' | 'light' | 'cyber';
      }
    }
    return 'dark';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    try {
      localStorage.setItem('swiftshelf_theme', theme);
    } catch (e) {}
  }, [theme]);

  const themes = [
    {
      id: 'dark',
      label: 'Pitch Black & Metallic Shine',
      icon: Moon,
      desc: 'Velvet pitch black with liquid silver metallic sheen',
      swatch: 'bg-black border-white/50 shadow-[0_0_8px_rgba(255,255,255,0.4)]',
    },
    {
      id: 'light',
      label: 'Pearl White & Dark Metallic',
      icon: Sun,
      desc: 'Pristine pearl white with dark obsidian typography',
      swatch: 'bg-white border-black/40 shadow-[0_0_8px_rgba(0,0,0,0.15)]',
    },
    {
      id: 'cyber',
      label: 'Aurora Radiant Mixed Color',
      icon: Sparkles,
      desc: 'Vibrant indigo-cyan-emerald holographic glow',
      swatch: 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]',
    },
  ];

  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentThemeObj.icon;

  return (
    <div className="relative z-50 font-sans">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="luxury-button-secondary flex items-center gap-2 px-3.5 py-2 text-xs"
        title="Switch Visual Theme"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden md:inline font-mono uppercase text-[10px] tracking-wider font-bold">
          {currentThemeObj.label.split(' ')[0]} Theme
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl luxury-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest opacity-60 border-b border-inherit mb-1">
            Choose Visual Atmosphere
          </div>
          {themes.map((t) => {
            const IconComponent = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                  isSelected
                    ? 'luxury-button font-bold scale-[1.02]'
                    : 'opacity-80 hover:opacity-100 hover:bg-current/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border ${t.swatch} shrink-0`} />
                  <div>
                    <div className="leading-tight font-bold text-xs">
                      {t.label}
                    </div>
                    <div className="text-[10px] opacity-70 mt-0.5 leading-snug">
                      {t.desc}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
