import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { sendOrderStatusEmail } from '@/lib/email';
import { mailConfigurationError } from '@/lib/mailer';

export const runtime = 'nodejs';

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
    const configError = mailConfigurationError();
    if (configError) return NextResponse.json({ error: configError }, { status: 503 });
    // Block cancel if already delivered (createdAt + 5 days)
    const order = await Order.findOne({ orderId });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    const deliveredAt = new Date(order.createdAt);
    deliveredAt.setDate(deliveredAt.getDate() + 5);
    if (Date.now() >= deliveredAt.getTime()) return NextResponse.json({ error: 'Cannot cancel a delivered order' }, { status: 400 });
    if (['cancelled', 'return_requested'].includes(order.status)) return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    const updated = await Order.findOneAndUpdate({ orderId }, { status: 'cancelled', cancelReason }, { new: true });
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    const notificationSent = await sendOrderStatusEmail(updated, 'cancelled', cancelReason);
    return NextResponse.json({ success: true, notificationSent });
  }

  if (returnReason) {
    const configError = mailConfigurationError();
    if (configError) return NextResponse.json({ error: configError }, { status: 503 });
    const newStatus = returnType === 'replacement' ? 'replacement_requested' : 'return_requested';
    const updated = await Order.findOneAndUpdate({ orderId }, { status: newStatus, returnReason, returnType: returnType ?? 'refund', returnRequestedAt: new Date() }, { new: true });
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    const notificationSent = await sendOrderStatusEmail(updated, newStatus, returnReason);
    return NextResponse.json({ success: true, notificationSent });
  }

  return NextResponse.json({ error: 'Missing reason' }, { status: 400 });
}
