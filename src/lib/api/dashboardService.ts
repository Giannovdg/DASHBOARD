import supabase from '../supabase/supabaseClient';
import { SalesData, ProductData, CustomerData, DashboardMetrics } from '../types';

export async function fetchSalesData(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<SalesData[]> {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchProductData(): Promise<ProductData[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sales_count', { ascending: false });
  
  if (error) {
    console.error('Error fetching product data:', error);
    return [];
  }
  
  return data || [];
}

export async function createProduct(product: Omit<ProductData, 'id'>): Promise<ProductData | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, sales_count: product.sales_count || 0 }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  return data;
}

export async function updateProduct(id: number, product: Partial<Omit<ProductData, 'id'>>): Promise<ProductData | null> {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return data;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
}

export async function fetchCustomerData(): Promise<CustomerData[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('total_spent', { ascending: false });
  
  if (error) {
    console.error('Error fetching customer data:', error);
    return [];
  }
  
  return data || [];
}

export async function createCustomer(customer: Omit<CustomerData, 'id'>): Promise<CustomerData | null> {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ ...customer }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    return null;
  }
  
  return data;
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
  
  return true;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const salesData = await fetchSalesData();
  const productData = await fetchProductData();
  const customerData = await fetchCustomerData();
  
  const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const averageOrderValue = totalSales / (salesData.length || 1);
  const totalCustomers = customerData.length;
  const topSellingProducts = productData.slice(0, 5);
  
  return {
    totalSales,
    averageOrderValue,
    totalCustomers,
    topSellingProducts,
  };
} 