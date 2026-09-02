import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export function baseTemplate(headerBg: string, icon: string, title: string, subtitle: string, body: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">
  <tr><td style="background:${headerBg};padding:40px 40px 32px;text-align:center;">
    <div style="font-size:44px;margin-bottom:14px;line-height:1;">${icon}</div>
    <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 8px;letter-spacing:-0.3px;">${title}</h1>
    <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">${subtitle}</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">${body}</td></tr>
  <tr><td style="background:#f8f8fb;border-top:1px solid #e8e8f0;padding:20px 40px;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">&#169; ${new Date().getFullYear()} MetaMart. All rights reserved.</p>
    <p style="color:#c4c4d0;font-size:11px;margin:0;">This is an automated email — please do not reply directly.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function detailsTable(rows: [string, string, string?][]) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fb;border:1px solid #e8e8f0;border-radius:12px;margin-bottom:24px;">
    ${rows.map(([label, value, color]) => `
    <tr>
      <td style="padding:10px 20px;color:#6b7280;font-size:13px;border-bottom:1px solid #f0f0f5;">${label}</td>
      <td style="padding:10px 20px;color:${color || '#111827'};font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #f0f0f5;">${value}</td>
    </tr>`).join('')}
  </table>`;
}

export function infoBox(bg: string, border: string, titleColor: string, textColor: string, title: string, text: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:10px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      <p style="color:${titleColor};font-size:14px;font-weight:700;margin:0 0 4px;">${title}</p>
      <p style="color:${textColor};font-size:13px;margin:0;line-height:1.6;">${text}</p>
    </td></tr>
  </table>`;
}

export function itemsTable(items: { name: string; quantity: number; price: number }[]) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fb;border:1px solid #e8e8f0;border-radius:12px;margin-bottom:24px;">
    <tr>
      <td style="padding:10px 20px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e8e8f0;">Item</td>
      <td style="padding:10px 20px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;text-align:center;border-bottom:1px solid #e8e8f0;">Qty</td>
      <td style="padding:10px 20px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;text-align:right;border-bottom:1px solid #e8e8f0;">Price</td>
    </tr>
    ${items.map(item => `
    <tr>
      <td style="padding:10px 20px;color:#374151;font-size:13px;border-bottom:1px solid #f0f0f5;">${item.name}</td>
      <td style="padding:10px 20px;color:#6b7280;font-size:13px;text-align:center;border-bottom:1px solid #f0f0f5;">&#215;${item.quantity}</td>
      <td style="padding:10px 20px;color:#7c3aed;font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #f0f0f5;">rs ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('')}
  </table>`;
}

export function stepsList(steps: string[], accent: string) {
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

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[sendMail] RESEND_API_KEY not set');
    return false;
  }
  try {
    const { error } = await getResend().emails.send({
      from: 'MetaMart <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    if (error) { console.error('[sendMail]', error); return false; }
    return true;
  } catch (err: any) {
    console.error('[sendMail]', err?.message);
    return false;
  }
}
