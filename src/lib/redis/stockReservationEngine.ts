import { getRedisClient } from './redisClient';
import { StockReservationResult } from '@/types';

// In-Memory fallback store with strict concurrency simulation
interface MemoryStockItem {
  totalStock: number;
  reservedStock: number;
}

interface MemoryReservation {
  id: string;
  stockKey: string;
  quantity: number;
  userId: string;
  expiresAt: number;
}

const memoryStockStore = new Map<string, MemoryStockItem>();
const memoryReservations = new Map<string, MemoryReservation>();

// Periodic cleanup of expired in-memory locks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [resId, res] of memoryReservations.entries()) {
      if (res.expiresAt <= now) {
        // Release expired stock
        const stockItem = memoryStockStore.get(res.stockKey);
        if (stockItem) {
          stockItem.reservedStock = Math.max(0, stockItem.reservedStock - res.quantity);
        }
        memoryReservations.delete(resId);
        console.log(`[Stock Engine] Expired reservation ${resId} released back to inventory.`);
      }
    }
  }, 10000);
}

export class StockReservationEngine {
  private static getStockKey(productId: string, variantId?: string): string {
    return `stock:${productId}:${variantId || 'default'}`;
  }

  public static initializeStock(productId: string, variantId: string, initialTotal: number) {
    const key = this.getStockKey(productId, variantId);
    if (!memoryStockStore.has(key)) {
      memoryStockStore.set(key, { totalStock: initialTotal, reservedStock: 0 });
    }
  }

  /**
   * Phase 1: Atomic Stock Reservation with TTL (Default 10 mins = 600s)
   */
  public static async reserveStock(
    productId: string,
    variantId: string,
    quantity: number,
    userId: string = 'anonymous',
    ttlSeconds: number = 600
  ): Promise<StockReservationResult> {
    const stockKey = this.getStockKey(productId, variantId);
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    const redis = getRedisClient();

    if (redis && redis.status === 'ready') {
      try {
        const luaScript = `
          local stock_key = KEYS[1]
          local res_key = KEYS[2]
          local req_qty = tonumber(ARGV[1])
          local ttl = tonumber(ARGV[2])
          local uid = ARGV[3]

          local total = tonumber(redis.call('HGET', stock_key, 'total_stock') or 50)
          local reserved = tonumber(redis.call('HGET', stock_key, 'reserved_stock') or 0)
          local available = total - reserved

          if available >= req_qty then
            redis.call('HINCRBY', stock_key, 'reserved_stock', req_qty)
            redis.call('HMSET', res_key, 'quantity', req_qty, 'user_id', uid, 'stock_key', stock_key)
            redis.call('EXPIRE', res_key, ttl)
            return {1, available - req_qty}
          else
            return {0, available}
          end
        `;

        const result = (await redis.eval(
          luaScript,
          2,
          stockKey,
          `reservation:${reservationId}`,
          quantity,
          ttlSeconds,
          userId
        )) as [number, number];

        if (result[0] === 1) {
          return {
            success: true,
            reservationId,
            productId,
            variantId,
            quantity,
            expiresAt,
          };
        } else {
          return {
            success: false,
            productId,
            variantId,
            quantity,
            error: `Only ${result[1]} units remaining in stock.`,
          };
        }
      } catch (err) {
        console.warn('[Redis] Lua execution fallback to memory engine:', err);
      }
    }

    // High-performance atomic In-Memory fallback
    let stockItem = memoryStockStore.get(stockKey);
    if (!stockItem) {
      stockItem = { totalStock: 45, reservedStock: 0 };
      memoryStockStore.set(stockKey, stockItem);
    }

    const available = stockItem.totalStock - stockItem.reservedStock;
    if (available >= quantity) {
      stockItem.reservedStock += quantity;
      memoryReservations.set(reservationId, {
        id: reservationId,
        stockKey,
        quantity,
        userId,
        expiresAt,
      });

      return {
        success: true,
        reservationId,
        productId,
        variantId,
        quantity,
        expiresAt,
      };
    } else {
      return {
        success: false,
        productId,
        variantId,
        quantity,
        error: `Insufficient inventory. Available: ${available}`,
      };
    }
  }

  /**
   * Phase 2: Commit Reservation upon Successful Checkout
   */
  public static async commitReservation(reservationId: string): Promise<boolean> {
    const redis = getRedisClient();

    if (redis && redis.status === 'ready') {
      try {
        const resKey = `reservation:${reservationId}`;
        const data = await redis.hgetall(resKey);
        if (data && data.stock_key) {
          const qty = parseInt(data.quantity || '0', 10);
          await redis.hincrby(data.stock_key, 'total_stock', -qty);
          await redis.hincrby(data.stock_key, 'reserved_stock', -qty);
          await redis.del(resKey);
          return true;
        }
      } catch (err) {
        console.warn('[Redis] Commit fallback to memory:', err);
      }
    }

    const res = memoryReservations.get(reservationId);
    if (res) {
      const stockItem = memoryStockStore.get(res.stockKey);
      if (stockItem) {
        stockItem.totalStock = Math.max(0, stockItem.totalStock - res.quantity);
        stockItem.reservedStock = Math.max(0, stockItem.reservedStock - res.quantity);
      }
      memoryReservations.delete(reservationId);
      return true;
    }
    return false;
  }

  /**
   * Cancel / Release Stock Reservation
   */
  public static async releaseReservation(reservationId: string): Promise<boolean> {
    const redis = getRedisClient();

    if (redis && redis.status === 'ready') {
      try {
        const resKey = `reservation:${reservationId}`;
        const data = await redis.hgetall(resKey);
        if (data && data.stock_key) {
          const qty = parseInt(data.quantity || '0', 10);
          await redis.hincrby(data.stock_key, 'reserved_stock', -qty);
          await redis.del(resKey);
          return true;
        }
      } catch (err) {
        console.warn('[Redis] Release fallback to memory:', err);
      }
    }

    const res = memoryReservations.get(reservationId);
    if (res) {
      const stockItem = memoryStockStore.get(res.stockKey);
      if (stockItem) {
        stockItem.reservedStock = Math.max(0, stockItem.reservedStock - res.quantity);
      }
      memoryReservations.delete(reservationId);
      return true;
    }
    return false;
  }

  /**
   * Get Real-time available stock count
   */
  public static getStockCount(productId: string, variantId?: string): { total: number; reserved: number; available: number } {
    const key = this.getStockKey(productId, variantId);
    const item = memoryStockStore.get(key) || { totalStock: 35, reservedStock: 0 };
    return {
      total: item.totalStock,
      reserved: item.reservedStock,
      available: Math.max(0, item.totalStock - item.reservedStock),
    };
  }
}
