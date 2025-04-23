# Supabase Database Setup Guide

This guide explains how to manually set up the required database tables and sample data for the Business Analytics Dashboard.

## Prerequisites

- Supabase project with the following credentials:
  - URL: https://kxhmsssbbzvdfdenpovl.supabase.co
  - Anon Key: Already configured in .env file

## Steps to Set Up the Database

1. Open your Supabase project dashboard by going to https://app.supabase.com/ and selecting your project.

2. Navigate to the SQL Editor in the left sidebar.

3. Click "New Query" to create a new SQL query.

4. Copy and paste the contents of the `supabase-setup.sql` file into the SQL editor.

5. Click "Run" to execute the SQL commands.

6. The script will:
   - Create the `sales`, `products`, and `customers` tables if they don't already exist
   - Insert sample product data (10 products) if the products table is empty
   - Insert sample customer data (10 customers) if the customers table is empty
   - Insert 100 random sales records with various amounts, regions, and dates from the last 30 days if the sales table is empty

7. You can verify the data was created correctly by running the following queries in separate SQL editors:
   ```sql
   SELECT * FROM products;
   SELECT * FROM customers;
   SELECT * FROM sales;
   ```

## Database Schema

### Sales Table
- `id`: Serial primary key
- `date`: Timestamp with timezone
- `amount`: Numeric(10,2)
- `region`: Text
- `product`: Text
- `customer`: Text

### Products Table
- `id`: Serial primary key
- `name`: Text
- `category`: Text
- `price`: Numeric(10,2)
- `stock`: Integer
- `sales_count`: Integer

### Customers Table
- `id`: Serial primary key
- `name`: Text
- `email`: Text
- `region`: Text
- `total_spent`: Numeric(10,2)
- `last_purchase`: Timestamp with timezone

## Troubleshooting

If you encounter any issues:

1. Check that you have the correct permissions in your Supabase project.
2. Ensure there are no existing tables with the same names but different schemas.
3. Check the SQL console for any error messages.
4. If necessary, you can drop existing tables using:
   ```sql
   DROP TABLE IF EXISTS sales;
   DROP TABLE IF EXISTS products;
   DROP TABLE IF EXISTS customers;
   ```
   And then run the setup script again. 