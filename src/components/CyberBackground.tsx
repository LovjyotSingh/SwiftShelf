'use client';

import React, { useEffect, useRef } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Star Particles
    const particleCount = Math.min(45, Math.floor(width / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    let lastTime = 0;

    const render = (time: number) => {
      if (time - lastTime < 20) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;

      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      ctx.clearRect(0, 0, width, height);

      if (currentTheme === 'light') {
        // Light White Luxury Theme Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const radial = ctx.createRadialGradient(
          width * 0.5,
          height * 0.15,
          20,
          width * 0.5,
          height * 0.15,
          width * 0.75
        );
        radial.addColorStop(0, 'rgba(15, 23, 42, 0.05)');
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // Dark Slate Particles for Light Mode
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.02;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${Math.max(0.1, currentAlpha * 0.4)})`;
          ctx.fill();
        }
      } else if (currentTheme === 'cyber') {
        // Aurora Gradient Mesh (Deep Indigo ➔ Cyan ➔ Emerald)
        const linearGrad = ctx.createLinearGradient(0, 0, width, height);
        linearGrad.addColorStop(0, '#030712');
        linearGrad.addColorStop(0.35, '#0c4a6e');
        linearGrad.addColorStop(0.7, '#2e1065');
        linearGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = linearGrad;
        ctx.fillRect(0, 0, width, height);

        const radial = ctx.createRadialGradient(
          width * 0.35,
          height * 0.25,
          10,
          width * 0.35,
          height * 0.25,
          width * 0.75
        );
        radial.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        radial.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
        radial.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // Cyan & Emerald Glowing Particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.02;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2;
          const colorStr = i % 2 === 0 ? '56, 189, 248' : '52, 211, 153';

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorStr}, ${Math.max(0, currentAlpha * 0.25)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorStr}, ${Math.max(0.2, currentAlpha)})`;
          ctx.fill();
        }
      } else {
        // Dark Obsidian & Silver Glow (Pitch Black Velvet)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const radial = ctx.createRadialGradient(
          width * 0.5,
          height * 0.15,
          10,
          width * 0.5,
          height * 0.15,
          width * 0.65
        );
        radial.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        radial.addColorStop(0.6, 'rgba(255, 255, 255, 0.02)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.02;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentAlpha * 0.18)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, currentAlpha)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Watch for DOM data-theme changes to trigger immediate re-render
    const observer = new MutationObserver(() => {
      render(performance.now());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100 transition-opacity duration-300"
      style={{ willChange: 'transform' }}
    />
  );
}
