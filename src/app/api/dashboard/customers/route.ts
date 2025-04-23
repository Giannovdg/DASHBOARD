import { NextResponse } from 'next/server';
import { fetchCustomerData, createCustomer, deleteCustomer } from '@/lib/api/dashboardService';

export async function GET() {
  try {
    const customerData = await fetchCustomerData();
    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json();
    const createdCustomer = await createCustomer(customerData);
    
    if (!createdCustomer) {
      throw new Error('Failed to create customer');
    }
    
    return NextResponse.json(createdCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteCustomer(Number(id));
    
    if (!success) {
      throw new Error('Failed to delete customer');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 