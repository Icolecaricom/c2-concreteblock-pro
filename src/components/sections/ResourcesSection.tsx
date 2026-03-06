'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  BookOpen,
  Wrench,
  Shield,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

const resources = [
  {
    icon: FileText,
    title: 'Block Laying Guide',
    description:
      'A comprehensive guide on proper block laying techniques, including foundation preparation, mortar mixing, and alignment tips for professional results.',
    type: 'PDF',
    size: '2.4 MB',
    downloadUrl: '#',
    featured: true,
  },
  {
    icon: Wrench,
    title: 'Essential Tools Checklist',
    description:
      'A complete checklist of tools needed for block construction projects, from basic masonry tools to specialized equipment for larger jobs.',
    type: 'PDF',
    size: '1.1 MB',
    downloadUrl: '#',
    featured: true,
  },
  {
    icon: Shield,
    title: 'Safety Standards Guide',
    description:
      'Important safety guidelines and best practices for construction sites, including personal protective equipment and site safety protocols.',
    type: 'PDF',
    size: '1.8 MB',
    downloadUrl: '#',
    featured: false,
  },
  {
    icon: BookOpen,
    title: 'Project Planning Handbook',
    description:
      'Step-by-step planning guide for construction projects, including material estimation, timeline planning, and budget considerations.',
    type: 'PDF',
    size: '3.2 MB',
    downloadUrl: '#',
    featured: false,
  },
];

const faqs = [
  {
    question: 'How many blocks do I need for my project?',
    answer:
      'Use our Block Calculator to estimate the number of blocks needed. Generally, you need 1.125 blocks per square foot of wall area. We recommend adding 5% extra for cutting requirements.',
  },
  {
    question: 'What is the difference between 4-inch and 6-inch blocks?',
    answer:
      '4-inch blocks are typically used for non-load bearing walls and partitions, while 6-inch blocks provide greater structural strength for load-bearing walls and foundations.',
  },
  {
    question: 'Do you offer delivery services?',
    answer:
      'Yes! We deliver to Region 3 and Region 4 in Guyana. Delivery is FREE within a 10-mile radius of our facility. Contact us for delivery pricing outside this area.',
  },
  {
    question: 'Can I pick up my order directly?',
    answer:
      'Absolutely! You can pick up your order directly from our facility at Lot 6 De Buff Canal #2 Polder, West Bank Demerara during business hours.',
  },
  {
    question: 'Do you offer bulk pricing?',
    answer:
      'Yes, we offer tiered pricing for bulk orders. The price per block decreases with larger quantities. Contact us for a custom quote for your project.',
  },
  {
    question: 'Are your blocks GNBS certified?',
    answer:
      'Yes, all our concrete blocks are GNBS (Guyana National Bureau of Standards) certified, ensuring consistent quality and compliance with national standards.',
  },
];

export function ResourcesSection() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Resources</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Helpful Resources & Guides
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Download our free guides and learn best practices for block construction.
            Our resources help you plan and execute your project successfully.
          </p>
        </div>

        {/* Downloadable Guides */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  resource.featured ? 'border-2 border-[#F97316]' : ''
                }`}
              >
                {resource.featured && (
                  <div className="absolute top-0 right-0 bg-[#F97316] text-white text-xs px-2 py-1 rounded-bl">
                    Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {resource.type} • {resource.size}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-6 w-6 text-[#F97316]" />
              <h3 className="text-2xl font-bold text-[#1E3A5F]">
                Frequently Asked Questions
              </h3>
            </div>
            <p className="text-gray-600">
              Find answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-[#1E3A5F] mb-2 flex items-start gap-2">
                    <span className="text-[#F97316]">Q:</span>
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    <span className="text-[#1E3A5F] font-medium">A:</span> {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
            <Button
              onClick={scrollToContact}
              className="bg-[#F97316] hover:bg-orange-600"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-[#1E3A5F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Learn the Basics</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our guides cover everything from selecting the right blocks to proper
                installation techniques for lasting results.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1E3A5F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Tools & Equipment</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Discover the essential tools needed for block construction and tips
                on using them effectively for professional results.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1E3A5F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Safety First</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Safety is paramount in construction. Learn the best practices to
                protect yourself and your team on the job site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
