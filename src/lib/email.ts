import { sendMail, baseTemplate, detailsTable, infoBox, itemsTable, stepsList } from './mailer';

type OrderItem = { name: string; quantity: number; price: number };
type EmailOrder = {
  orderId: string;
  userEmail: string;
  userName?: string;
  total: number;
  address?: string;
  items: OrderItem[];
};

function getArrival() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export async function sendPurchaseEmail(order: EmailOrder) {
  const name = order.userName || 'there';
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>${name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">
      Thank you for your order! We've received your payment and are preparing your items for dispatch.
    </p>
    ${detailsTable([
      ['Order ID', `#${order.orderId}`],
      ['Order Date', new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })],
      ['Estimated Delivery', getArrival()],
      ['Order Total', `&#8377;${order.total.toFixed(2)}`, '#7c3aed'],
    ])}
    ${itemsTable(order.items)}
    ${order.address ? infoBox('#f5f3ff', '#c4b5fd', '#5b21b6', '#6d28d9', '&#128205; Delivery Address', order.address) : ''}
    ${stepsList([
      'Order confirmed &amp; payment received',
      'Items being packed by our team',
      'Shipped &amp; out for delivery',
      `Estimated delivery by <strong>${getArrival()}</strong>`,
    ], '#7c3aed')}
    ${infoBox('#f0fdf4', '#86efac', '#166534', '#15803d', '&#128230; Track Your Order', 'You can track your order status anytime on the <a href="https://meta-mart-sable.vercel.app/orders" style="color:#16a34a;font-weight:600;">Orders page</a>.')}
    <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Questions? We\'re here to help:</p>
    <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:#7c3aed;font-size:13px;font-weight:600;text-decoration:none;">devopspraharaj25@gmail.com</a></p>
  `;

  const html = baseTemplate(
    'linear-gradient(135deg,#1a0a2e 0%,#4c1d95 100%)',
    '&#127881;',
    'Order Confirmed!',
    `Order #${order.orderId} is being prepared`,
    body
  );

  return sendMail(order.userEmail, `Order Confirmed — #${order.orderId} | MetaMart`, html);
}

export async function sendDeliveryEmail(order: EmailOrder) {
  const name = order.userName || 'there';
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>${name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">
      Great news! Your MetaMart order has been successfully delivered. We hope you love your purchase!
    </p>
    ${detailsTable([
      ['Order ID', `#${order.orderId}`],
      ['Delivered On', new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
      ['Order Total', `&#8377;${order.total.toFixed(2)}`, '#059669'],
    ])}
    ${itemsTable(order.items)}
    ${infoBox('#f0fdf4', '#86efac', '#166534', '#15803d', '&#9989; Delivery Complete', 'Your order has been marked as delivered. If you have any issues with your items, you can request a return within <strong>7 days</strong> from the Orders page.')}
    ${infoBox('#fffbeb', '#fcd34d', '#92400e', '#b45309', '&#128260; Not satisfied?', 'You have <strong>7 days</strong> from delivery to request a return or replacement. Visit your <a href="https://meta-mart-sable.vercel.app/orders" style="color:#d97706;font-weight:600;">Orders page</a> to get started.')}
    <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Questions? We\'re here to help:</p>
    <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:#059669;font-size:13px;font-weight:600;text-decoration:none;">devopspraharaj25@gmail.com</a></p>
  `;

  const html = baseTemplate(
    'linear-gradient(135deg,#064e3b 0%,#065f46 100%)',
    '&#127968;',
    'Order Delivered!',
    `Your order #${order.orderId} has arrived`,
    body
  );

  return sendMail(order.userEmail, `Delivered — #${order.orderId} | MetaMart`, html);
}
