import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import mongoose, { Schema, models } from 'mongoose';

const PushSubscription = models.PushSubscription || mongoose.model('PushSubscription', new Schema({ endpoint: { type: String, unique: true }, subscription: { type: Schema.Types.Mixed, required: true }, userId: { type: String, index: true } }, { timestamps: true }));

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: 'Endpoint required.' }, { status: 400 });
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to manage notifications.' }, { status: 401 });
  await connectDB();
  await PushSubscription.deleteOne({ endpoint, userId });
  return NextResponse.json({ success: true });
}
