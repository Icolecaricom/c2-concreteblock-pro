'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E3A5F] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/c2-logo.svg"
                alt="C2 ConcreteBlock Pro"
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Building Stronger Foundations with Strength, Durability & Affordability.
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-[#F97316] text-white px-3 py-1 rounded text-sm font-semibold">
                GNBS Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#products" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#calculator" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  Block Calculator
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#resources" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana, South America
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#F97316] flex-shrink-0" />
                <a href="tel:+592XXXXXXXX" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  +592 XXX-XXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#F97316] flex-shrink-0" />
                <a href="mailto:info@c2concreteblockpro.com" className="text-gray-300 hover:text-[#F97316] transition-colors">
                  info@c2concreteblockpro.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#F97316] flex-shrink-0" />
                <div>
                  <p>Monday - Friday</p>
                  <p className="text-gray-400">8:00 AM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#F97316] flex-shrink-0" />
                <div>
                  <p>Saturday</p>
                  <p className="text-gray-400">8:00 AM - 12:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#F97316] flex-shrink-0" />
                <div>
                  <p>Sunday</p>
                  <p className="text-gray-400">Closed</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://wa.me/592XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} C2 ConcreteBlock Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
