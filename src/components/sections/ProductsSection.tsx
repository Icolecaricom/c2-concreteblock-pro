'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCartStore } from '@/store/cart';
import {
  ShoppingCart,
  Calculator,
  CheckCircle,
  Package,
  Ruler,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  dimensions: string;
  priceMin: number;
  priceMax: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  featured: boolean;
}

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const scrollToCalculator = () => {
    const element = document.querySelector('#calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Our Products</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Premium Concrete Blocks
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            GNBS certified concrete blocks manufactured with the highest quality standards.
            Perfect for all your construction needs.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  {product.inStock && (
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      In Stock
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-[#F97316]">
                      Popular
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Ruler className="h-4 w-4" />
                    <span>{product.dimensions}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {product.priceMin > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <DollarSign className="h-5 w-5 text-[#F97316]" />
                        <span className="text-2xl font-bold text-[#1E3A5F]">
                          ${product.priceMin.toFixed(0)} - ${product.priceMax.toFixed(0)}
                        </span>
                        <span className="text-gray-500 text-sm">GYD/block</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#F97316]" />
                        <span className="text-lg font-semibold text-[#1E3A5F]">
                          Request Quote
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-[#1E3A5F] hover:bg-[#152d4a]"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-[#1E3A5F]">
                            {product.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          )}
                          <p className="text-gray-600">{product.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Dimensions</p>
                              <p className="font-semibold">{product.dimensions}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Price Range</p>
                              <p className="font-semibold">
                                {product.priceMin > 0
                                  ? `$${product.priceMin} - $${product.priceMax} GYD`
                                  : 'Request Quote'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                handleAddToCart(product);
                              }}
                              className="flex-1 bg-[#1E3A5F] hover:bg-[#152d4a]"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              onClick={() => {
                                scrollToCalculator();
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <Calculator className="h-4 w-4 mr-2" />
                              Calculator
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bulk Pricing Note */}
        <div className="mt-12 bg-[#1E3A5F] rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Need Bulk Quantities?
          </h3>
          <p className="text-gray-300 mb-4">
            We offer tiered pricing for large orders. Contact us for custom quotes on bulk purchases.
          </p>
          <Button
            onClick={scrollToContact}
            className="bg-[#F97316] hover:bg-orange-600"
          >
            Request Bulk Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
