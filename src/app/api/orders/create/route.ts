import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail, EmailTemplates } from '@/lib/email';

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      deliveryAddress,
      deliveryMethod,
      deliveryInstructions,
      paymentMethod,
      isPartialPayment,
      depositAmount,
      items,
      totalAmount,
      notes,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order with items
    const order = await db.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        company: company || null,
        status: paymentMethod === 'card' ? 'pending_payment' : 'pending',
        totalAmount,
        notes,
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: customerEmail,
        ...EmailTemplates.orderConfirmation({
          customerName,
          orderId: order.id,
          items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.unitPrice || 0,
          })),
          total: totalAmount,
          deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : 'Pickup at facility',
        }),
      });

      // Send admin notification
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@c2concreteblockpro.com',
        ...EmailTemplates.adminNotification({
          type: 'order',
          details: `
New Order: #${order.id.slice(-8).toUpperCase()}
Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
${company ? `Company: ${company}` : ''}
Total: $${totalAmount.toLocaleString()} GYD
Payment Method: ${paymentMethod}
Delivery Method: ${deliveryMethod}
${deliveryAddress ? `Address: ${deliveryAddress}` : ''}
${isPartialPayment ? `Deposit: $${depositAmount} GYD` : ''}

Items:
${order.items.map((i) => `- ${i.product.name} x ${i.quantity}`).join('\n')}
          `,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send order emails:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    const where: any = {};
    if (email) where.customerEmail = email;
    if (status) where.status = status;

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
