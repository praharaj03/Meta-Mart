import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function baseTemplate(headerBg: string, icon: string, title: string, subtitle: string, body: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">
  <!-- Header -->
  <tr><td style="background:${headerBg};padding:40px 40px 32px;text-align:center;">
    <div style="font-size:44px;margin-bottom:14px;line-height:1;">${icon}</div>
    <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 8px;letter-spacing:-0.3px;">${title}</h1>
    <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">${subtitle}</p>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:36px 40px;">${body}</td></tr>
  <!-- Footer -->
  <tr><td style="background:#f8f8fb;border-top:1px solid #e8e8f0;padding:20px 40px;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">© ${new Date().getFullYear()} MetaMart. All rights reserved.</p>
    <p style="color:#c4c4d0;font-size:11px;margin:0;">This is an automated email — please do not reply directly.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function detailsTable(rows: [string, string, string?][]) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fb;border:1px solid #e8e8f0;border-radius:12px;margin-bottom:24px;">
    ${rows.map(([label, value, color]) => `
    <tr>
      <td style="padding:10px 20px;color:#6b7280;font-size:13px;border-bottom:1px solid #f0f0f5;">${label}</td>
      <td style="padding:10px 20px;color:${color || '#111827'};font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #f0f0f5;">${value}</td>
    </tr>`).join('')}
  </table>`;
}

function infoBox(bg: string, border: string, titleColor: string, textColor: string, title: string, text: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:10px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      <p style="color:${titleColor};font-size:14px;font-weight:700;margin:0 0 4px;">${title}</p>
      <p style="color:${textColor};font-size:13px;margin:0;line-height:1.6;">${text}</p>
    </td></tr>
  </table>`;
}

function stepsList(steps: string[], accent: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    ${steps.map((s, i) => `
    <tr>
      <td width="36" valign="top" style="padding:0 12px 14px 0;">
        <div style="width:28px;height:28px;border-radius:50%;background:${accent};color:white;font-size:12px;font-weight:800;text-align:center;line-height:28px;">${i + 1}</div>
      </td>
      <td style="padding:4px 0 14px;color:#374151;font-size:14px;line-height:1.5;">${s}</td>
    </tr>`).join('')}
  </table>`;
}

function buildCancelHtml(name: string, orderId: string, reason: string, total: number) {
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>${name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">Your order has been successfully cancelled. Here's a summary of your cancellation:</p>
    ${detailsTable([
      ['Order ID', `#${orderId}`],
      ['Cancellation Reason', reason],
      ['Refund Amount', `&#8377;${total.toFixed(2)}`, '#7c3aed'],
    ])}
    ${infoBox('#f0fdf4', '#86efac', '#166534', '#15803d', '&#128176; Refund Initiated', `&#8377;${total.toFixed(2)} will be credited to your original payment method within <strong>24 hours</strong>.`)}
    <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Questions? We're here to help:</p>
    <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:#7c3aed;font-size:13px;font-weight:600;text-decoration:none;">devopspraharaj25@gmail.com</a></p>`;
  return baseTemplate(
    'linear-gradient(135deg,#1a0a2e 0%,#3b1a6b 100%)',
    '&#10060;', 'Order Cancelled', "We've received your cancellation request", body
  );
}

function buildReturnHtml(name: string, orderId: string, type: string, reason: string, total: number) {
  const isReplacement = type === 'replacement';
  const accent = isReplacement ? '#3b82f6' : '#d97706';
  const headerBg = isReplacement
    ? 'linear-gradient(135deg,#0c1a3a 0%,#1e3a8a 100%)'
    : 'linear-gradient(135deg,#1c1107 0%,#78350f 100%)';
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
    isReplacement ? '&#128260;' : '&#128260;',
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

    await transporter.sendMail({
      from: `"MetaMart" <${process.env.GMAIL_USER}>`,
      to: to_email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[send-email]', err?.message);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
