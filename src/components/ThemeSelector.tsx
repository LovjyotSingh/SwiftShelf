'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Palette, Shield } from 'lucide-react';

export default function ThemeSelector() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'cyber' | 'obsidian'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swiftshelf_theme');
      if (saved) return saved as any;
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
    { id: 'dark', label: 'Monochrome Black & White', icon: Moon, desc: 'High-contrast pitch black & white' },
    { id: 'light', label: 'Minimalist White', icon: Sun, desc: 'Clean modern daylight white' },
    { id: 'cyber', label: 'Aurora Cyber', icon: Palette, desc: 'Blue-green high-tech glow' },
    { id: 'obsidian', label: 'Obsidian Stealth', icon: Shield, desc: 'Matte dark obsidian' },
  ];

  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentThemeObj.icon;

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/80 dark:bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all shadow-md backdrop-blur-md"
        title="Switch Visual Theme"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden md:inline font-mono uppercase text-[10px] tracking-wider">
          {currentThemeObj.label.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090B10] border border-white/20 p-2 shadow-2xl backdrop-blur-2xl text-xs space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-white/10 mb-1">
            Choose Visual Theme
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
                className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left transition-all ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                  <div>
                    <div className="leading-tight font-bold">{t.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                      {t.desc}
                    </div>
                  </div>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-black"></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
