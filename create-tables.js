// Script to create database tables
const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials for testing
const supabaseUrl = 'https://kxhmsssbbzvdfdenpovl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aG1zc3NiYnp2ZGZkZW5wb3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTAzODUsImV4cCI6MjA2MDc2NjM4NX0.c_0Vl7bEEpLgjXoU0e0oQ0N8zJykXntBd7slMe7VmOo';

console.log('Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create tables
async function createTables() {
  console.log('Creating tables...');
  
  try {
    // Create sales table
    console.log('Creating sales table...');
    const { error: salesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sales (
          id SERIAL PRIMARY KEY,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          amount NUMERIC(10, 2) NOT NULL,
          region TEXT NOT NULL,
          product TEXT NOT NULL,
          customer TEXT NOT NULL
        );
      `
    });
    
    if (salesError) {
      console.error('Error creating sales table:', salesError.message);
    } else {
      console.log('Sales table created successfully');
    }
    
    // Create products table
    console.log('Creating products table...');
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          stock INTEGER NOT NULL,
          sales_count INTEGER NOT NULL
        );
      `
    });
    
    if (productsError) {
      console.error('Error creating products table:', productsError.message);
    } else {
      console.log('Products table created successfully');
    }
    
    // Create customers table
    console.log('Creating customers table...');
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
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
    
    if (customersError) {
      console.error('Error creating customers table:', customersError.message);
    } else {
      console.log('Customers table created successfully');
    }
    
  } catch (err) {
    console.error('Exception:', err.message);
  }
  
  console.log('Table creation completed');
}

// Run the function
createTables(); 