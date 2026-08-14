'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Layers, Eye } from 'lucide-react';

interface ThreeDProductViewerProps {
  productType?: string;
  selectedColor?: string;
  className?: string;
}

export default function ThreeDProductViewer({
  productType = 'headphones',
  selectedColor = '#121316',
  className = '',
}: ThreeDProductViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 15, y: 35 });
  const [zoom, setZoom] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Radial ambient lighting backdrop
      const radialGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 1.5);
      radialGlow.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      radialGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
      radialGlow.addColorStop(1, 'rgba(9, 11, 16, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Auto rotation increment
      if (isAutoRotate && !isDragging) {
        setRotation((prev) => ({ ...prev, y: (prev.y + 0.6) % 360 }));
      }

      const radY = (rotation.y * Math.PI) / 180;
      const radX = (rotation.x * Math.PI) / 180;
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);

      const scale = 110 * zoom;

      ctx.save();
      ctx.translate(centerX, centerY);

      // 3D Shadow Floor
      ctx.beginPath();
      ctx.ellipse(0, 110 * zoom, 120 * zoom, 25 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.filter = 'blur(10px)';
      ctx.fill();
      ctx.filter = 'none';

      // 3D Model Rendering based on product category
      if (productType.includes('watch')) {
        // --- 3D SMARTWATCH ---
        // Watch Case Cylinder / Bezel
        ctx.save();
        ctx.rotate(radX * 0.3);

        // Titanium Outer Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 85 * zoom * Math.abs(cosY), 85 * zoom, 0, 0, Math.PI * 2);
        const gradBezel = ctx.createLinearGradient(-80, -80, 80, 80);
        gradBezel.addColorStop(0, '#E2E8F0');
        gradBezel.addColorStop(0.5, selectedColor);
        gradBezel.addColorStop(1, '#1E293B');
        ctx.fillStyle = gradBezel;
        ctx.fill();
        ctx.lineWidth = 4 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();

        // Sapphire Screen Display
        ctx.beginPath();
        ctx.ellipse(0, 0, 72 * zoom * Math.abs(cosY), 72 * zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#05070D';
        ctx.fill();

        // Screen Telemetry Graphic
        if (Math.abs(cosY) > 0.3) {
          ctx.font = `bold ${14 * zoom}px Outfit`;
          ctx.fillStyle = '#38BDF8';
          ctx.textAlign = 'center';
          ctx.fillText('10:42 AM', 0, -10 * zoom);

          ctx.font = `${10 * zoom}px Plus Jakarta Sans`;
          ctx.fillStyle = '#34D399';
          ctx.fillText('⚡ 72 BPM | 98% O2', 0, 15 * zoom);

          // Circular progress ring
          ctx.beginPath();
          ctx.arc(0, 0, 50 * zoom, 0, 1.4 * Math.PI);
          ctx.strokeStyle = '#818CF8';
          ctx.lineWidth = 3 * zoom;
          ctx.stroke();
        }

        // Strap Lugs
        ctx.fillStyle = selectedColor;
        ctx.fillRect(-25 * zoom, -115 * zoom, 50 * zoom, 35 * zoom);
        ctx.fillRect(-25 * zoom, 80 * zoom, 50 * zoom, 35 * zoom);

        ctx.restore();
      } else if (productType.includes('chair')) {
        // --- 3D ERGONOMIC CHAIR ---
        // Backrest Spine
        ctx.save();
        ctx.rotate(radY * 0.2);

        // Aluminum spine
        ctx.beginPath();
        ctx.moveTo(0, -90 * zoom);
        ctx.lineTo(0, 40 * zoom);
        ctx.lineWidth = 8 * zoom;
        ctx.strokeStyle = '#94A3B8';
        ctx.stroke();

        // Mesh Backrest
        ctx.beginPath();
        ctx.roundRect(-55 * zoom, -95 * zoom, 110 * zoom, 105 * zoom, [20, 20, 8, 8]);
        ctx.fillStyle = selectedColor;
        ctx.fill();
        ctx.lineWidth = 3 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Seat Pan
        ctx.beginPath();
        ctx.ellipse(0, 25 * zoom, 60 * zoom, 25 * zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.stroke();

        // Base & Casters
        ctx.beginPath();
        ctx.moveTo(0, 40 * zoom);
        ctx.lineTo(0, 85 * zoom);
        ctx.lineWidth = 6 * zoom;
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();

        ctx.restore();
      } else {
        // --- 3D AUDIOPHILE HEADPHONES (Default Flagship) ---
        // Headband Arch
        ctx.beginPath();
        ctx.arc(0, -20 * zoom, 80 * zoom, Math.PI * 0.9, Math.PI * 2.1);
        ctx.lineWidth = 14 * zoom;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0F172A';
        ctx.stroke();

        // Inner Comfort Leather Cushion
        ctx.beginPath();
        ctx.arc(0, -20 * zoom, 76 * zoom, Math.PI * 0.95, Math.PI * 2.05);
        ctx.lineWidth = 6 * zoom;
        ctx.strokeStyle = selectedColor;
        ctx.stroke();

        // Left Ear Cup 3D projection
        const leftX = (-80 + sinY * 25) * zoom;
        const leftY = (15 + cosY * 10) * zoom;
        ctx.save();
        ctx.translate(leftX, leftY);
        ctx.rotate(-0.15 + sinX * 0.2);

        // Cup body
        ctx.beginPath();
        ctx.ellipse(0, 0, 28 * zoom, 42 * zoom, 0, 0, Math.PI * 2);
        const gradL = ctx.createLinearGradient(-30, -30, 30, 30);
        gradL.addColorStop(0, '#334155');
        gradL.addColorStop(0.5, selectedColor);
        gradL.addColorStop(1, '#020617');
        ctx.fillStyle = gradL;
        ctx.fill();
        ctx.lineWidth = 2 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Acoustic Chamfer Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 16 * zoom, 26 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
        ctx.restore();

        // Right Ear Cup 3D projection
        const rightX = (80 + sinY * 25) * zoom;
        const rightY = (15 - cosY * 10) * zoom;
        ctx.save();
        ctx.translate(rightX, rightY);
        ctx.rotate(0.15 - sinX * 0.2);

        ctx.beginPath();
        ctx.ellipse(0, 0, 28 * zoom, 42 * zoom, 0, 0, Math.PI * 2);
        const gradR = ctx.createLinearGradient(-30, -30, 30, 30);
        gradR.addColorStop(0, '#475569');
        gradR.addColorStop(0.5, selectedColor);
        gradR.addColorStop(1, '#020617');
        ctx.fillStyle = gradR;
        ctx.fill();
        ctx.lineWidth = 2 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, 16 * zoom, 26 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, zoom, isAutoRotate, isDragging, productType, selectedColor]);

  // Mouse & Touch Drag Handlers
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
      x: Math.max(-45, Math.min(45, prev.x + deltaY * 0.5)),
      y: (prev.y + deltaX * 0.8) % 360,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`relative w-full h-[360px] md:h-[440px] rounded-2xl glass-panel overflow-hidden flex items-center justify-center select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={440}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Badges & Controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-xs font-medium text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Interactive 3D WebGL Mesh</span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/5">
        <Eye className="w-3.5 h-3.5 text-slate-400" />
        <span>Drag to orbit 360°</span>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(!isAutoRotate);
          }}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
            isAutoRotate
              ? 'bg-indigo-600/80 border-indigo-400/50 text-white'
              : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.min(1.4, prev + 0.1));
          }}
          className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.max(0.7, prev - 0.1));
          }}
          className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
