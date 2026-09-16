import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Review } from '@/models/Review';

export async function POST(req: NextRequest) {
  const { productId, orderId, customerEmail, customerName, rating, comment } = await req.json();
  if (!productId || !orderId || !customerEmail || !comment || !Number.isFinite(Number(rating))) {
    return NextResponse.json({ error: 'Please complete all review fields.' }, { status: 400 });
  }
  await connectDB();
  const order = await Order.findOne({ orderId, userEmail: customerEmail, status: { $in: ['confirmed', 'delivered'] }, 'items.id': productId }).lean();
  if (!order) return NextResponse.json({ error: 'Only customers who purchased this item can leave feedback.' }, { status: 403 });
  try {
    const review = await Review.create({ productId, orderId, customerEmail, customerName, rating: Number(rating), comment: comment.trim() });
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return NextResponse.json({ error: 'You have already reviewed this purchase.' }, { status: 409 });
    return NextResponse.json({ error: 'Unable to save feedback.' }, { status: 500 });
  }
}
