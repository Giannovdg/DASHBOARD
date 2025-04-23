// Script to create database tables using direct API
const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials for testing
const supabaseUrl = 'https://kxhmsssbbzvdfdenpovl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aG1zc3NiYnp2ZGZkZW5wb3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTAzODUsImV4cCI6MjA2MDc2NjM4NX0.c_0Vl7bEEpLgjXoU0e0oQ0N8zJykXntBd7slMe7VmOo';

console.log('Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to try creating a table through direct API
async function createTable(tableName, fields) {
  console.log(`Checking if ${tableName} table exists...`);
  
  try {
    // Try to query the table to see if it exists
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`${tableName} table does not exist, proceeding with creation`);
        return true;
      } else {
        console.error(`Error checking ${tableName} table:`, error.message);
        return false;
      }
    } else {
      console.log(`${tableName} table already exists`);
      return false;
    }
  } catch (err) {
    console.error('Exception:', err.message);
    return false;
  }
}

// Function to insert sample products
async function insertProducts() {
  console.log('Inserting sample products...');
  
  const products = [
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
  
  try {
    const { error } = await supabase
      .from('products')
      .insert(products);
    
    if (error) {
      console.error('Error inserting products:', error.message);
    } else {
      console.log('Products inserted successfully');
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

// Function to insert sample customers
async function insertCustomers() {
  console.log('Inserting sample customers...');
  
  // Helper function to create date X days ago
  const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };
  
  const customers = [
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
  
  try {
    const { error } = await supabase
      .from('customers')
      .insert(customers);
    
    if (error) {
      console.error('Error inserting customers:', error.message);
    } else {
      console.log('Customers inserted successfully');
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

// Function to insert sample sales
async function insertSales() {
  console.log('Inserting sample sales...');
  
  // Get products and customers
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('name');
  
  if (productsError) {
    console.error('Error fetching products:', productsError.message);
    return;
  }
  
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('name');
  
  if (customersError) {
    console.error('Error fetching customers:', customersError.message);
    return;
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
    
    try {
      const { error: insertSalesError } = await supabase
        .from('sales')
        .insert(batch);
      
      if (insertSalesError) {
        console.error('Error inserting sales batch:', insertSalesError.message);
      } else {
        console.log(`Inserted sales batch ${i/batchSize + 1}`);
      }
    } catch (err) {
      console.error('Exception:', err.message);
    }
  }
  
  console.log('Sales data insertion completed');
}

// Main function
async function setupDatabase() {
  console.log('Setting up database...');
  
  // Check if tables exist
  const salesTableNeeded = await createTable('sales');
  const productsTableNeeded = await createTable('products');
  const customersTableNeeded = await createTable('customers');
  
  if (salesTableNeeded || productsTableNeeded || customersTableNeeded) {
    console.log('One or more tables need to be created. Please create them manually using the SQL script.');
    console.log('After creating tables, run this script again to insert sample data.');
  } else {
    // Insert sample data
    console.log('All tables exist, inserting sample data...');
    
    // Check if products table is empty
    const { data: productCount, error: productCountError } = await supabase
      .from('products')
      .select('*');
    
    if (productCountError) {
      console.error('Error checking products:', productCountError.message);
    } else if (productCount.length === 0) {
      await insertProducts();
    } else {
      console.log('Products data already exists');
    }
    
    // Check if customers table is empty
    const { data: customerCount, error: customerCountError } = await supabase
      .from('customers')
      .select('*');
    
    if (customerCountError) {
      console.error('Error checking customers:', customerCountError.message);
    } else if (customerCount.length === 0) {
      await insertCustomers();
    } else {
      console.log('Customers data already exists');
    }
    
    // Check if sales table is empty
    const { data: salesCount, error: salesCountError } = await supabase
      .from('sales')
      .select('*');
    
    if (salesCountError) {
      console.error('Error checking sales:', salesCountError.message);
    } else if (salesCount.length === 0) {
      await insertSales();
    } else {
      console.log('Sales data already exists');
    }
    
    console.log('Database setup completed');
  }
}

setupDatabase(); 