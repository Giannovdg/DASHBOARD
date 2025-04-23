"use client";

import React from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Data Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">User Activity</h3>
                <p className="text-gray-500">Detailed analytics about user engagement and activity patterns.</p>
                <div className="h-64 flex items-center justify-center bg-gray-100 mt-4 rounded">
                  <p className="text-gray-400">User activity chart will appear here</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Conversion Rates</h3>
                <p className="text-gray-500">Track conversion metrics and optimization opportunities.</p>
                <div className="h-64 flex items-center justify-center bg-gray-100 mt-4 rounded">
                  <p className="text-gray-400">Conversion chart will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 