export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
});

export const formatINR = (amount: number) => INR.format(Number(amount) || 0);
export const SHIPPING_FREE_THRESHOLD = 499;
export const STANDARD_SHIPPING = 99;
