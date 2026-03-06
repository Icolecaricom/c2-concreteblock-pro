import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all quote requests
export async function GET() {
  try {
    const quotes = await db.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

// PUT - Update quote status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    const quote = await db.quoteRequest.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Update quote error:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

// DELETE - Delete quote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    await db.quoteRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
