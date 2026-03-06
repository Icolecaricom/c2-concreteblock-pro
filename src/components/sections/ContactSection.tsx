'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Maps embed URL for the address
  const mapAddress = encodeURIComponent(
    'Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana'
  );
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapAddress}`;

  // Alternative: Use static map with coordinates (West Bank Demerara, Guyana)
  const coordinates = { lat: 6.785, lng: -58.185 };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Contact Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Get In Touch With Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or need a quote? We are here to help.
            Reach out to us and our team will respond promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-2 border-[#1E3A5F]/10">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-6">
                Send Us a Message
              </h3>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1E3A5F] mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-[#F97316] text-[#F97316]"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+592 XXX-XXXX"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, subject: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">Request a Quote</SelectItem>
                        <SelectItem value="product">Product Inquiry</SelectItem>
                        <SelectItem value="delivery">Delivery Question</SelectItem>
                        <SelectItem value="bulk">Bulk Order</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project or question..."
                      required
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F97316] hover:bg-orange-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-[#1E3A5F] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold">Phone</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">Sales & Inquiries</p>
                  <a
                    href="tel:+592XXXXXXXX"
                    className="text-lg font-semibold hover:text-[#F97316] transition-colors"
                  >
                    +592 XXX-XXXX
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-[#1E3A5F] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold">WhatsApp</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">Quick Response</p>
                  <a
                    href="https://wa.me/592XXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-green-400 transition-colors"
                  >
                    +592 XXX-XXXX
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F97316]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#F97316]" />
                    </div>
                    <h4 className="font-semibold text-[#1E3A5F]">Email</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Write to us</p>
                  <a
                    href="mailto:info@c2concreteblockpro.com"
                    className="text-[#1E3A5F] font-semibold hover:text-[#F97316] transition-colors break-all"
                  >
                    info@c2concreteblockpro.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F97316]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#F97316]" />
                    </div>
                    <h4 className="font-semibold text-[#1E3A5F]">Hours</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Business Hours</p>
                  <p className="text-[#1E3A5F] font-semibold text-sm">
                    Mon-Fri: 8AM-5PM
                  </p>
                  <p className="text-[#1E3A5F] font-semibold text-sm">
                    Sat: 8AM-12PM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Google Map */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15808.404!2d-58.185!3d6.785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDcnMDYuMCJOIDU4wrAxMScwNi4wIlc!5e0!3m2!1sen!2sgy!4v1699999999999!5m2!1sen!2sgy`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="C2 ConcreteBlock Pro Location"
                    className="w-full"
                  />
                  {/* Overlay with address */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-start gap-2 text-white">
                      <MapPin className="h-5 w-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">C2 ConcreteBlock Pro</p>
                        <p className="text-sm text-gray-300">
                          Lot 6 De Buff Canal #2 Polder, West Bank Demerara,
                          Region 3, Guyana, South America
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Directions Button */}
            <Button
              asChild
              className="w-full bg-[#1E3A5F] hover:bg-[#152d4a]"
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
