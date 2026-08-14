// Server-only Redis client loader with safe browser boundary protection

let redisInstance: any = null;

export function getRedisClient(): any | null {
  // Never attempt to load Node socket/TLS packages in browser
  if (typeof window !== 'undefined') {
    return null;
  }

  if (redisInstance) return redisInstance;

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

  if (!redisUrl || redisUrl.startsWith('mock')) {
    return null;
  }

  try {
    // Dynamic import to prevent Webpack client bundle evaluation of 'tls' and 'net'
    const Redis = require('ioredis');
    redisInstance = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 3000,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redisInstance.on('error', (err: any) => {
      console.warn('[Redis] Connection notice (using in-memory engine):', err.message);
    });

    return redisInstance;
  } catch (error) {
    console.warn('[Redis] Native Redis module skipped, active in-memory engine.');
    return null;
  }
}
