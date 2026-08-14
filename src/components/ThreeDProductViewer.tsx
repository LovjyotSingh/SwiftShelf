'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Eye, Layers } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 12, y: 45 });
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

      // 1. Ambient Background Lighting Glow
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY - 20,
        20,
        centerX,
        centerY,
        width / 1.4
      );
      bgGrad.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
      bgGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.08)');
      bgGrad.addColorStop(1, 'rgba(9, 11, 16, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Auto rotation increment
      if (isAutoRotate && !isDragging) {
        setRotation((prev) => ({ ...prev, y: (prev.y + 0.6) % 360 }));
      }

      const radY = (rotation.y * Math.PI) / 180;
      const radX = (rotation.x * Math.PI) / 180;
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const sinX = Math.sin(radX);

      ctx.save();
      ctx.translate(centerX, centerY);

      // 2. Pedestal Turntable Shadow & Grid
      ctx.beginPath();
      ctx.ellipse(0, 110 * zoom, 140 * zoom, 35 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fill();

      // Pedestal Ring
      ctx.beginPath();
      ctx.ellipse(0, 110 * zoom, 120 * zoom, 28 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Render Product Meshes
      if (productType.includes('watch')) {
        // --- 3D SMARTWATCH ---
        ctx.save();
        ctx.rotate(radX * 0.2);

        // Titanium Body Case
        ctx.beginPath();
        ctx.ellipse(0, 0, 85 * zoom * Math.max(0.2, Math.abs(cosY)), 85 * zoom, 0, 0, Math.PI * 2);
        const gradBezel = ctx.createLinearGradient(-80, -80, 80, 80);
        gradBezel.addColorStop(0, '#E2E8F0');
        gradBezel.addColorStop(0.5, selectedColor);
        gradBezel.addColorStop(1, '#0F172A');
        ctx.fillStyle = gradBezel;
        ctx.fill();
        ctx.lineWidth = 4 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();

        // OLED Sapphire Screen
        ctx.beginPath();
        ctx.ellipse(0, 0, 70 * zoom * Math.max(0.2, Math.abs(cosY)), 70 * zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#020617';
        ctx.fill();

        // Watch Face Graphics
        if (Math.abs(cosY) > 0.3) {
          ctx.font = `bold ${14 * zoom}px Outfit, sans-serif`;
          ctx.fillStyle = '#38BDF8';
          ctx.textAlign = 'center';
          ctx.fillText('10:42 AM', 0, -8 * zoom);

          ctx.font = `${10 * zoom}px sans-serif`;
          ctx.fillStyle = '#10B981';
          ctx.fillText('⚡ 72 BPM • 99% O2', 0, 14 * zoom);

          ctx.beginPath();
          ctx.arc(0, 0, 52 * zoom, 0, 1.4 * Math.PI);
          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 2.5 * zoom;
          ctx.stroke();
        }

        // Lugs
        ctx.fillStyle = selectedColor;
        ctx.fillRect(-22 * zoom, -112 * zoom, 44 * zoom, 32 * zoom);
        ctx.fillRect(-22 * zoom, 80 * zoom, 44 * zoom, 32 * zoom);

        ctx.restore();
      } else if (productType.includes('chair')) {
        // --- 3D ERGONOMIC CHAIR ---
        ctx.save();
        ctx.rotate(radY * 0.15);

        // Aluminum Spine
        ctx.beginPath();
        ctx.moveTo(0, -95 * zoom);
        ctx.lineTo(0, 45 * zoom);
        ctx.lineWidth = 7 * zoom;
        ctx.strokeStyle = '#94A3B8';
        ctx.stroke();

        // Mesh Backrest Frame
        ctx.beginPath();
        ctx.roundRect(-55 * zoom, -95 * zoom, 110 * zoom, 110 * zoom, [20, 20, 10, 10]);
        ctx.fillStyle = selectedColor;
        ctx.fill();
        ctx.lineWidth = 3 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();

        // Lumbar Cradle
        ctx.beginPath();
        ctx.ellipse(0, -25 * zoom, 42 * zoom, 16 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();

        // Seat Pan
        ctx.beginPath();
        ctx.ellipse(0, 30 * zoom, 65 * zoom, 25 * zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.stroke();

        // Base & Casters
        ctx.beginPath();
        ctx.moveTo(0, 45 * zoom);
        ctx.lineTo(0, 90 * zoom);
        ctx.lineWidth = 5 * zoom;
        ctx.strokeStyle = '#E2E8F0';
        ctx.stroke();

        ctx.restore();
      } else {
        // --- 3D AUDIOPHILE HEADPHONES (SPECTRE PRO) ---
        // Aluminum Headband Arc
        ctx.beginPath();
        ctx.arc(0, -25 * zoom, 85 * zoom, Math.PI * 0.88, Math.PI * 2.12);
        ctx.lineWidth = 14 * zoom;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0B0F19';
        ctx.stroke();

        // Leather Cushion Layer
        ctx.beginPath();
        ctx.arc(0, -25 * zoom, 80 * zoom, Math.PI * 0.92, Math.PI * 2.08);
        ctx.lineWidth = 6 * zoom;
        ctx.strokeStyle = selectedColor;
        ctx.stroke();

        // Left Acoustic Ear Cup
        const leftX = (-82 + sinY * 26) * zoom;
        const leftY = (15 + cosY * 12) * zoom;
        ctx.save();
        ctx.translate(leftX, leftY);
        ctx.rotate(-0.15 + sinX * 0.2);

        ctx.beginPath();
        ctx.ellipse(0, 0, 30 * zoom, 46 * zoom, 0, 0, Math.PI * 2);
        const gradL = ctx.createLinearGradient(-35, -35, 35, 35);
        gradL.addColorStop(0, '#475569');
        gradL.addColorStop(0.5, selectedColor);
        gradL.addColorStop(1, '#020617');
        ctx.fillStyle = gradL;
        ctx.fill();
        ctx.lineWidth = 2.5 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();

        // Specular Rim
        ctx.beginPath();
        ctx.ellipse(0, 0, 18 * zoom, 30 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
        ctx.restore();

        // Right Acoustic Ear Cup
        const rightX = (82 + sinY * 26) * zoom;
        const rightY = (15 - cosY * 12) * zoom;
        ctx.save();
        ctx.translate(rightX, rightY);
        ctx.rotate(0.15 - sinX * 0.2);

        ctx.beginPath();
        ctx.ellipse(0, 0, 30 * zoom, 46 * zoom, 0, 0, Math.PI * 2);
        const gradR = ctx.createLinearGradient(-35, -35, 35, 35);
        gradR.addColorStop(0, '#64748B');
        gradR.addColorStop(0.5, selectedColor);
        gradR.addColorStop(1, '#020617');
        ctx.fillStyle = gradR;
        ctx.fill();
        ctx.lineWidth = 2.5 * zoom;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();

        // Specular Rim
        ctx.beginPath();
        ctx.ellipse(0, 0, 18 * zoom, 30 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    // Immediate initial render
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, zoom, isAutoRotate, isDragging, productType, selectedColor]);

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
      ref={containerRef}
      className={`relative w-full h-[320px] md:h-[380px] rounded-2xl glass-panel overflow-hidden flex items-center justify-center select-none bg-[#07090E] ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-200 shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>360° Studio Mesh</span>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/5 backdrop-blur-md">
        <Eye className="w-3 h-3 text-cyan-400" />
        <span>Drag to rotate</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(!isAutoRotate);
          }}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
            isAutoRotate
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
              : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto Turntable"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.min(1.4, prev + 0.1));
          }}
          className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.max(0.7, prev - 0.1));
          }}
          className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
