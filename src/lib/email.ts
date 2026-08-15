type EmailOrder = { orderId: string; userEmail: string; userName?: string; total: number; items: { name: string; quantity: number }[] };

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]!));

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn('Email not sent: RESEND_API_KEY and EMAIL_FROM must be configured.');
    return false;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) {
    console.error('Email provider rejected request:', await response.text());
    return false;
  }
  return true;
}

const shell = (title: string, body: string) => `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#100d18;color:#fff;padding:32px;border-radius:18px"><h1 style="margin:0 0 20px;color:#d8b4fe">Meta<span style="color:#a855f7">Mart</span></h1><h2>${title}</h2>${body}<p style="margin:28px 0 0;color:#c4b5d6;font-size:13px">Thank you for shopping with MetaMart.</p></div>`;

export async function sendPurchaseEmail(order: EmailOrder) {
  const customer = escapeHtml(order.userName || 'there');
  const items = order.items.map(item => `<li>${escapeHtml(item.name)} × ${item.quantity}</li>`).join('');
  return sendEmail(order.userEmail, `Order confirmed — ${order.orderId}`, shell('Your order is confirmed', `<p>Hi ${customer}, we’ve received your payment and are preparing your order.</p><p><b>Order:</b> ${escapeHtml(order.orderId)}<br/><b>Total:</b> $${order.total.toFixed(2)}</p><ul>${items}</ul>`));
}

export async function sendDeliveryEmail(order: EmailOrder) {
  const customer = escapeHtml(order.userName || 'there');
  return sendEmail(order.userEmail, `Delivered — ${order.orderId}`, shell('Your order has been delivered', `<p>Hi ${customer}, your MetaMart order has been marked as delivered.</p><p><b>Order:</b> ${escapeHtml(order.orderId)}<br/><b>Total:</b> $${order.total.toFixed(2)}</p><p>We hope you love it.</p>`));
}
