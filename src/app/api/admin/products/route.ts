import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, dimensions, priceMin, priceMax, category, imageUrl, inStock, featured } = body;

    if (!name || !slug || !description || !dimensions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        dimensions,
        priceMin: priceMin || 0,
        priceMax: priceMax || 0,
        category: category || 'blocks',
        imageUrl: imageUrl || null,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured !== undefined ? featured : false
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
