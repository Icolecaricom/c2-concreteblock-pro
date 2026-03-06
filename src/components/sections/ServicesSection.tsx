'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  Clock,
  MessageCircle,
  FileText,
  CheckCircle,
  Phone,
  MapPin,
  Users,
} from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Delivery Service',
    description: 'We deliver to Region 3 and Region 4, Guyana. FREE delivery within 10 miles radius of our facility.',
    features: ['Region 3 & 4 Coverage', 'Free Delivery (10mi)', 'Flexible Scheduling'],
    highlight: true,
  },
  {
    icon: Clock,
    title: 'Customer Pickup',
    description: 'Pick up your order directly from our facility during business hours. Save on delivery costs.',
    features: ['No Wait Time', 'Inspect Before Loading', 'Flexible Hours'],
    highlight: false,
  },
  {
    icon: MessageCircle,
    title: 'Free Consultations',
    description: 'Get expert advice on material usage, construction tips, and project planning from our experienced team.',
    features: ['Material Estimates', 'Construction Tips', 'Project Planning'],
    highlight: true,
  },
  {
    icon: FileText,
    title: 'PDF Guides',
    description: 'Download free guides on block laying techniques, best practices, and construction standards.',
    features: ['Block Laying Guide', 'Best Practices', 'Safety Standards'],
    highlight: false,
  },
];

export function ServicesSection() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Our Services</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Comprehensive Construction Support
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From delivery to expert consultation, we provide everything you need for a successful construction project.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  service.highlight ? 'border-2 border-[#F97316]' : ''
                }`}
              >
                {service.highlight && (
                  <div className="absolute top-0 right-0 bg-[#F97316] text-white text-xs px-2 py-1 rounded-bl">
                    Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Delivery Areas */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1E3A5F] text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delivery Areas</h3>
                  <p className="text-gray-300 mb-3">
                    We deliver concrete blocks to Region 3 and Region 4 in Guyana.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• West Bank Demerara</li>
                    <li>• East Bank Demerara</li>
                    <li>• Georgetown Area</li>
                    <li>• Surrounding Communities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F97316]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-[#F97316]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
                    Expert Support
                  </h3>
                  <p className="text-gray-600 mb-3">
                    With over 20 years of engineering and construction experience, our team is ready to help.
                  </p>
                  <Button
                    onClick={scrollToContact}
                    variant="outline"
                    className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
