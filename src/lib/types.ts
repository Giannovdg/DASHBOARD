export interface SalesData {
  id: number;
  date: string;
  amount: number;
  region: string;
  product: string;
  customer: string;
}

export interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales_count: number;
}

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  region: string;
  total_spent: number;
  last_purchase: string;
}

export interface DashboardMetrics {
  totalSales: number;
  averageOrderValue: number;
  totalCustomers: number;
  topSellingProducts: ProductData[];
}

export interface ChartData {
  name: string;
  value: number;
} 