'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import SalesChart from '@/components/dashboard/SalesChart';
import ProductsTable from '@/components/dashboard/ProductsTable';
import RegionDistributionChart from '@/components/dashboard/RegionDistributionChart';
import { SalesData, ProductData, CustomerData, DashboardMetrics } from '@/lib/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function Dashboard() {
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    metrics: DashboardMetrics;
    salesData: SalesData[];
    productData: ProductData[];
    customerData: CustomerData[];
  }>({
    metrics: {
      totalSales: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      topSellingProducts: [],
    },
    salesData: [],
    productData: [],
    customerData: [],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch metrics
        const metricsResponse = await fetch('/api/dashboard/metrics');
        if (!metricsResponse.ok) throw new Error('Failed to fetch metrics');
        
        // Fetch sales data
        const salesResponse = await fetch(`/api/dashboard/sales?period=${salesPeriod}`);
        if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
        
        // Fetch product data
        const productsResponse = await fetch('/api/dashboard/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch product data');
        
        // Fetch customer data
        const customersResponse = await fetch('/api/dashboard/customers');
        if (!customersResponse.ok) throw new Error('Failed to fetch customer data');
        
        // Parse all responses
        const metrics = await metricsResponse.json();
        const salesData = await salesResponse.json();
        const productData = await productsResponse.json();
        const customerData = await customersResponse.json();
        
        // Update state with fetched data
        setDashboardData({
          metrics,
          salesData,
          productData,
          customerData,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [salesPeriod]);

  // For demo purposes, if no data is available yet
  useEffect(() => {
    if (dashboardData.salesData.length === 0) {
      // Mock data for demonstration
      const mockSalesData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        date: new Date(2023, 3, i + 1).toISOString(),
        amount: Math.floor(Math.random() * 10000) + 1000,
        region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
        product: ['Product A', 'Product B', 'Product C'][Math.floor(Math.random() * 3)],
        customer: `Customer ${i + 1}`,
      }));
      
      const mockProductData: ProductData[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${String.fromCharCode(65 + i)}`,
        category: ['Electronics', 'Clothing', 'Food', 'Home Goods'][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 500) + 50,
        stock: Math.floor(Math.random() * 100) + 10,
        sales_count: Math.floor(Math.random() * 1000) + 100,
      }));
      
      const mockCustomerData: CustomerData[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
        total_spent: Math.floor(Math.random() * 50000) + 5000,
        last_purchase: new Date(2023, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
      }));
      
      const totalSales = mockSalesData.reduce((sum, sale) => sum + sale.amount, 0);
      
      setDashboardData({
        metrics: {
          totalSales,
          averageOrderValue: totalSales / mockSalesData.length,
          totalCustomers: mockCustomerData.length,
          topSellingProducts: mockProductData.slice(0, 5),
        },
        salesData: mockSalesData,
        productData: mockProductData,
        customerData: mockCustomerData,
      });
      
      setIsLoading(false);
    }
  }, [dashboardData.salesData.length]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar activeItem="Dashboard" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              ) : (
                <>
                  {/* Metrics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <MetricCard
                      title="Total Sales"
                      value={formatCurrency(dashboardData.metrics.totalSales)}
                      trend={{ value: 12.5, isPositive: true }}
                    />
                    <MetricCard
                      title="Average Order Value"
                      value={formatCurrency(dashboardData.metrics.averageOrderValue)}
                      trend={{ value: 3.2, isPositive: true }}
                    />
                    <MetricCard
                      title="Customers"
                      value={dashboardData.metrics.totalCustomers}
                      trend={{ value: 5.8, isPositive: true }}
                    />
                    <MetricCard
                      title="Conversion Rate"
                      value="24.3%"
                      trend={{ value: 1.5, isPositive: false }}
                    />
                  </div>
                  
                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <SalesChart
                        data={dashboardData.salesData}
                        period={salesPeriod}
                        onPeriodChange={setSalesPeriod}
                      />
                    </div>
                    <div>
                      <RegionDistributionChart salesData={dashboardData.salesData} />
                    </div>
                  </div>
                  
                  {/* Products Table */}
                  <div className="mb-6">
                    <ProductsTable products={dashboardData.productData} />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
