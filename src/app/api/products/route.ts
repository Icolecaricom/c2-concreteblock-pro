import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Static fallback products
const STATIC_PRODUCTS = [
  {
    id: 'static-1',
    name: '4-Inch Hollow Block',
    slug: '4-inch-hollow-block',
    description: 'High-quality 4-inch hollow concrete blocks, perfect for non-load bearing walls, partitions, and general construction. GNBS certified for quality and durability.',
    dimensions: '16" × 8" × 4"',
    priceMin: 180,
    priceMax: 220,
    category: 'blocks',
    imageUrl: '/product-4inch.png',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'static-2',
    name: '6-Inch Hollow Block',
    slug: '6-inch-hollow-block',
    description: 'Heavy-duty 6-inch hollow concrete blocks, ideal for load-bearing walls, foundations, and structural applications. GNBS certified for superior strength.',
    dimensions: '16" × 8" × 6"',
    priceMin: 220,
    priceMax: 240,
    category: 'blocks',
    imageUrl: '/product-6inch.png',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'static-3',
    name: 'Paving Blocks',
    slug: 'paving-blocks',
    description: 'Durable interlocking paving blocks for driveways, walkways, patios, and outdoor spaces. Available in various patterns and sizes. Contact us for pricing.',
    dimensions: 'Various sizes available',
    priceMin: 0,
    priceMax: 0,
    category: 'paving',
    imageUrl: '/product-paving.png',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Return static products if database is empty
    if (products.length === 0) {
      return NextResponse.json({ products: STATIC_PRODUCTS });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    // Return static products as fallback on error
    return NextResponse.json({ products: STATIC_PRODUCTS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, dimensions, priceMin, priceMax, category, imageUrl, inStock, featured } = body;

    // Validate required fields
    if (!name || !slug || !description || !dimensions || priceMin === undefined || priceMax === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        dimensions,
        priceMin,
        priceMax,
        category: category || 'blocks',
        imageUrl: imageUrl || null,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured !== undefined ? featured : false
      }
    });

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
