import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all plan submissions
export async function GET() {
  try {
    const plans = await db.planSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

// PUT - Update plan status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    const plan = await db.planSubmission.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

// DELETE - Delete plan submission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    await db.planSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
