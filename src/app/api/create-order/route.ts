import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { items, address, userEmail, userName } = await req.json();

  const orderId = `ORD${Date.now()}`;
  const total = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const shipping = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;
  const addressStr = `${address.address}, ${address.city} - ${address.pincode}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map((item: { name: string; price: number; quantity: number; image: string }) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name, images: [item.image] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { orderId },
    success_url: `${req.headers.get('origin')}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/checkout`,
  });

  await connectDB();
  await Order.create({
    orderId,
    userEmail,
    userName,
    items,
    total: finalTotal,
    address: addressStr,
    status: 'confirmed',
    stripeSessionId: session.id,
  });

  return NextResponse.json({ url: session.url });
}
