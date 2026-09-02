import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Coupon } from '@/models/Coupon';

export async function POST(req: NextRequest) {
  const { code, orderTotal } = await req.json();
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  await connectDB();
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

  if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
  if (coupon.active === false) return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
  if (coupon.minOrder > 0 && orderTotal < coupon.minOrder) return NextResponse.json({ error: `Minimum order of Rs. ${coupon.minOrder} required` }, { status: 400 });

  const discount = coupon.discountType === 'percent'
    ? Math.min((orderTotal * coupon.discountValue) / 100, orderTotal)
    : Math.min(coupon.discountValue, orderTotal);

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount: parseFloat(discount.toFixed(2)),
  });
}
