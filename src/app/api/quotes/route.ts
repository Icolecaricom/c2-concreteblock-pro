import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await db.quoteRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        projectType: projectType || null,
        message
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      id: quoteRequest.id
    });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quotes = await db.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
