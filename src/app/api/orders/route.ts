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
  const { orderId, cancelReason, returnReason } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

  if (cancelReason) {
    const order = await Order.findOneAndUpdate(
      { orderId, status: { $nin: ['delivered', 'cancelled'] } },
      { status: 'cancelled', cancelReason },
      { new: true }
    );
    if (!order) return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (returnReason) {
    const order = await Order.findOne({ orderId, status: 'delivered' });
    if (!order) return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
    // Check 7-day window from delivery (delivery = createdAt + 5 days)
    const deliveredAt = new Date(order.createdAt);
    deliveredAt.setDate(deliveredAt.getDate() + 5);
    const daysSinceDelivery = (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 7) return NextResponse.json({ error: 'Return window has expired (7 days)' }, { status: 400 });
    await Order.findOneAndUpdate({ orderId }, { status: 'return_requested', returnReason, returnRequestedAt: new Date() });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Missing reason' }, { status: 400 });
}
