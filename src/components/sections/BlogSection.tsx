'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
} from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Choosing the Right Concrete Blocks for Your Construction Project',
    excerpt: 'Learn the differences between 4-inch and 6-inch hollow blocks, and when to use each type for optimal results in your construction project.',
    category: 'Tips & Guides',
    author: 'C2 ConcreteBlock Pro',
    date: '2025-01-15',
    readTime: '5 min read',
    image: '/hero-bg.png',
    featured: true,
  },
  {
    id: 2,
    title: '5 Essential Tips for Block Laying Success',
    excerpt: 'Master the art of block laying with these professional tips from our engineering team with over 20 years of construction experience.',
    category: 'Construction Tips',
    author: 'C2 ConcreteBlock Pro',
    date: '2025-01-10',
    readTime: '4 min read',
    image: '/about-facility.png',
    featured: false,
  },
  {
    id: 3,
    title: 'Understanding GNBS Certification for Concrete Blocks',
    excerpt: 'What does GNBS certification mean for your construction materials? Learn why certified blocks are essential for quality construction.',
    category: 'Quality Standards',
    author: 'C2 ConcreteBlock Pro',
    date: '2025-01-05',
    readTime: '3 min read',
    image: '/product-6inch.png',
    featured: false,
  },
];

export function BlogSection() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Blog & News</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Construction Tips & Industry Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest construction tips, industry news, and expert advice
            from our team of engineers.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className={`group overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                post.featured ? 'ring-2 ring-[#F97316]' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {post.featured && (
                  <Badge className="absolute top-3 left-3 bg-[#F97316]">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-3 right-3 bg-[#1E3A5F]">
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-GY', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2 line-clamp-2 group-hover:text-[#F97316] transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <Button
                  variant="link"
                  className="p-0 text-[#F97316] hover:text-orange-600"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-[#1E3A5F] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-300">
                  Get the latest construction tips, industry news, and exclusive offers
                  delivered straight to your inbox.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Newsletter signup logic
                  const email = (e.target as HTMLFormElement).email.value;
                  console.log('Newsletter signup:', email);
                }}
                className="flex gap-2"
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#F97316] hover:bg-orange-600 whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Follow us on social media</p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
