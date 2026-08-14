'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Eye } from 'lucide-react';

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
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // References for live interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const productGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Rotation & Drag state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: 0.8 });
  const currentRotationRef = useRef({ x: 0.15, y: 0.8 });
  const isAutoRotateRef = useRef(true);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 10.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x06b6d4, 3.5, 20);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x6366f1, 4.0, 20);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 5. Turntable Pedestal Floor
    const floorGeo = new THREE.CircleGeometry(4.8, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090c14,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.8;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing Pedestal Ring
    const ringGeo = new THREE.RingGeometry(4.7, 4.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -2.79;
    scene.add(ring);

    // 6. Build 3D Geometric Product Models tailored to each item
    const productGroup = new THREE.Group();
    productGroupRef.current = productGroup;
    scene.add(productGroup);

    materialsRef.current = [];

    // Metallic / Finish Material
    const primaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      metalness: 0.85,
      roughness: 0.25,
    });
    materialsRef.current.push(primaryMat);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x11141d,
      metalness: 0.4,
      roughness: 0.6,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const type = productType.toLowerCase();

    if (type.includes('watch')) {
      // --- 3D SMARTWATCH (AURA HORIZON TITAN) ---
      const caseGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.75, 48);
      const watchCase = new THREE.Mesh(caseGeo, primaryMat);
      watchCase.castShadow = true;
      productGroup.add(watchCase);

      const bezelGeo = new THREE.TorusGeometry(2.3, 0.12, 16, 48);
      const bezel = new THREE.Mesh(bezelGeo, chromeMat);
      bezel.rotation.x = Math.PI / 2;
      productGroup.add(bezel);

      const screenGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.05, 48);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x05070d,
        roughness: 0.1,
        metalness: 0.9,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.y = 0.39;
      productGroup.add(screen);

      const crownGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 24);
      const crown = new THREE.Mesh(crownGeo, chromeMat);
      crown.rotation.z = Math.PI / 2;
      crown.position.set(2.45, 0.1, 0);
      productGroup.add(crown);

      const strapGeo = new THREE.BoxGeometry(2.0, 0.4, 3.2);
      const topStrap = new THREE.Mesh(strapGeo, darkMat);
      topStrap.position.set(0, 0, 2.8);
      productGroup.add(topStrap);

      const bottomStrap = new THREE.Mesh(strapGeo, darkMat);
      bottomStrap.position.set(0, 0, -2.8);
      productGroup.add(bottomStrap);

      productGroup.rotation.x = 0.4;
    } else if (type.includes('chair')) {
      // --- 3D ERGONOMIC EXECUTIVE CHAIR (ZENITH PRO) ---
      const backGeo = new THREE.BoxGeometry(3.6, 5.2, 0.3);
      const backrest = new THREE.Mesh(backGeo, primaryMat);
      backrest.position.set(0, 1.8, -1.4);
      backrest.rotation.x = -0.12;
      backrest.castShadow = true;
      productGroup.add(backrest);

      const lumbarGeo = new THREE.TorusGeometry(1.5, 0.18, 16, 32, Math.PI);
      const lumbar = new THREE.Mesh(lumbarGeo, chromeMat);
      lumbar.position.set(0, 0.8, -1.6);
      productGroup.add(lumbar);

      const seatGeo = new THREE.BoxGeometry(3.8, 0.5, 3.8);
      const seat = new THREE.Mesh(seatGeo, darkMat);
      seat.position.set(0, -0.6, 0.2);
      seat.castShadow = true;
      productGroup.add(seat);

      const liftGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 24);
      const lift = new THREE.Mesh(liftGeo, chromeMat);
      lift.position.set(0, -1.6, 0);
      productGroup.add(lift);

      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const legGeo = new THREE.BoxGeometry(0.3, 0.2, 2.2);
        const leg = new THREE.Mesh(legGeo, chromeMat);
        leg.position.set(Math.sin(angle) * 1.1, -2.5, Math.cos(angle) * 1.1);
        leg.rotation.y = angle;
        productGroup.add(leg);

        const wheelGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const wheel = new THREE.Mesh(wheelGeo, darkMat);
        wheel.position.set(Math.sin(angle) * 2.1, -2.65, Math.cos(angle) * 2.1);
        productGroup.add(wheel);
      }

      const armGeo = new THREE.BoxGeometry(0.6, 0.2, 2.0);
      const leftArm = new THREE.Mesh(armGeo, darkMat);
      leftArm.position.set(-2.1, 0.4, 0.2);
      productGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, darkMat);
      rightArm.position.set(2.1, 0.4, 0.2);
      productGroup.add(rightArm);
    } else if (type.includes('monitor')) {
      // --- 3D 6K STUDIO OLED MONITOR (LUMINA STUDIO) ---
      const screenGeo = new THREE.BoxGeometry(6.5, 4.0, 0.25);
      const screenBezel = new THREE.Mesh(screenGeo, primaryMat);
      screenBezel.position.set(0, 0.8, 0);
      screenBezel.castShadow = true;
      productGroup.add(screenBezel);

      const oledGlassGeo = new THREE.PlaneGeometry(6.2, 3.7);
      const oledGlassMat = new THREE.MeshStandardMaterial({
        color: 0x05070f,
        roughness: 0.1,
        metalness: 0.9,
      });
      const oledGlass = new THREE.Mesh(oledGlassGeo, oledGlassMat);
      oledGlass.position.set(0, 0.8, 0.14);
      productGroup.add(oledGlass);

      const standGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.2, 24);
      const stand = new THREE.Mesh(standGeo, chromeMat);
      stand.position.set(0, -1.0, -0.4);
      productGroup.add(stand);

      const baseGeo = new THREE.BoxGeometry(3.0, 0.15, 2.2);
      const base = new THREE.Mesh(baseGeo, chromeMat);
      base.position.set(0, -2.6, 0.2);
      productGroup.add(base);
    } else if (type.includes('keyboard')) {
      // --- 3D MECHANICAL KEYBOARD (MATRIX 65) ---
      const caseGeo = new THREE.BoxGeometry(5.8, 0.7, 2.8);
      const kbdCase = new THREE.Mesh(caseGeo, primaryMat);
      kbdCase.rotation.x = 0.2;
      kbdCase.position.set(0, -0.5, 0);
      kbdCase.castShadow = true;
      productGroup.add(kbdCase);

      const keyBlockGeo = new THREE.BoxGeometry(5.4, 0.35, 2.4);
      const keyBlock = new THREE.Mesh(keyBlockGeo, darkMat);
      keyBlock.position.set(0, 0.35, 0);
      kbdCase.add(keyBlock);
    } else if (type.includes('mouse')) {
      // --- 3D WIRELESS PRECISION MOUSE (APEX ULTRA) ---
      const mouseGeo = new THREE.SphereGeometry(1.8, 32, 24);
      mouseGeo.scale(1.0, 0.6, 1.6);
      const mouseBody = new THREE.Mesh(mouseGeo, primaryMat);
      mouseBody.position.set(0, -1.2, 0);
      mouseBody.castShadow = true;
      productGroup.add(mouseBody);

      const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
      const wheel = new THREE.Mesh(wheelGeo, chromeMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(0, -0.7, 1.2);
      productGroup.add(wheel);
    } else if (type.includes('lamp')) {
      // --- 3D AMBIENT DESK BEACON (AURA HALO) ---
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.8, 24);
      const pole = new THREE.Mesh(poleGeo, primaryMat);
      pole.position.set(0, 0, 0);
      productGroup.add(pole);

      const barGeo = new THREE.BoxGeometry(4.5, 0.25, 0.35);
      const bar = new THREE.Mesh(barGeo, primaryMat);
      bar.position.set(0, 2.4, 0.8);
      productGroup.add(bar);

      const dialGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
      const dial = new THREE.Mesh(dialGeo, chromeMat);
      dial.position.set(0, -2.4, 0);
      productGroup.add(dial);
    } else if (type.includes('earbuds')) {
      // --- 3D TITANIUM EARBUDS (PULSE ANC) ---
      const caseGeo = new THREE.BoxGeometry(3.2, 2.0, 1.6);
      const caseMesh = new THREE.Mesh(caseGeo, primaryMat);
      caseMesh.position.set(0, -1.0, 0);
      caseMesh.castShadow = true;
      productGroup.add(caseMesh);

      const leftBudGeo = new THREE.SphereGeometry(0.65, 24, 24);
      const leftBud = new THREE.Mesh(leftBudGeo, chromeMat);
      leftBud.position.set(-1.0, 0.8, 0.2);
      productGroup.add(leftBud);

      const rightBud = new THREE.Mesh(leftBudGeo, chromeMat);
      rightBud.position.set(1.0, 0.8, 0.2);
      productGroup.add(rightBud);
    } else {
      // --- 3D AUDIOPHILE HEADPHONES (SPECTRE PRO) ---
      const headbandGeo = new THREE.TorusGeometry(3.4, 0.32, 16, 64, Math.PI);
      const headband = new THREE.Mesh(headbandGeo, darkMat);
      headband.position.set(0, 0.8, 0);
      headband.castShadow = true;
      productGroup.add(headband);

      const cushionGeo = new THREE.TorusGeometry(3.35, 0.16, 16, 64, Math.PI * 0.9);
      const cushion = new THREE.Mesh(cushionGeo, primaryMat);
      cushion.position.set(0, 0.78, 0);
      productGroup.add(cushion);

      const sliderGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16);
      const leftSlider = new THREE.Mesh(sliderGeo, chromeMat);
      leftSlider.position.set(-3.4, 0.2, 0);
      productGroup.add(leftSlider);

      const rightSlider = new THREE.Mesh(sliderGeo, chromeMat);
      rightSlider.position.set(3.4, 0.2, 0);
      productGroup.add(rightSlider);

      const cupGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.8, 48);
      const leftCup = new THREE.Mesh(cupGeo, primaryMat);
      leftCup.rotation.z = Math.PI / 2;
      leftCup.position.set(-3.5, -0.6, 0);
      leftCup.castShadow = true;
      productGroup.add(leftCup);

      const leftRimGeo = new THREE.TorusGeometry(1.55, 0.08, 16, 48);
      const leftRim = new THREE.Mesh(leftRimGeo, cyanGlowMat);
      leftRim.rotation.y = Math.PI / 2;
      leftRim.position.set(-3.85, -0.6, 0);
      productGroup.add(leftRim);

      const leftFoamGeo = new THREE.TorusGeometry(1.35, 0.38, 16, 32);
      const leftFoam = new THREE.Mesh(leftFoamGeo, darkMat);
      leftFoam.rotation.y = Math.PI / 2;
      leftFoam.position.set(-3.1, -0.6, 0);
      productGroup.add(leftFoam);

      const rightCup = new THREE.Mesh(cupGeo, primaryMat);
      rightCup.rotation.z = Math.PI / 2;
      rightCup.position.set(3.5, -0.6, 0);
      rightCup.castShadow = true;
      productGroup.add(rightCup);

      const rightRim = new THREE.Mesh(leftRimGeo, cyanGlowMat);
      rightRim.rotation.y = Math.PI / 2;
      rightRim.position.set(3.85, -0.6, 0);
      productGroup.add(rightRim);

      const rightFoam = new THREE.Mesh(leftFoamGeo, darkMat);
      rightFoam.rotation.y = Math.PI / 2;
      rightFoam.position.set(3.1, -0.6, 0);
      productGroup.add(rightFoam);
    }

    // 7. Animation Loop with smooth inertial drag
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.008;
      }

      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (productGroupRef.current) {
        productGroupRef.current.rotation.x = currentRotationRef.current.x;
        productGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x = Math.max(
        -0.8,
        Math.min(0.8, targetRotationRef.current.x + deltaY * 0.008)
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      targetRotationRef.current.y += deltaX * 0.012;
      targetRotationRef.current.x = Math.max(
        -0.8,
        Math.min(0.8, targetRotationRef.current.x + deltaY * 0.01)
      );
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [productType]);

  // Update Material Color in Real-Time
  useEffect(() => {
    if (materialsRef.current.length > 0) {
      materialsRef.current[0].color.set(selectedColor);
    }
  }, [selectedColor]);

  // Handle Zoom
  const handleZoom = (delta: number) => {
    const nextZoom = Math.max(0.7, Math.min(1.5, zoomLevel + delta));
    setZoomLevel(nextZoom);
    if (cameraRef.current) {
      cameraRef.current.position.z = 10.5 / nextZoom;
    }
  };

  return (
    <div
      className={`relative w-full h-[320px] md:h-[400px] rounded-2xl glass-panel overflow-hidden flex items-center justify-center select-none bg-[#07090E] border border-white/10 ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md text-xs font-semibold text-white shadow-lg shadow-indigo-500/10">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Three.js WebGL Engine</span>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag to orbit 360°</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
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
          onClick={() => handleZoom(0.15)}
          className="p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(-0.15)}
          className="p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
