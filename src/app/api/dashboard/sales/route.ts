import { NextResponse } from 'next/server';
import { fetchSalesData } from '@/lib/api/dashboardService';

export async function GET(request: Request) {
  try {
    // Get period from the query params if specified
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | null;
    
    const salesData = await fetchSalesData(period || 'monthly');
    return NextResponse.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
} 