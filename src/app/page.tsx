'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { CalculatorSection } from '@/components/sections/CalculatorSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PlanSubmissionSection } from '@/components/sections/PlanSubmissionSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ResourcesSection } from '@/components/sections/ResourcesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { CartDrawer } from '@/components/CartDrawer';
import { ChatWidget } from '@/components/ChatWidget';
import { AdminPanel } from '@/components/AdminPanel';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { PromotionalBanner } from '@/components/PromotionalBanner';
import { SocialShare, FloatingShareButton } from '@/components/SocialShare';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Google Analytics */}
      <GoogleAnalytics />

      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Block Calculator Section */}
        <CalculatorSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Plan Submission Section */}
        <PlanSubmissionSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* About Section */}
        <AboutSection />

        {/* Blog & News Section */}
        <BlogSection />

        {/* Resources Section */}
        <ResourcesSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Admin Panel */}
      <AdminPanel />

      {/* Social Share Buttons */}
      <SocialShare variant="floating" />
      <FloatingShareButton />
    </div>
  );
}
