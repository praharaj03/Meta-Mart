import { getRedis } from './redis';
import { connectDB } from './db';
import { Product } from '@/models/Product';

const CACHE_KEY = 'products:all';
const TTL = 300; // 5 minutes

export async function getProducts(): Promise<any[]> {
  const redis = getRedis();

  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch { /* fall through to DB */ }
  }

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  if (redis) {
    try {
      await redis.set(CACHE_KEY, JSON.stringify(products), 'EX', TTL);
    } catch { /* non-fatal */ }
  }

  return products;
}

export async function invalidateProductCache(): Promise<void> {
  const redis = getRedis();
  if (redis) {
    try { await redis.del(CACHE_KEY); } catch { /* non-fatal */ }
  }
}
