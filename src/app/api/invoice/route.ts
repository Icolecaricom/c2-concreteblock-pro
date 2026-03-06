import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Generate invoice for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(order);

    // Return HTML for printing/download
    return new NextResponse(invoiceHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="invoice-${order.id}.html"`,
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

function generateInvoiceHtml(order: any): string {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-GY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const items = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.product.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">$${item.unitPrice?.toLocaleString() || 'Quote'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">$${((item.unitPrice || 0) * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const subtotal = order.items.reduce(
    (sum: number, item: any) => sum + (item.unitPrice || 0) * item.quantity,
    0
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - C2 ConcreteBlock Pro</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      border-bottom: 3px solid #1E3A5F;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1E3A5F;
    }
    .logo span {
      color: #F97316;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 32px;
      color: #1E3A5F;
      margin-bottom: 10px;
    }
    .invoice-number {
      color: #666;
      font-size: 14px;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .details-box {
      flex: 1;
    }
    .details-box h3 {
      color: #1E3A5F;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
    }
    .details-box p {
      margin: 5px 0;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #1E3A5F;
      color: white;
      padding: 12px;
      text-align: left;
    }
    th:last-child, th:nth-child(3) {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals table {
      border: none;
    }
    .totals td {
      padding: 8px 12px;
    }
    .totals tr:last-child td {
      font-size: 18px;
      font-weight: bold;
      color: #1E3A5F;
      border-top: 2px solid #1E3A5F;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-paid { background: #10B981; color: white; }
    .status-pending { background: #F59E0B; color: white; }
    .status-cancelled { background: #EF4444; color: white; }
    .payment-info {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .payment-info h4 {
      margin: 0 0 10px 0;
      color: #1E3A5F;
    }
    .bank-details {
      margin-top: 10px;
    }
    .bank-details p {
      margin: 5px 0;
      font-size: 14px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      C2 <span>ConcreteBlock</span> Pro
    </div>
    <div class="invoice-info">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">Invoice #: ${order.id.slice(-8).toUpperCase()}</div>
      <div>Date: ${invoiceDate}</div>
      <div style="margin-top: 10px;">
        Status: <span class="status-badge status-${order.status}">${order.status}</span>
      </div>
    </div>
  </div>

  <div class="details">
    <div class="details-box">
      <h3>Bill To</h3>
      <p><strong>${order.customerName}</strong></p>
      <p>${order.customerEmail}</p>
      <p>${order.customerPhone}</p>
      ${order.company ? `<p>Company: ${order.company}</p>` : ''}
    </div>
    <div class="details-box">
      <h3>From</h3>
      <p><strong>C2 ConcreteBlock Pro</strong></p>
      <p>Lot 6 De Buff Canal #2 Polder</p>
      <p>West Bank Demerara, Region 3</p>
      <p>Guyana, South America</p>
      <p>Phone: +592 XXX-XXXX</p>
    </div>
  </div>

  ${order.status === 'pending' ? `
  <div class="payment-info">
    <h4>Payment Instructions</h4>
    <p>Please make payment to:</p>
    <div class="bank-details">
      <p><strong>Bank:</strong> [Your Bank Name]</p>
      <p><strong>Account Name:</strong> C2 ConcreteBlock Pro</p>
      <p><strong>Account Number:</strong> [Account Number]</p>
    </div>
    <p style="margin-top: 15px; color: #F97316; font-weight: bold;">
      Reference: Order #${order.id.slice(-8).toUpperCase()}
    </p>
  </div>
  ` : ''}

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Quantity</th>
        <th style="text-align: right;">Unit Price (GYD)</th>
        <th style="text-align: right;">Amount (GYD)</th>
      </tr>
    </thead>
    <tbody>
      ${items}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td style="text-align: right;">$${subtotal.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Delivery:</td>
        <td style="text-align: right;">Calculated at checkout</td>
      </tr>
      <tr>
        <td><strong>Total:</strong></td>
        <td style="text-align: right;"><strong>$${order.totalAmount?.toLocaleString() || subtotal.toLocaleString()} GYD</strong></td>
      </tr>
    </table>
  </div>

  ${order.notes ? `
  <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
    <strong>Notes:</strong>
    <p style="margin: 5px 0;">${order.notes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>C2 ConcreteBlock Pro | GNBS Certified | Quality Assured</p>
    <p>Thank you for your business!</p>
    <p style="margin-top: 10px;">
      Terms: Payment due within 30 days. All prices in Guyana Dollars (GYD).
    </p>
  </div>

  <div class="no-print" style="margin-top: 20px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #1E3A5F; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Print Invoice
    </button>
  </div>
</body>
</html>
  `;
}
