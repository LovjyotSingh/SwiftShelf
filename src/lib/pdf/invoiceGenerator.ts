import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { OrderRecord } from '@/types';
import { formatCurrency, formatTimestamp } from '../utils';

export function generateInvoicePDF(order: OrderRecord): jsPDF {
  const doc = new jsPDF();

  // Primary Brand Header (Dark Slate / Luxury Indigo)
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, 210, 40, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SWIFTSHELF', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.text('HIGH-PERFORMANCE HARDWARE & ERGONOMICS', 14, 29);

  // Invoice Title Right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('OFFICIAL TAX INVOICE', 196, 22, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(`Order Ref: ${order.orderNumber}`, 196, 30, { align: 'right' });

  // Invoice & Customer Info Grid
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO:', 14, 52);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(order.customerName || 'Valued Customer', 14, 58);
  doc.text(order.customerEmail, 14, 64);
  if (order.shippingAddress) {
    doc.text(`${order.shippingAddress.street}, ${order.shippingAddress.city}`, 14, 70);
    doc.text(`${order.shippingAddress.state} ${order.shippingAddress.zip}, ${order.shippingAddress.country}`, 14, 76);
  }

  // Invoice Metadata Right
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('INVOICE DETAILS:', 140, 52);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Date Issued: ${formatTimestamp(order.createdAt)}`, 140, 58);
  doc.text(`Payment Status: ${order.status}`, 140, 64);
  doc.text(`Idempotency Ref: ${order.idempotencyKey.substring(0, 16)}...`, 140, 70);

  // Table of Items
  const tableData = order.items.map((item, index) => [
    (index + 1).toString(),
    `${item.title} (${item.variantName})`,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatCurrency(item.totalPrice),
  ]);

  (doc as any).autoTable({
    startY: 86,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Summary Totals Right Aligned
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(formatCurrency(order.subtotal), 196, finalY, { align: 'right' });

  doc.text(`Estimated Tax (8%):`, 140, finalY + 6);
  doc.text(formatCurrency(order.taxAmount), 196, finalY + 6, { align: 'right' });

  if (order.discountAmount > 0) {
    doc.text(`Discount:`, 140, finalY + 12);
    doc.text(`-${formatCurrency(order.discountAmount)}`, 196, finalY + 12, { align: 'right' });
  }

  doc.text(`Shipping:`, 140, finalY + 18);
  doc.text(order.shippingAmount === 0 ? 'FREE (Complimentary)' : formatCurrency(order.shippingAmount), 196, finalY + 18, { align: 'right' });

  // Grand Total Box
  doc.setFillColor(241, 245, 249);
  doc.rect(135, finalY + 24, 65, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Paid:`, 140, finalY + 32);
  doc.text(formatCurrency(order.total), 196, finalY + 32, { align: 'right' });

  // Footer Note
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing SwiftShelf. For warranty or support, contact support@swiftshelf.io', 105, 285, {
    align: 'center',
  });

  return doc;
}
