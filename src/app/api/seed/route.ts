import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Check if products already exist
    const existingProducts = await db.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded'
      });
    }

    // Seed products
    await db.product.createMany({
      data: [
        {
          name: '4-Inch Hollow Block',
          slug: '4-inch-hollow-block',
          description: 'High-quality 4-inch hollow concrete blocks, perfect for non-load bearing walls, partitions, and general construction. GNBS certified for quality and durability.',
          dimensions: '16" × 8" × 4"',
          priceMin: 180,
          priceMax: 220,
          category: 'blocks',
          imageUrl: '/product-4inch.png',
          inStock: true,
          featured: true
        },
        {
          name: '6-Inch Hollow Block',
          slug: '6-inch-hollow-block',
          description: 'Heavy-duty 6-inch hollow concrete blocks, ideal for load-bearing walls, foundations, and structural applications. GNBS certified for superior strength.',
          dimensions: '16" × 8" × 6"',
          priceMin: 220,
          priceMax: 240,
          category: 'blocks',
          imageUrl: '/product-6inch.png',
          inStock: true,
          featured: true
        },
        {
          name: 'Paving Blocks',
          slug: 'paving-blocks',
          description: 'Durable interlocking paving blocks for driveways, walkways, patios, and outdoor spaces. Available in various patterns and sizes. Contact us for pricing.',
          dimensions: 'Various sizes available',
          priceMin: 0,
          priceMax: 0,
          category: 'paving',
          imageUrl: '/product-paving.png',
          inStock: true,
          featured: true
        }
      ]
    });

    // Seed testimonials
    await db.testimonial.createMany({
      data: [
        {
          customerName: 'Rajesh Persaud',
          company: 'Persaud Construction Ltd.',
          content: 'C2 ConcreteBlock Pro provided excellent quality blocks for our housing project. The pricing was competitive, and delivery was on time. Highly recommended!',
          rating: 5,
          approved: true
        },
        {
          customerName: 'Michelle Rodrigues',
          company: 'M. Rodrigues & Sons',
          content: 'Professional service from start to finish. The block calculator on their website helped us estimate materials accurately. Great experience!',
          rating: 5,
          approved: true
        },
        {
          customerName: 'David Williams',
          company: 'Williams Building Services',
          content: 'We have been using C2 ConcreteBlock Pro for all our construction projects in Region 3. Their GNBS certified blocks ensure quality every time.',
          rating: 5,
          approved: true
        }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
