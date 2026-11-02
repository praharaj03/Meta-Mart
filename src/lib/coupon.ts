import { connectDB } from '@/lib/db';
import { Coupon } from '@/models/Coupon';

type CouponValidation =
  | {
      valid: true;
      code: string;
      discountType: 'percent' | 'flat';
      discountValue: number;
      discount: number;
    }
  | { valid: false; error: string; status: number };

export async function validateCoupon(code: string, orderTotal: number): Promise<CouponValidation> {
  if (!code.trim()) return { valid: false, error: 'No code provided', status: 400 };
  if (!Number.isFinite(orderTotal) || orderTotal < 0) {
    return { valid: false, error: 'Invalid order total', status: 400 };
  }

  await connectDB();
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

  if (!coupon) return { valid: false, error: 'Invalid coupon code', status: 404 };
  if (coupon.active === false) return { valid: false, error: 'This coupon is no longer active', status: 400 };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'This coupon has expired', status: 400 };
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'This coupon has reached its usage limit', status: 400 };
  }
  if (coupon.minOrder > 0 && orderTotal < coupon.minOrder) {
    return { valid: false, error: `Minimum order of Rs. ${coupon.minOrder} required`, status: 400 };
  }

  const amount = coupon.discountType === 'percent'
    ? (orderTotal * coupon.discountValue) / 100
    : coupon.discountValue;
  const discount = Math.min(amount, orderTotal);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount: Number(discount.toFixed(2)),
  };
}
