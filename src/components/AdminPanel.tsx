'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Lock,
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
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
  createdAt: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string | null;
  status: string;
  totalAmount: number | null;
  notes: string | null;
  createdAt: string;
  items: { quantity: number; product: { name: string }; unitPrice: number | null }[];
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface PlanSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectDesc: string;
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [plans, setPlans] = useState<PlanSubmission[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    dimensions: '',
    priceMin: 0,
    priceMax: 0,
    category: 'blocks',
    imageUrl: '',
    inStock: true,
    featured: false,
  });

  // View details
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanSubmission | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Listen for admin keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchAllData();
        toast.success('Welcome to Admin Dashboard');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setProducts([]);
    setOrders([]);
    setQuotes([]);
    setPlans([]);
    setMessages([]);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchQuotes(),
      fetchPlans(),
      fetchMessages(),
    ]);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/admin/quotes');
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { ...productForm, id: editingProduct.id }
        : productForm;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          slug: '',
          description: '',
          dimensions: '',
          priceMin: 0,
          priceMax: 0,
          category: 'blocks',
          imageUrl: '',
          inStock: true,
          featured: false,
        });
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateStatus = async (
    type: 'orders' | 'quotes' | 'plans' | 'messages',
    id: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/admin/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        toast.success('Status updated');
        fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      new: 'bg-blue-500',
      processing: 'bg-orange-500',
      completed: 'bg-green-500',
      contacted: 'bg-purple-500',
      reviewed: 'bg-teal-500',
      archived: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Admin Access Button (Hidden in footer area) */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 left-4 z-40 opacity-30 hover:opacity-100 transition-opacity"
        title="Admin Access (Ctrl+Shift+A)"
      >
        <Lock className="h-4 w-4" />
      </Button>

      {/* Admin Panel Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          {!isAuthenticated ? (
            // Login Form
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-[#1E3A5F] rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl">Admin Login</DialogTitle>
                <DialogDescription>
                  Enter your admin password to access the dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-w-sm mt-6 space-y-4">
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-[#1E3A5F] hover:bg-[#152d4a]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Dashboard
            <div className="flex flex-col h-[80vh]">
              <DialogHeader className="flex-shrink-0 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-[#F97316]" />
                    <DialogTitle>C2 ConcreteBlock Pro Admin</DialogTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </DialogHeader>

              <Tabs defaultValue="products" className="flex-1 overflow-hidden mt-4">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="products" className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="quotes" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Quotes
                  </TabsTrigger>
                  <TabsTrigger value="plans" className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    Plans
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </TabsTrigger>
                </TabsList>

                <div className="overflow-auto flex-1">
                  {/* Products Tab */}
                  <TabsContent value="products">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Products ({products.length})</h3>
                      <Button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            slug: '',
                            description: '',
                            dimensions: '',
                            priceMin: 0,
                            priceMax: 0,
                            category: 'blocks',
                            imageUrl: '',
                            inStock: true,
                            featured: false,
                          });
                          setShowProductForm(true);
                        }}
                        className="bg-[#F97316] hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </div>

                    {showProductForm && (
                      <Card className="mb-4 border-2 border-[#F97316]">
                        <CardHeader>
                          <CardTitle>{editingProduct ? 'Edit Product' : 'New Product'}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={productForm.name}
                              onChange={(e) => {
                                const name = e.target.value;
                                setProductForm((p) => ({
                                  ...p,
                                  name,
                                  slug: name.toLowerCase().replace(/\s+/g, '-'),
                                }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Dimensions</Label>
                            <Input
                              value={productForm.dimensions}
                              onChange={(e) =>
                                setProductForm((p) => ({ ...p, dimensions: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Price Min (GYD)</Label>
                            <Input
                              type="number"
                              value={productForm.priceMin}
                              onChange={(e) =>
                                setProductForm((p) => ({ ...p, priceMin: Number(e.target.value) }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Price Max (GYD)</Label>
                            <Input
                              type="number"
                              value={productForm.priceMax}
                              onChange={(e) =>
                                setProductForm((p) => ({ ...p, priceMax: Number(e.target.value) }))
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              value={productForm.description}
                              onChange={(e) =>
                                setProductForm((p) => ({ ...p, description: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Select
                              value={productForm.category}
                              onValueChange={(v) => setProductForm((p) => ({ ...p, category: v }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blocks">Blocks</SelectItem>
                                <SelectItem value="paving">Paving</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={productForm.imageUrl}
                              onChange={(e) =>
                                setProductForm((p) => ({ ...p, imageUrl: e.target.value }))
                              }
                            />
                          </div>
                          <div className="col-span-2 flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={productForm.inStock}
                                onChange={(e) =>
                                  setProductForm((p) => ({ ...p, inStock: e.target.checked }))
                                }
                              />
                              In Stock
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={productForm.featured}
                                onChange={(e) =>
                                  setProductForm((p) => ({ ...p, featured: e.target.checked }))
                                }
                              />
                              Featured
                            </label>
                          </div>
                          <div className="col-span-2 flex gap-2">
                            <Button onClick={handleSaveProduct} className="bg-[#F97316]">
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => setShowProductForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid gap-4">
                      {products.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              {product.imageUrl && (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <h4 className="font-semibold">{product.name}</h4>
                                <p className="text-sm text-gray-500">{product.dimensions}</p>
                                <p className="text-sm">
                                  ${product.priceMin} - ${product.priceMax} GYD
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {product.inStock && <Badge className="bg-green-500">In Stock</Badge>}
                              {product.featured && <Badge className="bg-[#F97316]">Featured</Badge>}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    name: product.name,
                                    slug: product.slug,
                                    description: product.description,
                                    dimensions: product.dimensions,
                                    priceMin: product.priceMin,
                                    priceMax: product.priceMax,
                                    category: product.category,
                                    imageUrl: product.imageUrl || '',
                                    inStock: product.inStock,
                                    featured: product.featured,
                                  });
                                  setShowProductForm(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Orders Tab */}
                  <TabsContent value="orders">
                    <h3 className="text-lg font-semibold mb-4">Orders ({orders.length})</h3>
                    <div className="grid gap-4">
                      {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                      ) : (
                        orders.map((order) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{order.customerName}</h4>
                                  <p className="text-sm text-gray-500">{order.customerEmail}</p>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  {formatDate(order.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Select
                                    value={order.status}
                                    onValueChange={(v) =>
                                      handleUpdateStatus('orders', order.id, v)
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Quotes Tab */}
                  <TabsContent value="quotes">
                    <h3 className="text-lg font-semibold mb-4">Quote Requests ({quotes.length})</h3>
                    <div className="grid gap-4">
                      {quotes.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No quote requests yet</p>
                      ) : (
                        quotes.map((quote) => (
                          <Card key={quote.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{quote.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {quote.email} | {quote.phone}
                                  </p>
                                  {quote.company && (
                                    <p className="text-sm text-gray-500">{quote.company}</p>
                                  )}
                                </div>
                                <Badge className={getStatusColor(quote.status)}>
                                  {quote.status}
                                </Badge>
                              </div>
                              <p className="text-sm mt-2 line-clamp-2">{quote.message}</p>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {formatDate(quote.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedQuote(quote)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Select
                                    value={quote.status}
                                    onValueChange={(v) =>
                                      handleUpdateStatus('quotes', quote.id, v)
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="reviewed">Reviewed</SelectItem>
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Plans Tab */}
                  <TabsContent value="plans">
                    <h3 className="text-lg font-semibold mb-4">Plan Submissions ({plans.length})</h3>
                    <div className="grid gap-4">
                      {plans.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No plan submissions yet</p>
                      ) : (
                        plans.map((plan) => (
                          <Card key={plan.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{plan.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {plan.email} | {plan.phone}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(plan.status)}>
                                  {plan.status}
                                </Badge>
                              </div>
                              <p className="text-sm mt-2 line-clamp-2">{plan.projectDesc}</p>
                              {plan.fileUrl && (
                                <a
                                  href={plan.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[#F97316] hover:underline flex items-center gap-1 mt-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  {plan.fileName}
                                </a>
                              )}
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {formatDate(plan.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedPlan(plan)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Select
                                    value={plan.status}
                                    onValueChange={(v) =>
                                      handleUpdateStatus('plans', plan.id, v)
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="reviewed">Reviewed</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages">
                    <h3 className="text-lg font-semibold mb-4">Contact Messages ({messages.length})</h3>
                    <div className="grid gap-4">
                      {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No messages yet</p>
                      ) : (
                        messages.map((message) => (
                          <Card key={message.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{message.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {message.email} | {message.phone}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(message.status)}>
                                  {message.status}
                                </Badge>
                              </div>
                              {message.subject && (
                                <p className="text-sm font-medium mt-2">{message.subject}</p>
                              )}
                              <p className="text-sm mt-1 line-clamp-2">{message.message}</p>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {formatDate(message.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedMessage(message)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Select
                                    value={message.status}
                                    onValueChange={(v) =>
                                      handleUpdateStatus('messages', message.id, v)
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="read">Read</SelectItem>
                                      <SelectItem value="replied">Replied</SelectItem>
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Dialogs */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedOrder.company || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-500">
                      {item.unitPrice ? `$${item.unitPrice * item.quantity}` : 'Quote'}
                    </span>
                  </div>
                ))}
              </div>
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedQuote.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedQuote.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedQuote.company || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p>{selectedQuote.message}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedQuote.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>
                {selectedQuote.phone && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`tel:${selectedQuote.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan Submission Details</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedPlan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedPlan.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedPlan.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedPlan.company || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Description</p>
                <p>{selectedPlan.projectDesc}</p>
              </div>
              {selectedPlan.fileUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Attached File</p>
                  <Button asChild variant="outline">
                    <a href={selectedPlan.fileUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      {selectedPlan.fileName}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedMessage.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedMessage.subject || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p>{selectedMessage.message}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
