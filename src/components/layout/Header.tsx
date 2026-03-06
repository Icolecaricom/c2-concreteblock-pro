'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';
import {
  Menu,
  X,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#products', label: 'Products' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#resources', label: 'Resources' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1E3A5F] text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+592 XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Region 3, Guyana</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Mon-Fri: 8AM-5PM | Sat: 8AM-12PM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#F97316] font-semibold">GNBS Certified</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-white transition-shadow duration-300',
          isScrolled && 'shadow-lg'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/c2-logo.svg"
                alt="C2 ConcreteBlock Pro"
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-700 hover:text-[#1E3A5F] font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => scrollToSection('#contact')}
                className="bg-[#F97316] hover:bg-orange-600 text-white"
              >
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <img
                        src="/c2-logo.svg"
                        alt="C2 ConcreteBlock Pro"
                        className="h-10 w-auto"
                      />
                    </div>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => scrollToSection(link.href)}
                          className="text-left text-gray-700 hover:text-[#1E3A5F] font-medium py-2 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                    </nav>
                    <Button
                      onClick={() => scrollToSection('#contact')}
                      className="bg-[#F97316] hover:bg-orange-600 text-white w-full"
                    >
                      Get Quote
                    </Button>
                    <div className="mt-auto pt-6 border-t text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4" />
                        <span>+592 XXX-XXXX</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Mon-Fri: 8AM-5PM</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
