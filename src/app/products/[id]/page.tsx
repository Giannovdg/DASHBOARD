'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { ProductData, SalesData } from '@/lib/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [productSales, setProductSales] = useState<SalesData[]>([]);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true);
        
        // Fetch product details
        const productsResponse = await fetch('/api/dashboard/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch product data');
        
        // Fetch sales data
        const salesResponse = await fetch('/api/dashboard/sales');
        if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
        
        const products = await productsResponse.json();
        const sales = await salesResponse.json();
        
        // Find the specific product
        const productData = products.find((p: ProductData) => p.id === productId);
        if (!productData) {
          throw new Error('Product not found');
        }
        
        // Filter sales for this product
        const productSalesData = sales.filter((sale: SalesData) => {
          // In a real app, you would have a more direct relationship
          // This is a simplified example assuming the product name is in the sales record
          return sale.product === productData.name;
        });
        
        setProduct(productData);
        setProductSales(productSalesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data. Please try again later.');
        
        // Mock data for demonstration
        if (!isNaN(productId)) {
          const mockProduct: ProductData = {
            id: productId,
            name: `Product ${String.fromCharCode(65 + (productId % 26))}`,
            category: ['Electronics', 'Clothing', 'Food', 'Home Goods'][Math.floor(Math.random() * 4)],
            price: Math.floor(Math.random() * 500) + 50,
            stock: Math.floor(Math.random() * 100) + 10,
            sales_count: Math.floor(Math.random() * 1000) + 100,
          };
          
          // Generate mock sales
          const mockSales: SalesData[] = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            date: new Date(2023, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
            amount: mockProduct.price * (Math.floor(Math.random() * 3) + 1),
            region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
            product: mockProduct.name,
            customer: `Customer ${Math.floor(Math.random() * 20) + 1}`,
          }));
          
          setProduct(mockProduct);
          setProductSales(mockSales);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!isNaN(productId)) {
      fetchProductData();
    } else {
      setError('Invalid product ID');
      setIsLoading(false);
    }
  }, [productId]);

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

  // Calculate total revenue from sales
  const totalRevenue = productSales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar activeItem="Products" />
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
                  Back to Products
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
              ) : product ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Info Card */}
                  <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Product Information</h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-lg font-medium">{product.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-medium text-blue-600">{formatCurrency(product.price)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Stock</p>
                            <p className={`text-lg font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                              {product.stock} {product.stock < 10 && <span className="text-sm font-normal text-red-500">(Low stock!)</span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Sales</p>
                            <p className="text-lg font-medium">{product.sales_count} units</p>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                          <button
                            className="bg-blue-600 text-white flex-1 py-2 rounded-md hover:bg-blue-700"
                            onClick={() => {
                              // Edit functionality would go here in a real app
                              alert(`Edit product: ${product.name}`);
                            }}
                          >
                            Edit Product
                          </button>
                          <button
                            className="bg-green-600 text-white flex-1 py-2 rounded-md hover:bg-green-700"
                            onClick={() => {
                              // Add stock functionality would go here in a real app
                              alert(`Add stock to: ${product.name}`);
                            }}
                          >
                            Add Stock
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Analytics and Sales */}
                  <div className="md:col-span-2">
                    {/* Product Stats */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Product Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-500">Total Revenue</p>
                            <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-500">Profit Margin</p>
                            <p className="text-xl font-bold">
                              {Math.floor(Math.random() * 25) + 15}%
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-500">Restock Needed</p>
                            <p className="text-xl font-bold">
                              {product.stock < 20 ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sales History */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                        {productSales.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Region
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {productSales.map((sale) => (
                                  <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{formatDate(sale.date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                                           onClick={() => {
                                             // Navigate to customer details in a real app
                                             // Here we'll just show an alert
                                             alert(`View customer: ${sale.customer}`);
                                           }}
                                      >
                                        {sale.customer}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {sale.region}
                                      </span>
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
                            No recent orders for this product.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                  Product not found. Please check the ID and try again.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 