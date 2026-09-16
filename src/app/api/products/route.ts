import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/productCache';

export async function GET(req: NextRequest) {
  const products = await getProducts();
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit')) || products.length, 1), 100);
  const page = Math.max(Number(req.nextUrl.searchParams.get('page')) || 1, 1);
  const start = (page - 1) * limit;
  return NextResponse.json({ products: products.slice(start, start + limit), total: products.length, page, hasMore: start + limit < products.length });
}
