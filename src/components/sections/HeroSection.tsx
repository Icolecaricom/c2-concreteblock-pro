'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Phone, CheckCircle } from 'lucide-react';

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/95 via-[#1E3A5F]/85 to-[#1E3A5F]/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F97316]/20 border border-[#F97316]/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="h-4 w-4 text-[#F97316]" />
            <span className="text-[#F97316] font-medium text-sm">GNBS Certified Quality</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Building Stronger Foundations with{' '}
            <span className="text-[#F97316]">Strength, Durability & Affordability</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Premium concrete blocks manufactured in Guyana. Trusted by contractors and homeowners across Region 3 and Region 4 for quality construction materials.
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>GNBS Certified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free Delivery (10mi)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Bulk Pricing Available</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => scrollToSection('#products')}
              className="bg-[#F97316] hover:bg-orange-600 text-white text-lg px-8"
            >
              View Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#calculator')}
              className="border-white text-white hover:bg-white hover:text-[#1E3A5F] text-lg px-8"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Block Calculator
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#contact')}
              className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white text-lg px-8"
            >
              <Phone className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#F97316]">20+</p>
              <p className="text-gray-300 text-sm">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#F97316]">500+</p>
              <p className="text-gray-300 text-sm">Projects Completed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#F97316]">100%</p>
              <p className="text-gray-300 text-sm">GNBS Certified</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#F97316]">Free</p>
              <p className="text-gray-300 text-sm">Delivery (10mi)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
