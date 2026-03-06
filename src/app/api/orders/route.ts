import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, company, notes, items } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      if (item.unitPrice) {
        totalAmount += item.unitPrice * item.quantity;
      }
    }

    // Create order with items
    const order = await db.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        company: company || null,
        notes: notes || null,
        totalAmount: totalAmount > 0 ? totalAmount : null,
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice?: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || null
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully',
      order
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      take: 50
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
