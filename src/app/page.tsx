'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FlashSaleBanner from '@/components/FlashSaleBanner';
import HeroSection from '@/components/HeroSection';
import ProductCatalog from '@/components/ProductCatalog';
import ProductDetailModal from '@/components/ProductDetailModal';
import AIVisualSearchModal from '@/components/AIVisualSearchModal';
import AIConciergePalette from '@/components/AIConciergePalette';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import AdminDashboard from '@/components/AdminDashboard';
import AuthModal, { UserSession } from '@/components/AuthModal';
import UserAccountModal from '@/components/UserAccountModal';
import { INITIAL_PRODUCTS } from '@/lib/data/mockCatalog';
import {
  Product,
  ProductCategory,
  ProductVariant,
  CartItem,
  DiscountCoupon,
  OrderRecord,
  ReviewItem,
} from '@/types';

export default function SwiftShelfApp() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');

  // Authentication State (Default: Guest / Not Logged In, so Sign In is clearly visible)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'ord_init_01',
      orderNumber: 'SWIFT-948201',
      customerName: 'Alex Rivera',
      customerEmail: 'alex.rivera@techluxury.io',
      shippingAddress: {
        street: '500 Howard Street, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA',
      },
      items: [
        {
          productId: 'prod_01_spectre_pro',
          title: 'Spectre Pro ANC Headphones',
          variantName: 'Obsidian Black',
          quantity: 1,
          unitPrice: 389.0,
          totalPrice: 389.0,
        },
      ],
      subtotal: 389.0,
      discountAmount: 0,
      taxAmount: 31.12,
      shippingAmount: 0,
      total: 420.12,
      status: 'DELIVERED',
      paymentIntentId: 'pi_3PjX82Kl9',
      idempotencyKey: 'idemp_init_82910384',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'ord_init_02',
      orderNumber: 'SWIFT-651930',
      customerName: 'Elena Rostova',
      customerEmail: 'elena.rostova@techvanguard.ch',
      shippingAddress: {
        street: '88 Alpine Blvd',
        city: 'Geneva',
        state: 'GE',
        zip: '1201',
        country: 'Switzerland',
      },
      items: [
        {
          productId: 'prod_02_aurora_watch',
          title: 'Aura Horizon Titan Smartwatch',
          variantName: 'Raw Titanium',
          quantity: 1,
          unitPrice: 499.0,
          totalPrice: 499.0,
        },
      ],
      subtotal: 499.0,
      discountAmount: 49.9,
      taxAmount: 35.92,
      shippingAmount: 0,
      total: 485.02,
      status: 'PAID',
      paymentIntentId: 'pi_3PjY99Zx1',
      idempotencyKey: 'idemp_init_91048291',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ]);

  // Restore saved login session (Remember Me check)
  useEffect(() => {
    try {
      const savedLocal = localStorage.getItem('swiftshelf_user_session');
      const savedSession = sessionStorage.getItem('swiftshelf_user_session');
      if (savedLocal) {
        setCurrentUser(JSON.parse(savedLocal));
      } else if (savedSession) {
        setCurrentUser(JSON.parse(savedSession));
      }
    } catch (err) {
      console.warn('Session restoration error:', err);
    }
  }, []);

  // Global Cmd+K Keyboard Shortcut for AI Concierge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAIConciergeOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Stock Reservation Handler (Add to Cart with 2-Phase Concurrency Lock)
  const handleAddToCart = async (product: Product, variant: ProductVariant) => {
    let reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let expiresAt = Date.now() + 600 * 1000;

    try {
      const res = await fetch('/api/inventory/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reservationId) reservationId = data.reservationId;
        if (data.expiresAt) expiresAt = data.expiresAt;
      }
    } catch (e) {
      // Safe fallback
    }

    // Decrement visual local stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return {
            ...p,
            stock: Math.max(0, p.stock - 1),
            reservedStock: p.reservedStock + 1,
          };
        }
        return p;
      })
    );

    // Update cart
    setCartItems((prev) => {
      const existing = prev.find(
        (it) => it.productId === product.id && it.variantId === variant.id
      );
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id && it.variantId === variant.id
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant.id,
            title: product.title,
            variantName: variant.name,
            price: product.price + variant.priceDelta,
            quantity: 1,
            image: product.images[0],
            reservationId,
            reservedUntil: expiresAt,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, variantId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((it) => {
          if (it.productId === productId && it.variantId === variantId) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = async (productId: string, variantId: string) => {
    const item = cartItems.find((it) => it.productId === productId && it.variantId === variantId);
    if (item?.reservationId) {
      try {
        await fetch('/api/inventory/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId: item.reservationId }),
        });
      } catch (e) {
        // Safe fallback
      }
    }

    setCartItems((prev) =>
      prev.filter((it) => !(it.productId === productId && it.variantId === variantId))
    );

    // Restore local visual stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: p.stock + (item?.quantity || 1),
            reservedStock: Math.max(0, p.reservedStock - (item?.quantity || 1)),
          };
        }
        return p;
      })
    );
  };

  // Coupon Engine
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.toUpperCase();
    if (clean === 'VIP20') {
      setAppliedCoupon({
        code: 'VIP20',
        type: 'PERCENTAGE',
        value: 20,
        expiry: '2026-12-31',
      });
      return true;
    } else if (clean === 'SWIFT50') {
      setAppliedCoupon({
        code: 'SWIFT50',
        type: 'FIXED',
        value: 50,
        expiry: '2026-12-31',
      });
      return true;
    }
    return false;
  };

  // Add Review
  const handleAddReview = (productId: string, newReview: ReviewItem) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvg = (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(2);
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Number(newAvg),
          };
        }
        return p;
      })
    );
  };

  // Order Finalization
  const handleOrderSuccess = (newOrder: OrderRecord) => {
    const orderWithUser: OrderRecord = {
      ...newOrder,
      customerName: currentUser?.name || newOrder.customerName,
      customerEmail: currentUser?.email || newOrder.customerEmail,
    };

    setOrders((prev) => [orderWithUser, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    alert(`🎉 Order ${orderWithUser.orderNumber} placed! You can view invoices in Account or Admin BI.`);
  };

  const flagshipProduct = products[0];

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F8FAFC] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Floating Header with User Auth & Login Button */}
      <Navbar
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenAIConcierge={() => setIsAIConciergeOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onToggleView={setCurrentView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <>
            {/* Live Flash Sale Concurrency Ticker */}
            <FlashSaleBanner
              flashProduct={flagshipProduct}
              onQuickReserve={(p) => handleAddToCart(p, p.variants[0])}
            />

            {/* Hero Section with Interactive 3D Showcase */}
            <HeroSection
              flagshipProduct={flagshipProduct}
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onQuickReserve={(p) => handleAddToCart(p, p.variants[0])}
              onOpenInspectModal={(p) => setInspectProduct(p)}
            />

            {/* Faceted Catalog & Product Grid */}
            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              onInspect={(p) => setInspectProduct(p)}
            />
          </>
        ) : (
          /* Enterprise BI Dashboard */
          <AdminDashboard
            orders={orders}
            products={products}
            onBackToStore={() => setCurrentView('store')}
          />
        )}
      </main>

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user, remember) => {
          setCurrentUser(user);
          try {
            if (remember) {
              localStorage.setItem('swiftshelf_user_session', JSON.stringify(user));
              sessionStorage.removeItem('swiftshelf_user_session');
            } else {
              sessionStorage.setItem('swiftshelf_user_session', JSON.stringify(user));
              localStorage.removeItem('swiftshelf_user_session');
            }
          } catch (err) {
            console.warn('Could not save session:', err);
          }
          if (user.role === 'ADMIN') {
            setCurrentView('admin');
          }
        }}
      />

      {/* User Account Profile & Past Orders Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={currentUser}
        orders={orders}
        onLogout={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('swiftshelf_user_session');
            sessionStorage.removeItem('swiftshelf_user_session');
          } catch (err) {}
        }}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Product Detail Inspect Modal */}
      <ProductDetailModal
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
      />

      {/* AI Visual Search Modal */}
      <AIVisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onSelectProduct={(p) => setInspectProduct(p)}
      />

      {/* AI Concierge Palette (Cmd+K) */}
      <AIConciergePalette
        isOpen={isAIConciergeOpen}
        onClose={() => setIsAIConciergeOpen(false)}
        onSelectProduct={(p) => setInspectProduct(p)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={() => setAppliedCoupon(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

    </div>
  );
}
