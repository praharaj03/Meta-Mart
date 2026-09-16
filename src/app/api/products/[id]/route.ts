import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import mongoose from 'mongoose';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 }).lean();
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : product.rating;
  return NextResponse.json({ product: { ...product, images: product.images?.length ? product.images : [product.image], rating, reviews: reviews.length || product.reviews }, reviews });
}
