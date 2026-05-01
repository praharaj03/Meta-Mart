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
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;
    await connectDB();
    const exists = await Order.findOne({ orderId: meta.orderId });
    if (!exists) {
      await Order.create({
        orderId: meta.orderId,
        userEmail: meta.userEmail,
        userName: meta.userName,
        items: JSON.parse(meta.items),
        total: parseFloat(meta.total),
        address: meta.address,
        status: 'confirmed',
        stripeSessionId: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
