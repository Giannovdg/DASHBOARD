// Script to set up Supabase database tables and sample data via MCP
require('dotenv').config();
const { execSync } = require('child_process');

// Supabase project ID will be needed for MCP commands
// You'll need to get this from your Supabase dashboard or through MCP list_projects

console.log('Setting up Supabase database using MCP commands...');

function runMcpCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const result = execSync(command, { encoding: 'utf8' });
    console.log(result);
    return { success: true, result };
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('Please run the following commands manually in your terminal:');
  console.log('\n1. List your Supabase projects to get the project ID:');
  console.log('npx supabase projects list');
  
  console.log('\n2. Once you have your project ID, create the tables:');
  console.log('npx supabase apply-migration -p YOUR_PROJECT_ID --name create_tables --sql "');
  console.log(`
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
  "`);
  
  console.log('\n3. Insert sample products:');
  console.log('npx supabase execute-sql -p YOUR_PROJECT_ID --sql "');
  console.log(`
  INSERT INTO products (name, category, price, stock, sales_count)
  VALUES 
    ('Laptop Pro X', 'Electronics', 1299.99, 45, 1250),
    ('Smartphone Ultra', 'Electronics', 899.99, 78, 2300),
    ('Ergonomic Chair', 'Furniture', 249.99, 32, 870),
    ('Wireless Headphones', 'Electronics', 179.99, 65, 1500),
    ('Coffee Maker', 'Kitchen', 89.99, 50, 950),
    ('Fitness Tracker', 'Electronics', 129.99, 55, 1100),
    ('Desk Lamp', 'Home Goods', 39.99, 120, 680),
    ('Blender', 'Kitchen', 69.99, 42, 520),
    ('Portable Speaker', 'Electronics', 149.99, 30, 780),
    ('Smart Watch', 'Electronics', 299.99, 25, 680);
  "`);
  
  console.log('\n4. Insert sample customers:');
  console.log('npx supabase execute-sql -p YOUR_PROJECT_ID --sql "');
  console.log(`
  INSERT INTO customers (name, email, region, total_spent, last_purchase)
  VALUES
    ('John Smith', 'john@example.com', 'North', 5699.85, NOW() - INTERVAL '5 days'),
    ('Emma Johnson', 'emma@example.com', 'South', 3450.50, NOW() - INTERVAL '2 days'),
    ('Michael Brown', 'michael@example.com', 'East', 8920.25, NOW() - INTERVAL '7 days'),
    ('Sarah Davis', 'sarah@example.com', 'West', 2150.75, NOW() - INTERVAL '1 day'),
    ('David Wilson', 'david@example.com', 'Central', 6780.40, NOW() - INTERVAL '4 days'),
    ('Jennifer Lee', 'jennifer@example.com', 'North', 4350.60, NOW() - INTERVAL '6 days'),
    ('Robert Miller', 'robert@example.com', 'South', 7250.30, NOW() - INTERVAL '3 days'),
    ('Lisa Taylor', 'lisa@example.com', 'East', 3890.15, NOW() - INTERVAL '8 days'),
    ('James Anderson', 'james@example.com', 'West', 5230.70, NOW() - INTERVAL '2 days'),
    ('Patricia Thomas', 'patricia@example.com', 'Central', 4120.55, NOW() - INTERVAL '5 days');
  "`);
  
  console.log('\n5. Insert sample sales data:');
  console.log('npx supabase execute-sql -p YOUR_PROJECT_ID --sql "');
  console.log(`
  DO $$
  DECLARE
    product_names TEXT[] := ARRAY['Laptop Pro X', 'Smartphone Ultra', 'Ergonomic Chair', 'Wireless Headphones', 'Coffee Maker', 'Fitness Tracker', 'Desk Lamp', 'Blender', 'Portable Speaker', 'Smart Watch'];
    regions TEXT[] := ARRAY['North', 'South', 'East', 'West', 'Central'];
    customer_names TEXT[] := ARRAY['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Jennifer Lee', 'Robert Miller', 'Lisa Taylor', 'James Anderson', 'Patricia Thomas'];
    i INTEGER;
    random_product TEXT;
    random_region TEXT;
    random_customer TEXT;
    random_amount NUMERIC(10, 2);
    sale_date TIMESTAMP WITH TIME ZONE;
  BEGIN
    FOR i IN 1..100 LOOP
      -- Select random product, region and customer
      random_product := product_names[floor(random() * array_length(product_names, 1) + 1)];
      random_region := regions[floor(random() * array_length(regions, 1) + 1)];
      random_customer := customer_names[floor(random() * array_length(customer_names, 1) + 1)];
      
      -- Generate random amount between 100 and 2000
      random_amount := (random() * 1900 + 100)::NUMERIC(10, 2);
      
      -- Generate random date within last 30 days
      sale_date := NOW() - (random() * INTERVAL '30 days');
      
      -- Insert sale
      INSERT INTO sales (date, amount, region, product, customer)
      VALUES (sale_date, random_amount, random_region, random_product, random_customer);
    END LOOP;
  END $$;
  "`);
  
  console.log('\n6. Verify the setup:');
  console.log('npx supabase execute-sql -p YOUR_PROJECT_ID --sql "SELECT COUNT(*) FROM products; SELECT COUNT(*) FROM customers; SELECT COUNT(*) FROM sales;"');
  
  console.log('\nNote: Replace YOUR_PROJECT_ID with your actual Supabase project ID in all commands.');
  console.log('You can find your project ID by running: npx supabase projects list');
}

main(); 