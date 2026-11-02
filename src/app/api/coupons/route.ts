import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupon';

export async function POST(req: NextRequest) {
  const { code, orderTotal } = await req.json();
  const result = await validateCoupon(typeof code === 'string' ? code : '', orderTotal);
  if (!result.valid) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
