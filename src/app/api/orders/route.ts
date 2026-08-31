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
  const { orderId, cancelReason, returnReason, returnType } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

  if (cancelReason) {
    // Block cancel if already delivered (createdAt + 5 days)
    const order = await Order.findOne({ orderId });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    const deliveredAt = new Date(order.createdAt);
    deliveredAt.setDate(deliveredAt.getDate() + 5);
    if (Date.now() >= deliveredAt.getTime()) return NextResponse.json({ error: 'Cannot cancel a delivered order' }, { status: 400 });
    if (['cancelled', 'return_requested'].includes(order.status)) return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    await Order.findOneAndUpdate({ orderId }, { status: 'cancelled', cancelReason });
    return NextResponse.json({ success: true });
  }

  if (returnReason) {
    const newStatus = returnType === 'replacement' ? 'replacement_requested' : 'return_requested';
    await Order.findOneAndUpdate({ orderId }, { status: newStatus, returnReason, returnType: returnType ?? 'refund', returnRequestedAt: new Date() });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Missing reason' }, { status: 400 });
}
