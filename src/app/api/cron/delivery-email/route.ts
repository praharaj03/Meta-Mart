import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { sendDeliveryEmail } from '@/lib/email';

// Called by Vercel Cron — secured by CRON_SECRET
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // Find confirmed orders placed 5+ days ago with no delivery email sent yet
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const orders = await Order.find({
    status: { $nin: ['cancelled', 'return_requested', 'replacement_requested'] },
    deliveryEmailSentAt: { $exists: false },
    createdAt: { $lte: fiveDaysAgo },
  }).limit(50);

  let sent = 0;
  for (const order of orders) {
    const ok = await sendDeliveryEmail({
      orderId: order.orderId,
      userEmail: order.userEmail,
      userName: order.userName,
      total: order.total,
      items: order.items,
    });
    if (ok) {
      await Order.updateOne({ _id: order._id }, { deliveryEmailSentAt: new Date() });
      sent++;
    }
  }

  return NextResponse.json({ processed: orders.length, sent });
}
