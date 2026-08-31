import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
  await connectDB();
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json([]);
  const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const order = await Order.create(body);
  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const { orderId, cancelReason } = await req.json();
  if (!orderId || !cancelReason) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const order = await Order.findOneAndUpdate(
    { orderId, status: { $nin: ['delivered', 'cancelled'] } },
    { status: 'cancelled', cancelReason },
    { new: true }
  );
  if (!order) return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
  return NextResponse.json({ success: true });
}
