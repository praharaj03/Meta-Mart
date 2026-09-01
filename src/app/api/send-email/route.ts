import { NextRequest, NextResponse } from 'next/server';
import { sendMail, baseTemplate, detailsTable, infoBox, stepsList } from '@/lib/mailer';

function buildCancelHtml(name: string, orderId: string, reason: string, total: number) {
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>${name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">Your order has been successfully cancelled. Here's a summary:</p>
    ${detailsTable([
      ['Order ID', `#${orderId}`],
      ['Cancellation Reason', reason],
      ['Refund Amount', `&#8377;${total.toFixed(2)}`, '#7c3aed'],
    ])}
    ${infoBox('#f0fdf4', '#86efac', '#166534', '#15803d', '&#128176; Refund Initiated', `&#8377;${total.toFixed(2)} will be credited to your original payment method within <strong>24 hours</strong>.`)}
    <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Questions? We're here to help:</p>
    <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:#7c3aed;font-size:13px;font-weight:600;text-decoration:none;">devopspraharaj25@gmail.com</a></p>`;
  return baseTemplate('linear-gradient(135deg,#1a0a2e 0%,#3b1a6b 100%)', '&#10060;', 'Order Cancelled', "We've received your cancellation request", body);
}

function buildReturnHtml(name: string, orderId: string, type: string, reason: string, total: number) {
  const isReplacement = type === 'replacement';
  const accent = isReplacement ? '#3b82f6' : '#d97706';
  const headerBg = isReplacement ? 'linear-gradient(135deg,#0c1a3a 0%,#1e3a8a 100%)' : 'linear-gradient(135deg,#1c1107 0%,#78350f 100%)';
  const steps = isReplacement
    ? ['Pickup scheduled within 24 hours', 'Our team collects the item from your address', 'Item inspected by our quality team', 'Replacement dispatched within 2–3 business days']
    : ['Pickup scheduled within 24 hours', 'Our team collects the item from your address', 'Item inspected by our quality team', `Refund of &#8377;${total.toFixed(2)} credited within 24 hours of pickup`];
  const rows: [string, string, string?][] = [
    ['Order ID', `#${orderId}`],
    ['Request Type', isReplacement ? 'Replacement' : 'Refund', accent],
    ['Reason', reason],
  ];
  if (!isReplacement) rows.push(['Refund Amount', `&#8377;${total.toFixed(2)}`, accent]);
  const timeline = isReplacement
    ? 'Your replacement will be dispatched within 2–3 business days after item pickup.'
    : `&#8377;${total.toFixed(2)} will be credited to your original payment method within <strong>24 hours</strong> of item pickup.`;
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>${name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;line-height:1.6;">We've received your ${isReplacement ? 'replacement' : 'return & refund'} request. Here's what happens next:</p>
    ${stepsList(steps, accent)}
    ${detailsTable(rows)}
    ${infoBox('#f0fdf4', '#86efac', '#166534', '#15803d', `&#128176; ${isReplacement ? 'Replacement' : 'Refund'} Timeline`, timeline)}
    <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Questions? We're here to help:</p>
    <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:${accent};font-size:13px;font-weight:600;text-decoration:none;">devopspraharaj25@gmail.com</a></p>`;
  return baseTemplate(
    headerBg,
    '&#128260;',
    isReplacement ? 'Replacement Requested' : 'Return Request Received',
    isReplacement ? "We'll send a replacement once we receive your item" : "We'll arrange a pickup at your earliest convenience",
    body
  );
}

export async function POST(req: NextRequest) {
  try {
    const { type, to_email, to_name, order_id, reason, return_type, total } = await req.json();

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    let subject = '';
    let html = '';

    if (type === 'cancel') {
      subject = `Order Cancelled — #${order_id} | MetaMart`;
      html = buildCancelHtml(to_name, order_id, reason, total);
    } else if (type === 'return') {
      subject = return_type === 'replacement'
        ? `Replacement Requested — #${order_id} | MetaMart`
        : `Return Request Received — #${order_id} | MetaMart`;
      html = buildReturnHtml(to_name, order_id, return_type, reason, total);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const ok = await sendMail(to_email, subject, html);
    if (!ok) return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[send-email]', err?.message);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
