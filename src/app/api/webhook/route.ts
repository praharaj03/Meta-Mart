import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { sendDeliveryEmail, sendPurchaseEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing');

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    event = stripe.webhooks.constructEvent(body, sig, secret!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  await connectDB();
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (event.type === 'checkout.session.completed') {
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status: 'confirmed', stripeSessionId: session.id },
      { new: true },
    );
    if (order && !order.purchaseEmailSentAt) {
      const sent = await sendPurchaseEmail(order);
      if (sent) await Order.updateOne({ _id: order._id, purchaseEmailSentAt: { $exists: false } }, { purchaseEmailSentAt: new Date() });
    }
  } else if (event.type === 'checkout.session.expired') {
    await Order.findOneAndUpdate({ orderId }, { status: 'cancelled' });
  }

  return NextResponse.json({ received: true });
}
