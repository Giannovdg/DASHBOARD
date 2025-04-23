// Script to set up Supabase database tables and sample data
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in .env file');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Connecting to Supabase...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    // Test connection
    const { data, error } = await supabase.from('products').select('count').maybeSingle();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Products table does not exist. Creating tables...');
        
        // Create tables using SQL
        const createTablesResult = await supabase.rpc('exec_sql', {
          sql: `
            -- Create sales table if not exists
            CREATE TABLE IF NOT EXISTS sales (
              id SERIAL PRIMARY KEY,
              date TIMESTAMP WITH TIME ZONE NOT NULL,
              amount NUMERIC(10, 2) NOT NULL,
              region TEXT NOT NULL,
              product TEXT NOT NULL,
              customer TEXT NOT NULL
            );

            -- Create products table if not exists
            CREATE TABLE IF NOT EXISTS products (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              category TEXT NOT NULL,
              price NUMERIC(10, 2) NOT NULL,
              stock INTEGER NOT NULL,
              sales_count INTEGER NOT NULL
            );

            -- Create customers table if not exists
            CREATE TABLE IF NOT EXISTS customers (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              region TEXT NOT NULL,
              total_spent NUMERIC(10, 2) NOT NULL,
              last_purchase TIMESTAMP WITH TIME ZONE NOT NULL
            );
          `
        });
        
        if (createTablesResult.error) {
          throw new Error(`Error creating tables: ${createTablesResult.error.message}`);
        }
        
        console.log('Tables created successfully');
      } else {
        throw new Error(`Error connecting to Supabase: ${error.message}`);
      }
    } else {
      console.log('Connected to Supabase successfully');
      console.log('Products table already exists');
    }

    return true;
  } catch (err) {
    console.error('Error:', err.message);
    return false;
  }
}

async function insertSampleData() {
  try {
    // Insert sample products
    const { data: existingProducts, error: productsCheckError } = await supabase
      .from('products')
      .select('count');
    
    if (productsCheckError) {
      throw new Error(`Error checking products: ${productsCheckError.message}`);
    }
    
    if (existingProducts.length === 0) {
      console.log('Inserting sample product data...');
      
      const productSampleData = [
        { name: 'Laptop Pro X', category: 'Electronics', price: 1299.99, stock: 45, sales_count: 1250 },
        { name: 'Smartphone Ultra', category: 'Electronics', price: 899.99, stock: 78, sales_count: 2300 },
        { name: 'Ergonomic Chair', category: 'Furniture', price: 249.99, stock: 32, sales_count: 870 },
        { name: 'Wireless Headphones', category: 'Electronics', price: 179.99, stock: 65, sales_count: 1500 },
        { name: 'Coffee Maker', category: 'Kitchen', price: 89.99, stock: 50, sales_count: 950 },
        { name: 'Fitness Tracker', category: 'Electronics', price: 129.99, stock: 55, sales_count: 1100 },
        { name: 'Desk Lamp', category: 'Home Goods', price: 39.99, stock: 120, sales_count: 680 },
        { name: 'Blender', category: 'Kitchen', price: 69.99, stock: 42, sales_count: 520 },
        { name: 'Portable Speaker', category: 'Electronics', price: 149.99, stock: 30, sales_count: 780 },
        { name: 'Smart Watch', category: 'Electronics', price: 299.99, stock: 25, sales_count: 680 }
      ];
      
      const { error: insertProductsError } = await supabase
        .from('products')
        .insert(productSampleData);
      
      if (insertProductsError) {
        throw new Error(`Error inserting products: ${insertProductsError.message}`);
      }
      
      console.log('Sample product data inserted');
    } else {
      console.log('Products data already exists');
    }
    
    // Insert sample customers
    const { data: existingCustomers, error: customersCheckError } = await supabase
      .from('customers')
      .select('count');
    
    if (customersCheckError) {
      throw new Error(`Error checking customers: ${customersCheckError.message}`);
    }
    
    if (existingCustomers.length === 0) {
      console.log('Inserting sample customer data...');
      
      // Helper function to create date X days ago
      const daysAgo = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString();
      };
      
      const customerSampleData = [
        { name: 'John Smith', email: 'john@example.com', region: 'North', total_spent: 5699.85, last_purchase: daysAgo(5) },
        { name: 'Emma Johnson', email: 'emma@example.com', region: 'South', total_spent: 3450.50, last_purchase: daysAgo(2) },
        { name: 'Michael Brown', email: 'michael@example.com', region: 'East', total_spent: 8920.25, last_purchase: daysAgo(7) },
        { name: 'Sarah Davis', email: 'sarah@example.com', region: 'West', total_spent: 2150.75, last_purchase: daysAgo(1) },
        { name: 'David Wilson', email: 'david@example.com', region: 'Central', total_spent: 6780.40, last_purchase: daysAgo(4) },
        { name: 'Jennifer Lee', email: 'jennifer@example.com', region: 'North', total_spent: 4350.60, last_purchase: daysAgo(6) },
        { name: 'Robert Miller', email: 'robert@example.com', region: 'South', total_spent: 7250.30, last_purchase: daysAgo(3) },
        { name: 'Lisa Taylor', email: 'lisa@example.com', region: 'East', total_spent: 3890.15, last_purchase: daysAgo(8) },
        { name: 'James Anderson', email: 'james@example.com', region: 'West', total_spent: 5230.70, last_purchase: daysAgo(2) },
        { name: 'Patricia Thomas', email: 'patricia@example.com', region: 'Central', total_spent: 4120.55, last_purchase: daysAgo(5) }
      ];
      
      const { error: insertCustomersError } = await supabase
        .from('customers')
        .insert(customerSampleData);
      
      if (insertCustomersError) {
        throw new Error(`Error inserting customers: ${insertCustomersError.message}`);
      }
      
      console.log('Sample customer data inserted');
    } else {
      console.log('Customers data already exists');
    }
    
    // Generate and insert sample sales data
    const { data: existingSales, error: salesCheckError } = await supabase
      .from('sales')
      .select('count');
    
    if (salesCheckError) {
      throw new Error(`Error checking sales: ${salesCheckError.message}`);
    }
    
    if (existingSales.length === 0) {
      console.log('Inserting sample sales data...');
      
      // Get products and customers
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('name');
      
      if (productsError) {
        throw new Error(`Error fetching products: ${productsError.message}`);
      }
      
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('name');
      
      if (customersError) {
        throw new Error(`Error fetching customers: ${customersError.message}`);
      }
      
      const regions = ['North', 'South', 'East', 'West', 'Central'];
      const salesData = [];
      
      // Generate random sales data
      for (let i = 0; i < 100; i++) {
        const randomProductIndex = Math.floor(Math.random() * products.length);
        const randomCustomerIndex = Math.floor(Math.random() * customers.length);
        const randomRegionIndex = Math.floor(Math.random() * regions.length);
        
        // Random amount between 100 and 2000
        const amount = +(Math.random() * 1900 + 100).toFixed(2);
        
        // Random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        salesData.push({
          date: date.toISOString(),
          amount: amount,
          region: regions[randomRegionIndex],
          product: products[randomProductIndex].name,
          customer: customers[randomCustomerIndex].name
        });
      }
      
      // Insert sales data in batches
      const batchSize = 20;
      
      for (let i = 0; i < salesData.length; i += batchSize) {
        const batch = salesData.slice(i, i + batchSize);
        
        const { error: insertSalesError } = await supabase
          .from('sales')
          .insert(batch);
        
        if (insertSalesError) {
          throw new Error(`Error inserting sales batch: ${insertSalesError.message}`);
        }
      }
      
      console.log('Sample sales data inserted');
    } else {
      console.log('Sales data already exists');
    }
    
    return true;
  } catch (err) {
    console.error('Error:', err.message);
    return false;
  }
}

async function main() {
  const tablesCreated = await createTables();
  
  if (tablesCreated) {
    await insertSampleData();
    console.log('Database setup completed');
  }
}

main(); 