import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    event = secret
      ? stripe.webhooks.constructEvent(body, sig, secret)
      : (JSON.parse(body) as Stripe.Event);
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  await connectDB();
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (event.type === 'checkout.session.completed') {
    await Order.findOneAndUpdate({ orderId }, { status: 'confirmed', stripeSessionId: session.id });
  } else if (event.type === 'checkout.session.expired') {
    await Order.findOneAndUpdate({ orderId }, { status: 'cancelled' });
  }

  return NextResponse.json({ received: true });
}
