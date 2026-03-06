'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  customerName: string;
  company: string | null;
  content: string;
  rating: number;
  approved: boolean;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Since we seed testimonials, we'll use static data for now
        // In production, this would fetch from the API
        setTestimonials([
          {
            id: '1',
            customerName: 'Rajesh Persaud',
            company: 'Persaud Construction Ltd.',
            content: 'C2 ConcreteBlock Pro provided excellent quality blocks for our housing project. The pricing was competitive, and delivery was on time. Highly recommended!',
            rating: 5,
            approved: true,
          },
          {
            id: '2',
            customerName: 'Michelle Rodrigues',
            company: 'M. Rodrigues & Sons',
            content: 'Professional service from start to finish. The block calculator on their website helped us estimate materials accurately. Great experience!',
            rating: 5,
            approved: true,
          },
          {
            id: '3',
            customerName: 'David Williams',
            company: 'Williams Building Services',
            content: 'We have been using C2 ConcreteBlock Pro for all our construction projects in Region 3. Their GNBS certified blocks ensure quality every time.',
            rating: 5,
            approved: true,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from builders, contractors, and homeowners who trust C2 ConcreteBlock Pro
            for their construction needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-[#1E3A5F]/10">
                    <Quote className="h-12 w-12" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? 'text-[#F97316] fill-[#F97316]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 mb-6 relative z-10">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3A5F]">
                        {testimonial.customerName}
                      </p>
                      {testimonial.company && (
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Join our satisfied customers. Contact us today for your project needs.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-[#F97316] font-semibold hover:underline"
          >
            Get in Touch
            <Star className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
