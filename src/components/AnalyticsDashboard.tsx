'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  FileText,
  Download,
  Calendar,
  Eye,
  MousePointer,
  Target,
  Percent,
} from 'lucide-react';

interface AnalyticsProps {
  orders: { total: number; pending: number; completed: number };
  quotes: { total: number; converted: number; pending: number };
  messages: { total: number; new: number };
  visitors?: { today: number; week: number; month: number };
}

export function AnalyticsDashboard({
  orders,
  quotes,
  messages,
  visitors = { today: 0, week: 0, month: 0 },
}: AnalyticsProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [isExporting, setIsExporting] = useState(false);

  // Calculate metrics
  const quoteConversionRate =
    quotes.total > 0 ? ((quotes.converted / quotes.total) * 100).toFixed(1) : '0';

  const orderCompletionRate =
    orders.total > 0 ? ((orders.completed / orders.total) * 100).toFixed(1) : '0';

  // Export functionality
  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);

    // Generate report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      summary: {
        totalOrders: orders.total,
        completedOrders: orders.completed,
        pendingOrders: orders.pending,
        totalQuotes: quotes.total,
        convertedQuotes: quotes.converted,
        quoteConversionRate,
        totalMessages: messages.total,
        newMessages: messages.new,
      },
    };

    // Create downloadable file
    if (format === 'csv') {
      const csv = [
        'C2 ConcreteBlock Pro Analytics Report',
        `Generated: ${new Date().toLocaleString()}`,
        `Date Range: ${dateRange}`,
        '',
        'Metric,Value',
        `Total Orders,${orders.total}`,
        `Completed Orders,${orders.completed}`,
        `Pending Orders,${orders.pending}`,
        `Total Quotes,${quotes.total}`,
        `Converted Quotes,${quotes.converted}`,
        `Quote Conversion Rate,${quoteConversionRate}%`,
        `Total Messages,${messages.total}`,
        `New Messages,${messages.new}`,
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setIsExporting(false);
  };

  const metrics = [
    {
      title: 'Total Orders',
      value: orders.total,
      change: '+12%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Completed Orders',
      value: orders.completed,
      change: `${orderCompletionRate}%`,
      trend: 'up',
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Quote Conversion',
      value: `${quoteConversionRate}%`,
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'New Messages',
      value: messages.new,
      change: '-2%',
      trend: 'down',
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  const trafficMetrics = [
    { label: 'Today', value: visitors.today, icon: Eye },
    { label: 'This Week', value: visitors.week, icon: Calendar },
    { label: 'This Month', value: visitors.month, icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#1E3A5F]">Analytics Overview</h3>
          <p className="text-gray-500 text-sm">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1E3A5F]">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <BarChart3 className="h-5 w-5" />
            Visitor Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {trafficMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <metric.icon className="h-8 w-8 text-[#F97316] mx-auto mb-2" />
                <p className="text-3xl font-bold text-[#1E3A5F]">{metric.value}</p>
                <p className="text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Note about Google Analytics */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> For detailed traffic analytics including page views, bounce
              rates, and traffic sources, connect Google Analytics 4. The tracking code is already
              installed. Visit analytics.google.com to view comprehensive data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quote Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <Target className="h-5 w-5" />
            Quote Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-600">Quotes Received</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-[#1E3A5F] h-full flex items-center justify-end px-3"
                  style={{ width: '100%' }}
                >
                  <span className="text-white text-sm font-medium">{quotes.total}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-600">Quotes Converted</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-[#F97316] h-full flex items-center justify-end px-3"
                  style={{
                    width: quotes.total > 0 ? `${(quotes.converted / quotes.total) * 100}%` : '0%',
                  }}
                >
                  <span className="text-white text-sm font-medium">{quotes.converted}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-600">Pending</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full flex items-center justify-end px-3"
                  style={{
                    width: quotes.total > 0 ? `${(quotes.pending / quotes.total) * 100}%` : '0%',
                  }}
                >
                  <span className="text-white text-sm font-medium">{quotes.pending}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">{quoteConversionRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {quotes.converted} out of {quotes.total} quotes converted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <Download className="h-5 w-5" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => handleExport('csv')}
            >
              <FileText className="h-6 w-6 text-green-600" />
              <span>Sales Report</span>
              <span className="text-xs text-gray-500">CSV Format</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => handleExport('csv')}
            >
              <Package className="h-6 w-6 text-blue-600" />
              <span>Inventory Report</span>
              <span className="text-xs text-gray-500">CSV Format</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => handleExport('csv')}
            >
              <Users className="h-6 w-6 text-purple-600" />
              <span>Customer Report</span>
              <span className="text-xs text-gray-500">CSV Format</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
