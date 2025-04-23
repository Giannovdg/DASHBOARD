# Setting Up the Supabase Database

Follow these steps to set up the database for the Business Analytics Dashboard.

## Step 1: Access the Supabase SQL Editor

1. Go to [https://app.supabase.com/](https://app.supabase.com/) and log in
2. Select your project with the URL: `https://kxhmsssbbzvdfdenpovl.supabase.co`
3. In the left sidebar, click on **SQL Editor**
4. Click "New Query" to create a new SQL query

## Step 2: Create the Database Tables

Copy and paste the following SQL into the editor, then click "Run":

```sql
-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  region TEXT NOT NULL,
  product TEXT NOT NULL,
  customer TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  sales_count INTEGER NOT NULL
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  total_spent NUMERIC(10, 2) NOT NULL,
  last_purchase TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## Step 3: Insert Sample Data

After creating the tables, create a new SQL query and paste the following to insert sample data:

```sql
-- Insert sample products if products table is empty
INSERT INTO products (name, category, price, stock, sales_count)
SELECT * FROM (
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
    ('Smart Watch', 'Electronics', 299.99, 25, 680)
) AS new_values
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Insert sample customers if customers table is empty
INSERT INTO customers (name, email, region, total_spent, last_purchase)
SELECT * FROM (
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
    ('Patricia Thomas', 'patricia@example.com', 'Central', 4120.55, NOW() - INTERVAL '5 days')
) AS new_values
WHERE NOT EXISTS (SELECT 1 FROM customers LIMIT 1);
```

## Step 4: Generate Random Sales Data

Finally, create another new SQL query and paste the following to generate random sales data:

```sql
-- Insert sample sales data if sales table is empty
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
  -- Only add sales data if the table is empty
  IF NOT EXISTS (SELECT 1 FROM sales LIMIT 1) THEN
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
  END IF;
END $$;
```

## Step 5: Verify the Data

To verify that your tables and data were created correctly, you can run the following SQL queries:

```sql
-- Check products
SELECT * FROM products;

-- Check customers
SELECT * FROM customers;

-- Check sales
SELECT * FROM sales;
```

## Next Steps

After completing these steps, your Supabase database is set up with the necessary tables and sample data. You can now run the application which will connect to this database using the credentials in your `.env` file. 