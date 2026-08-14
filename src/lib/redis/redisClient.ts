import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisInstance) return redisInstance;

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

  if (!redisUrl || redisUrl.startsWith('mock')) {
    return null;
  }

  try {
    redisInstance = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 3000,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redisInstance.on('error', (err) => {
      console.warn('[Redis] Connection issue, defaulting to memory engine:', err.message);
    });

    return redisInstance;
  } catch (error) {
    console.warn('[Redis] Initialization skipped, using in-memory engine.');
    return null;
  }
}
