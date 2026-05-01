import { jsPDF } from 'jspdf';

interface OrderItem { id: number; name: string; price: number; image: string; quantity: number; }
interface Order { id: string; items: OrderItem[]; total: number; address: string; name: string; email: string; date: string; status: string; }

export function generateReceipt(order: Order): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 0;

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, W, 90, 'F');

  // Gradient overlay (purple right side)
  doc.setFillColor(147, 51, 234);
  doc.rect(W / 2, 0, W / 2, 90, 'F');
  doc.setFillColor(59, 130, 246);
  for (let i = 0; i <= 60; i++) {
    const alpha = i / 60;
    const r = Math.round(59 + (147 - 59) * alpha);
    const g = Math.round(130 + (51 - 130) * alpha);
    const b = Math.round(246 + (234 - 246) * alpha);
    doc.setFillColor(r, g, b);
    doc.rect(W / 2 - 30 + i, 0, 1, 90, 'F');
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('MetaMart', margin, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium E-Commerce', margin, 60);
  doc.text('meta-mart-sable.vercel.app', margin, 76);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', W - margin, 42, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`# ${order.id}`, W - margin, 60, { align: 'right' });
  doc.text(new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }), W - margin, 76, { align: 'right' });

  y = 114;

  // ── Bill To / Order Info row ──────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, W - margin * 2, 80, 8, 8, 'F');

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin + 16, y + 18);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(order.name, margin + 16, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(order.email || '', margin + 16, y + 50);
  doc.text(order.address, margin + 16, y + 64, { maxWidth: (W - margin * 2) / 2 - 20 });

  const col2 = W / 2 + 20;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT STATUS', col2, y + 18);
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(col2, y + 24, 70, 20, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID', col2 + 35, y + 38, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.text('PAYMENT METHOD', col2, y + 56);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Card / Stripe', col2, y + 70);

  y += 100;

  // ── Items table header ────────────────────────────────────────
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, W - margin * 2, 28, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const cols = { item: margin + 12, qty: W - margin - 180, unit: W - margin - 110, total: W - margin - 12 };
  doc.text('ITEM', cols.item, y + 18);
  doc.text('QTY', cols.qty, y + 18);
  doc.text('UNIT PRICE', cols.unit, y + 18);
  doc.text('TOTAL', cols.total, y + 18, { align: 'right' });

  y += 28;

  // ── Items rows ────────────────────────────────────────────────
  order.items.forEach((item, i) => {
    const rowH = 36;
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, W - margin * 2, rowH, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    // Truncate long names
    const maxNameWidth = cols.qty - cols.item - 10;
    const name = doc.splitTextToSize(item.name, maxNameWidth)[0];
    doc.text(name, cols.item, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`Category item`, cols.item, y + 26);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text(String(item.quantity), cols.qty, y + 20);
    doc.text(`$${item.price.toFixed(2)}`, cols.unit, y + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, cols.total, y + 20, { align: 'right' });

    y += rowH;
  });

  // ── Divider ───────────────────────────────────────────────────
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y + 8, W - margin, y + 8);
  y += 20;

  // ── Totals block ─────────────────────────────────────────────
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;

  const totalsX = W - margin - 200;
  const valX = W - margin;

  const addRow = (label: string, value: string, bold = false, color?: [number, number, number]) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(...(color ?? ([100, 116, 139] as [number, number, number])));
    doc.text(label, totalsX, y);
    doc.setTextColor(...(color ?? ([30, 41, 59] as [number, number, number])));
    doc.text(value, valX, y, { align: 'right' });
    y += bold ? 20 : 18;
  };

  addRow('Subtotal', `$${subtotal.toFixed(2)}`);
  addRow('Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`);
  addRow('Tax (8%)', `$${tax.toFixed(2)}`);

  y += 4;
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(totalsX - 12, y - 14, valX - totalsX + 24, 30, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TOTAL', totalsX, y + 8);
  doc.text(`$${order.total.toFixed(2)}`, valX, y + 8, { align: 'right' });
  y += 40;

  // ── Delivery info ─────────────────────────────────────────────
  const arrival = new Date(order.date);
  arrival.setDate(arrival.getDate() + 5);
  const arrivalStr = arrival.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, W - margin * 2, 44, 8, 8, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ESTIMATED DELIVERY', margin + 16, y + 16);
  doc.setFontSize(13);
  doc.text(`${arrivalStr}`, margin + 16, y + 34);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Standard shipping · 3–5 business days', W - margin, y + 25, { align: 'right' });

  y += 60;

  // ── Footer ────────────────────────────────────────────────────
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, W - margin, y);
  y += 16;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with MetaMart!', W / 2, y, { align: 'center' });
  y += 14;
  doc.text('Questions? Contact us at support@metamart.com', W / 2, y, { align: 'center' });
  y += 14;
  doc.text('meta-mart-sable.vercel.app  ·  This is a computer-generated receipt and requires no signature.', W / 2, y, { align: 'center' });

  return doc;
}

export function downloadReceipt(order: Order) {
  const doc = generateReceipt(order);
  doc.save(`MetaMart-Receipt-${order.id}.pdf`);
}

export function getReceiptBase64(order: Order): string {
  const doc = generateReceipt(order);
  return doc.output('datauristring');
}
