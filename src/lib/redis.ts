import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!REDIS_URL) return null;
  if (!client) {
    client = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    client.on('error', () => { client = null; });
  }
  return client;
}
