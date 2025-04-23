'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { CustomerData } from '@/lib/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { createCustomer, deleteCustomer, fetchCustomerData } from '@/lib/api/dashboardService';

export default function Customers() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    region: '',
    total_spent: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = ['All', 'North', 'South', 'East', 'West', 'Central'];

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true);
        const customerData = await fetchCustomerData();
        setCustomers(customerData);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again later.');
        
        // Fallback to mock data for demo purposes
        const mockCustomerData: CustomerData[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
          total_spent: Math.floor(Math.random() * 50000) + 5000,
          last_purchase: new Date(2023, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
        }));
        
        setCustomers(mockCustomerData);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit to Supabase via API
      const customerToAdd = {
        ...newCustomer,
        last_purchase: new Date().toISOString()
      };
      
      const createdCustomer = await createCustomer(customerToAdd);
      
      if (createdCustomer) {
        // Add to local state if successful
        setCustomers([...customers, createdCustomer]);
        setNewCustomer({ name: '', email: '', region: '', total_spent: 0 });
        setShowAddModal(false);
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      alert('Failed to add customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      const success = await deleteCustomer(id);
      
      if (success) {
        // Remove from local state if successful
        setCustomers(customers.filter(customer => customer.id !== id));
      } else {
        throw new Error('Failed to delete customer');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please try again.');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || customer.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Customers</h1>
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <select
                    className="border rounded-lg px-4 py-2"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Customer
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Region
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Spent
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Purchase
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-900">
                                <div className="text-sm font-medium">{customer.name}</div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {customer.region}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(customer.total_spent)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(customer.last_purchase)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => {
                                  // Edit functionality would go here in a real app
                                  alert(`Edit customer: ${customer.name}`);
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Region
                </label>
                <select
                  id="region"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newCustomer.region}
                  onChange={(e) => setNewCustomer({ ...newCustomer, region: e.target.value })}
                >
                  <option value="">Select a region</option>
                  {regions.filter(r => r !== 'All').map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="total_spent" className="block text-sm font-medium text-gray-700">
                  Initial Total Spent ($)
                </label>
                <input
                  type="number"
                  id="total_spent"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newCustomer.total_spent}
                  onChange={(e) => setNewCustomer({ ...newCustomer, total_spent: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleAddCustomer}
                disabled={!newCustomer.name || !newCustomer.email || !newCustomer.region || isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 