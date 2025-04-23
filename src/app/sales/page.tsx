"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import SalesChart from "@/components/dashboard/SalesChart";
import RegionDistributionChart from "@/components/dashboard/RegionDistributionChart";
import { SalesData } from "@/lib/types";

export default function SalesPage() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else {
      // Fetch sales data or load mock data
      fetchSalesData();
    }
  }, [user, loading, router, salesPeriod]);

  const fetchSalesData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, generating mock data
      const mockSalesData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        date: new Date(2023, 3, i + 1).toISOString(),
        amount: Math.floor(Math.random() * 10000) + 1000,
        region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
        product: ['Product A', 'Product B', 'Product C'][Math.floor(Math.random() * 3)],
        customer: `Customer ${i + 1}`,
      }));
      
      setSalesData(mockSalesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setIsLoading(false);
    }
  };

  // Handle period change for the sales chart
  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setSalesPeriod(period);
  };

  // Calculate total sales by region
  const getSalesByRegion = () => {
    const regions: Record<string, number> = {};
    salesData.forEach(sale => {
      regions[sale.region] = (regions[sale.region] || 0) + sale.amount;
    });
    return Object.entries(regions).map(([region, amount]) => ({ region, amount }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem="Sales" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Sales Analysis</h1>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <SalesChart 
                    data={salesData} 
                    period={salesPeriod}
                    onPeriodChange={handlePeriodChange}
                  />
                </div>
                
                <div>
                  <RegionDistributionChart salesData={salesData} />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Sales Summary</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <p className="text-sm text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold">
                        ${salesData.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="border-b pb-3">
                      <p className="text-sm text-gray-500">Average Order Value</p>
                      <p className="text-2xl font-bold">
                        ${Math.round(salesData.reduce((sum, sale) => sum + sale.amount, 0) / (salesData.length || 1)).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="border-b pb-3">
                      <p className="text-sm text-gray-500">Top Selling Region</p>
                      <p className="text-2xl font-bold">
                        {getSalesByRegion().sort((a, b) => b.amount - a.amount)[0]?.region || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total Transactions</p>
                      <p className="text-2xl font-bold">
                        {salesData.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 