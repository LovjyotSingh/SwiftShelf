'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Camera, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { searchByImageAnalysis } from '@/lib/ai/vectorSearch';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AIVisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function AIVisualSearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: AIVisualSearchModalProps) {
  if (!isOpen) return null;

  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<Array<{ product: Product; matchReason: string; confidence: number }>>([]);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const samplePresets = [
    {
      label: 'Matte Audiophile Headphones',
      category: 'Audio',
      color: 'black',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Titanium Smartwatch Casing',
      category: 'Wearables',
      color: 'titanium',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Ergonomic Desk Mesh Setup',
      category: 'Ergonomics',
      color: 'mesh',
      thumbnail: 'https://images.unsplash.com/photo-1580481077195-c9906d445c71?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Minimalist Desk Lightbar',
      category: 'Smart Living',
      color: 'ambient',
      thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handleSimulateScan = (preset: (typeof samplePresets)[0]) => {
    setSelectedSample(preset.label);
    setIsScanning(true);
    setResults([]);

    setTimeout(() => {
      const match = searchByImageAnalysis({
        label: preset.label,
        inferredCategory: preset.category,
        dominantColor: preset.color,
      });
      setResults(match);
      setIsScanning(false);
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedSample(file.name);
    setIsScanning(true);
    setResults([]);

    setTimeout(() => {
      const match = searchByImageAnalysis({
        label: file.name,
        inferredCategory: 'Audio',
        dominantColor: 'black',
      });
      setResults(match);
      setIsScanning(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-white/10 shadow-2xl bg-[#0D111A] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>Multimodal AI Visual Search</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  pgvector
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Drop an image or select a visual sample to match catalog embeddings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/70 rounded-2xl bg-indigo-950/10 cursor-pointer transition-all group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">Click to upload</span> or drag and drop image
            </div>
            <p className="text-[11px] text-slate-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </label>

        {/* Preset Sample Thumbnails */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">Or try visual presets:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateScan(preset)}
                className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedSample === preset.label
                    ? 'border-cyan-400 bg-indigo-950/40 shadow-md'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30'
                }`}
              >
                <div className="w-full h-14 rounded-lg overflow-hidden bg-slate-950">
                  <img src={preset.thumbnail} alt="sample" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scanner Loading State */}
        {isScanning && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
            <div className="text-xs font-bold text-white">
              Extracting Visual Semantics & Searching 1536-d Vector Space...
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-marquee" />
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && !isScanning && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">
                Found {results.length} Visual Matches:
              </span>
              <span className="text-slate-500">Ranked by Cosine Similarity</span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {results.map(({ product, matchReason, confidence }) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-card flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-400/50 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-950"
                    />
                    <div>
                      <h4 className="font-bold text-white">{product.title}</h4>
                      <p className="text-[11px] text-slate-400">{matchReason}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-white">{formatCurrency(product.price)}</div>
                    <div className="text-[10px] text-cyan-400 font-mono font-semibold">
                      {confidence}% Match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
