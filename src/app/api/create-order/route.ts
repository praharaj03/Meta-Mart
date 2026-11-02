import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { BlockedUser } from '@/models/BlockedUser';
import { SHIPPING_FREE_THRESHOLD, STANDARD_SHIPPING } from '@/lib/currency';
import { validateCoupon } from '@/lib/coupon';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing');

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY.' }, { status: 503 });
  const { items, address, userEmail, userName, couponCode } = await req.json();

  const orderId = `ORD${Date.now()}`;
  const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * 0.08;
  const rawTotal = subtotal + shipping + tax;
  const coupon = typeof couponCode === 'string' && couponCode.trim()
    ? await validateCoupon(couponCode, rawTotal)
    : null;
  if (coupon && !coupon.valid) {
    return NextResponse.json({ error: coupon.error }, { status: coupon.status });
  }
  const discount = coupon?.valid ? coupon.discount : 0;
  const finalTotal = Number(Math.max(0, rawTotal - discount).toFixed(2));
  const addressStr = `${address.address}, ${address.city} - ${address.pincode}`;

  await connectDB();
  const isBlocked = await BlockedUser.exists({ email: userEmail.toLowerCase() });
  if (isBlocked) return NextResponse.json({ error: 'Your account has been blocked. Please contact support.' }, { status: 403 });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item: { name: string; price: number; quantity: number; image: string }) => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name, images: [item.image] },
        // Stripe accepts INR in paise; product prices are stored in rupees.
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }),
  );
  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Shipping' },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
  }
  if (tax > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Tax (8%)' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });
  }

  const stripeCoupon = coupon?.valid && discount > 0
    ? await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: 'inr',
        duration: 'once',
        name: `${coupon.code} discount`,
      })
    : null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    ...(stripeCoupon ? { discounts: [{ coupon: stripeCoupon.id }] } : {}),
    metadata: { orderId },
    success_url: `${req.headers.get('origin')}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/checkout`,
  });

  const order = await Order.create({
    orderId,
    userEmail,
    userName,
    items,
    total: finalTotal,
    couponCode: coupon?.valid ? coupon.code : undefined,
    couponDiscount: discount,
    address: addressStr,
    status: 'pending',
    stripeSessionId: session.id,
  });


  return NextResponse.json({ url: session.url });
}
