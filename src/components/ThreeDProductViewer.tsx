'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Eye, Info, Layers } from 'lucide-react';

interface Hotspot {
  title: string;
  desc: string;
  x: number; // percentage
  y: number; // percentage
}

const PRODUCT_HOTSPOTS: Record<string, Hotspot[]> = {
  headphones: [
    { title: '50mm Planar Transducer', desc: 'Custom laser-etched neodymium planar magnetic diaphragm with 5Hz–45kHz range', x: 28, y: 55 },
    { title: 'Acoustic Memory Foam', desc: 'Protein leather with thermo-sensitive contouring for zero ear pressure', x: 72, y: 55 },
    { title: 'Titanium Slider Arc', desc: 'Grade 5 aerospace alloy extenders with stepped micro-ratchet adjustment', x: 50, y: 15 },
  ],
  chair: [
    { title: 'Biomorphic Lumbar Cradle', desc: 'Self-adjusting active lumbar support engineered with orthopedic surgeons', x: 50, y: 52 },
    { title: 'German Elastomer Mesh', desc: 'High-tensile breathable matrix distributing pressure evenly', x: 50, y: 28 },
    { title: '4D Haptic Armrests', desc: 'Multi-directional pivot and height lock with aluminum core brackets', x: 22, y: 48 },
    { title: 'Die-Cast Aluminum Base', desc: '5-star mirror polished base with silent polyurethane caster wheels', x: 50, y: 88 },
  ],
  watch: [
    { title: 'Sapphire LTPO Display', desc: '3000 nits peak outdoor brightness with edge-to-edge sapphire crystal', x: 50, y: 42 },
    { title: 'Grade 5 Titanium Bezel', desc: 'Diamond-like carbon (DLC) coating with micro-bead blast texture', x: 30, y: 42 },
    { title: 'Digital Precision Crown', desc: 'Machined rotary encoder with haptic click vibration feedback', x: 74, y: 40 },
  ],
  monitor: [
    { title: '6K Retina OLED Panel', desc: '6016 x 3384 native resolution with 99.8% DCI-P3 color gamut', x: 50, y: 35 },
    { title: 'Thunderbolt 5 Hub', desc: '140W single-cable bi-directional video and power delivery hub', x: 50, y: 75 },
  ],
  keyboard: [
    { title: 'Hall Effect Switches', desc: '0.1mm magnetic rapid trigger actuation with zero debounce latency', x: 40, y: 48 },
    { title: 'CNC 6063 Aluminum', desc: 'Precision milled chassis with internal acoustic silicone dampening', x: 50, y: 70 },
  ],
  mouse: [
    { title: '42K DPI Sensor', desc: 'Gen-3 SwiftTrack optical sensor with 8000Hz hyper-polling rate', x: 50, y: 40 },
    { title: 'Magnesium Exoskeleton', desc: 'Featherlight 49-gram structural skeleton with zero body flex', x: 50, y: 65 },
  ],
  lamp: [
    { title: 'Asymmetrical Optical Bar', desc: 'Zero screen reflection asymmetric light projection at CRI 98', x: 50, y: 25 },
    { title: 'Wireless Rotary Dial', desc: 'Machined desktop puck with continuous 2700K–6500K color control', x: 50, y: 80 },
  ],
  earbuds: [
    { title: 'Micro-Planar Transducers', desc: '6mm micro-planar + 11mm dynamic subwoofer acoustic architecture', x: 35, y: 40 },
    { title: 'Titanium Charging Chassis', desc: 'Aerospace grade titanium casing with Qi wireless fast charging', x: 65, y: 60 },
  ],
};

interface ThreeDProductViewerProps {
  productType?: string;
  productImage?: string;
  selectedColor?: string;
  className?: string;
}

export default function ThreeDProductViewer({
  productType = 'headphones',
  productImage,
  selectedColor = '#121316',
  className = '',
}: ThreeDProductViewerProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: Math.sin(Date.now() / 1500) * 8,
        y: (prev.y + 0.5) % 360,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-25, Math.min(25, prev.x + deltaY * 0.4)),
      y: (prev.y + deltaX * 0.6) % 360,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.current.x;
    const deltaY = e.touches[0].clientY - dragStart.current.y;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotation((prev) => ({
      x: Math.max(-25, Math.min(25, prev.x + deltaY * 0.4)),
      y: (prev.y + deltaX * 0.6) % 360,
    }));
  };

  const normalizedType = Object.keys(PRODUCT_HOTSPOTS).find((k) =>
    productType.toLowerCase().includes(k)
  ) || 'headphones';

  const hotspots = PRODUCT_HOTSPOTS[normalizedType] || [];

  // Fallback verified image if not provided
  const displayImage =
    productImage ||
    (normalizedType === 'chair'
      ? 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800'
      : normalizedType === 'watch'
      ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');

  return (
    <div
      className={`relative w-full h-[340px] md:h-[420px] rounded-2xl glass-panel overflow-hidden flex items-center justify-center select-none bg-[#07090E] border border-white/10 ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{ perspective: 1200 }}
    >
      {/* 1. Ambient Dynamic Studio Lighting Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + rotation.y * 0.1}% ${
            45 + rotation.x * 0.5
          }%, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.08) 40%, rgba(7, 9, 14, 0.95) 80%)`,
        }}
      />

      {/* 2. Turntable Pedestal Base */}
      <div className="absolute bottom-6 w-72 h-16 pointer-events-none flex items-center justify-center">
        <div
          className="w-full h-full rounded-[100%] border border-indigo-500/30 bg-slate-950/60 shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-transform duration-75"
          style={{
            transform: `rotateX(75deg) rotateZ(${rotation.y}deg)`,
          }}
        />
      </div>

      {/* 3. Interactive 3D Perspective Hardware Container */}
      <div
        className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out"
        style={{
          transform: `scale(${zoom}) rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Authentic Product Photography */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
          <img
            src={displayImage}
            alt="3D Studio Inspection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-500 pointer-events-none"
            loading="eager"
          />

          {/* Real-time Dynamic Specular Light Glare */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-150"
            style={{
              background: `linear-gradient(${rotation.y + 45}deg, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              opacity: Math.abs(Math.sin((rotation.y * Math.PI) / 180)) * 0.7 + 0.1,
            }}
          />

          {/* Dynamic Finish Color Accent Ambient Wash */}
          {selectedColor && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-500"
              style={{
                backgroundColor: selectedColor,
                opacity: 0.18,
              }}
            />
          )}
        </div>

        {/* 4. Interactive Engineering Hotspot Badges on 3D Surface */}
        {hotspots.map((spot, idx) => (
          <div
            key={idx}
            className="absolute z-20"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: `translate(-50%, -50%) translateZ(25px)`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspot(activeHotspot?.title === spot.title ? null : spot);
            }}
          >
            <button
              className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                activeHotspot?.title === spot.title
                  ? 'bg-cyan-400 border-white text-slate-950 scale-125 shadow-lg shadow-cyan-400/50 ring-4 ring-cyan-400/30'
                  : 'bg-slate-900/90 border-cyan-400/60 text-cyan-300 hover:scale-110 hover:bg-cyan-500 hover:text-slate-950 animate-pulse'
              }`}
              title={spot.title}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 5. Floating Engineering Spec Details Card */}
      {activeHotspot && (
        <div className="absolute top-14 left-4 right-4 md:left-auto md:right-4 md:w-80 p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              {activeHotspot.title}
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-slate-400 hover:text-white text-xs font-mono px-1.5 py-0.5 rounded bg-white/5"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-light">
            {activeHotspot.desc}
          </p>
        </div>
      )}

      {/* Top Studio Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md text-xs font-semibold text-white shadow-lg shadow-indigo-500/10">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>360° Studio Visualizer</span>
      </div>

      {/* Bottom Instructions */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag to orbit • Click ℹ for specs</span>
      </div>

      {/* Studio Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(!isAutoRotate);
          }}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all shadow-md ${
            isAutoRotate
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/30'
              : 'bg-slate-900/90 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.min(1.4, prev + 0.15));
          }}
          className="p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.max(0.7, prev - 0.15));
          }}
          className="p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
