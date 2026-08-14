export type ProductCategory = 
  | 'Audio' 
  | 'Wearables' 
  | 'Computing' 
  | 'Ergonomics' 
  | 'Accessories' 
  | 'Smart Living';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  colorName: string;
  colorHex: string;
  priceDelta: number;
  stock: number;
  reservedStock: number;
  model3DTexture?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
}

export interface AIReviewSummary {
  pros: string[];
  cons: string[];
  sentimentScore: number; // 0 to 100
  fitRecommendation: string;
  summaryText: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  images: string[];
  model3dUrl?: string;
  badge?: 'FLASH SALE' | 'NEW RELEASE' | 'BESTSELLER' | 'LIMITED EDITION';
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  stock: number;
  reservedStock: number;
  tags: string[];
  features: string[];
  specs: Record<string, string>;
  variants: ProductVariant[];
  reviews: ReviewItem[];
  aiSummary?: AIReviewSummary;
  vectorEmbedding?: number[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
  reservationId?: string;
  reservedUntil?: number; // timestamp
}

export interface DiscountCoupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  expiry: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    productId: string;
    title: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  status: 'PENDING' | 'RESERVED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentIntentId?: string;
  idempotencyKey: string;
  createdAt: string;
  dispatchedAt?: string;
}

export interface StockReservationResult {
  success: boolean;
  reservationId?: string;
  productId: string;
  variantId: string;
  quantity: number;
  expiresAt?: number;
  error?: string;
}

export interface AdminAnalyticsKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeFlashSales: number;
  totalInventoryCount: number;
  stockReservationRate: number;
  cartAbandonmentRate: number;
  recentOrders: OrderRecord[];
  salesByDay: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: string; title: string; unitsSold: number; revenue: number }>;
}
