import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose, { Schema, models } from 'mongoose';

const PushSubscription = models.PushSubscription || mongoose.model('PushSubscription', new Schema({ endpoint: { type: String, unique: true }, subscription: { type: Schema.Types.Mixed, required: true } }, { timestamps: true }));

export const runtime = 'nodejs';

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) return NextResponse.json({ error: 'Push notifications are not configured.' }, { status: 503 });
  return NextResponse.json({ publicKey });
}

export async function POST(req: NextRequest) {
  const subscription = await req.json();
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 });
  await connectDB();
  await PushSubscription.findOneAndUpdate({ endpoint: subscription.endpoint }, { endpoint: subscription.endpoint, subscription }, { upsert: true, new: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: 'Endpoint required.' }, { status: 400 });
  await connectDB();
  await PushSubscription.deleteOne({ endpoint });
  return NextResponse.json({ success: true });
}
