'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

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
    try {
      localStorage.setItem('swiftshelf_theme', theme);
    } catch (e) {}
  }, [theme]);

  const themes = [
    {
      id: 'dark',
      label: 'Pitch Black & Metallic Shine',
      icon: Moon,
      desc: 'Deep black background with silver metallic shiny text & layout',
      swatch: 'bg-black border-white/40',
    },
    {
      id: 'light',
      label: 'Pearl White & Dark Metallic Shine',
      icon: Sun,
      desc: 'Pristine white background with shiny dark typography',
      swatch: 'bg-white border-black/40',
    },
    {
      id: 'cyber',
      label: 'Aurora Radiant Mixed Color',
      icon: Sparkles,
      desc: 'Vibrant indigo-cyan-violet gradient mesh & neon glow',
      swatch: 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500',
    },
  ];

  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentThemeObj.icon;

  return (
    <div className="relative z-50 font-sans">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="theme-button-trigger flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-lg border hover:scale-105 active:scale-95"
        title="Switch Visual Theme"
      >
        <CurrentIcon className="w-4 h-4 text-cyan-400" />
        <span className="hidden md:inline font-heading uppercase text-[11px] tracking-wider font-extrabold">
          {currentThemeObj.label.split(' ')[0]} Theme
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl theme-dropdown-panel p-2 shadow-2xl backdrop-blur-2xl text-xs space-y-1 z-50">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest opacity-60 border-b border-white/10 mb-1">
            Select Visual Experience
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
                    ? 'theme-dropdown-item-active font-extrabold shadow-md scale-[1.02]'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border ${t.swatch} shrink-0`} />
                  <div>
                    <div className="leading-tight font-bold text-xs flex items-center gap-1.5">
                      <span>{t.label}</span>
                    </div>
                    <div className="text-[10px] opacity-70 mt-0.5 leading-snug">
                      {t.desc}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
