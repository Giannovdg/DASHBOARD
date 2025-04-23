'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { CustomerData, SalesData } from '@/lib/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function CustomerDetail() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [customerSales, setCustomerSales] = useState<SalesData[]>([]);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setIsLoading(true);
        
        // Fetch customer details
        const customersResponse = await fetch('/api/dashboard/customers');
        if (!customersResponse.ok) throw new Error('Failed to fetch customer data');
        
        // Fetch sales data
        const salesResponse = await fetch('/api/dashboard/sales');
        if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
        
        const customers = await customersResponse.json();
        const sales = await salesResponse.json();
        
        // Find the specific customer
        const customerData = customers.find((c: CustomerData) => c.id === customerId);
        if (!customerData) {
          throw new Error('Customer not found');
        }
        
        // Filter sales for this customer
        const customerSalesData = sales.filter((sale: SalesData) => {
          // In a real app, you would have a more direct relationship
          // This is a simplified example assuming the customer name is in the sales record
          return sale.customer === customerData.name;
        });
        
        setCustomer(customerData);
        setCustomerSales(customerSalesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load customer data. Please try again later.');
        
        // Mock data for demonstration
        if (!isNaN(customerId)) {
          const mockCustomer: CustomerData = {
            id: customerId,
            name: `Customer ${customerId}`,
            email: `customer${customerId}@example.com`,
            region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
            total_spent: Math.floor(Math.random() * 50000) + 5000,
            last_purchase: new Date(2023, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
          };
          
          // Generate mock sales
          const mockSales: SalesData[] = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            date: new Date(2023, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
            amount: Math.floor(Math.random() * 2000) + 500,
            region: mockCustomer.region,
            product: ['Product A', 'Product B', 'Product C'][Math.floor(Math.random() * 3)],
            customer: mockCustomer.name,
          }));
          
          setCustomer(mockCustomer);
          setCustomerSales(mockSales);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!isNaN(customerId)) {
      fetchCustomerData();
    } else {
      setError('Invalid customer ID');
      setIsLoading(false);
    }
  }, [customerId]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar activeItem="Customers" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Back button */}
              <div className="mb-6">
                <button 
                  onClick={() => router.back()} 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Customers
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              ) : customer ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Info Card */}
                  <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-lg font-medium">{customer.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Region</p>
                            <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {customer.region}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-lg font-medium text-green-600">{formatCurrency(customer.total_spent)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Purchase</p>
                            <p className="text-lg">{formatDate(customer.last_purchase)}</p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <button
                            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
                            onClick={() => {
                              // Edit functionality would go here in a real app
                              alert(`Edit customer: ${customer.name}`);
                            }}
                          >
                            Edit Customer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Sales History */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
                        {customerSales.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {customerSales.map((sale) => (
                                  <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{formatDate(sale.date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{sale.product}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-green-600 font-medium">{formatCurrency(sale.amount)}</div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No purchase history available for this customer.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Stats */}
                    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Customer Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-500">Average Order Value</p>
                            <p className="text-xl font-bold">
                              {customerSales.length > 0
                                ? formatCurrency(
                                    customerSales.reduce((sum, sale) => sum + sale.amount, 0) / customerSales.length
                                  )
                                : '$0'}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-500">Total Orders</p>
                            <p className="text-xl font-bold">{customerSales.length}</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-500">Customer Since</p>
                            <p className="text-xl font-bold">
                              {customerSales.length > 0
                                ? formatDate(
                                    new Date(
                                      Math.min(...customerSales.map(s => new Date(s.date).getTime()))
                                    ).toISOString()
                                  )
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                  Customer not found. Please check the ID and try again.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 