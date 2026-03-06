'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award,
  CheckCircle,
  Users,
  Building,
  Target,
  Shield,
} from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">About Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Your Trusted Partner in Construction
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            C2 ConcreteBlock Pro is dedicated to providing the highest quality concrete blocks
            for construction projects across Guyana.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/about-facility.png"
                alt="C2 ConcreteBlock Pro Facility"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Certification Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#F97316] text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-10 w-10" />
                <div>
                  <p className="font-bold text-lg">GNBS Certified</p>
                  <p className="text-sm opacity-90">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-[#1E3A5F] mb-4">
                Building Stronger Foundations Since Day One
              </h3>
              <p className="text-gray-600 mb-4">
                C2 ConcreteBlock Pro is a new venture founded on over 20 years of engineering
                and construction experience. Our owner brings decades of expertise in the
                construction industry, ensuring every block we produce meets the highest
                standards of quality and durability.
              </p>
              <p className="text-gray-600">
                {/* Placeholder for company story */}
                [Company story placeholder - details about the journey, vision, and commitment
                to quality will be added here]
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E3A5F]">GNBS Certified</p>
                  <p className="text-sm text-gray-500">Guyana National Bureau of Standards</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E3A5F]">20+ Years</p>
                  <p className="text-sm text-gray-500">Industry Experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="h-5 w-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E3A5F]">Quality Blocks</p>
                  <p className="text-sm text-gray-500">Manufactured with Care</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E3A5F]">Customer Focus</p>
                  <p className="text-sm text-gray-500">Your Success is Our Goal</p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-[#1E3A5F] rounded-xl p-6 text-white">
              <h4 className="font-semibold text-lg mb-2">Our Mission</h4>
              <p className="text-gray-300">
                To provide high-quality, affordable concrete blocks to builders and homeowners
                across Guyana, supporting the growth of our communities with products that
                stand the test of time.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-[#1E3A5F] text-center mb-8">
            Why Choose C2 ConcreteBlock Pro?
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-t-4 border-t-[#F97316]">
              <CardContent className="pt-4">
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-[#F97316]" />
                </div>
                <h4 className="font-semibold text-[#1E3A5F] mb-2">Quality</h4>
                <p className="text-sm text-gray-600">
                  GNBS certified blocks manufactured to the highest standards
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-t-4 border-t-[#F97316]">
              <CardContent className="pt-4">
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-[#F97316]" />
                </div>
                <h4 className="font-semibold text-[#1E3A5F] mb-2">Bulk Pricing</h4>
                <p className="text-sm text-gray-600">
                  Competitive tiered pricing for large orders
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-t-4 border-t-[#F97316]">
              <CardContent className="pt-4">
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-[#F97316]" />
                </div>
                <h4 className="font-semibold text-[#1E3A5F] mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">
                  Free delivery within 10 miles radius
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-t-4 border-t-[#F97316]">
              <CardContent className="pt-4">
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-[#F97316]" />
                </div>
                <h4 className="font-semibold text-[#1E3A5F] mb-2">Expert Support</h4>
                <p className="text-sm text-gray-600">
                  Free consultations and construction advice
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
