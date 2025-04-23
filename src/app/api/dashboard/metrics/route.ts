import { NextResponse } from 'next/server';
import { fetchDashboardMetrics } from '@/lib/api/dashboardService';

export async function GET() {
  try {
    const metrics = await fetchDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
} 