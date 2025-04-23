# Business Analytics Dashboard

A real-time data analytics and visualization tool for businesses, built with Next.js, Supabase, and Recharts.

## Features

- Real-time data visualization with interactive charts
- Sales performance tracking by time period and region
- Product inventory and performance analysis
- Responsive design for desktop and mobile
- Secured with Supabase authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account

### Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd business-analytics-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up Supabase
   - Create a new Supabase project
   - Create the necessary tables (see Database Setup below)
   - Copy your Supabase URL and anon key

4. Set up environment variables
   - Duplicate `.env` to `.env.local`
   - Update the values with your Supabase credentials
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application requires a Supabase database with the following tables:
- `sales` - for storing sales transactions
- `products` - for product information
- `customers` - for customer information

You can set up the database in one of two ways:

### Option 1: Manual Setup (Recommended)

Follow the detailed instructions in the [Supabase Setup Guide](./supabase-setup-guide.md) to:
1. Create the necessary tables
2. Insert sample product and customer data
3. Generate random sales data

### Option 2: Automatic Setup

If you prefer, you can also set up the database programmatically:

```bash
# First ensure you have the required dependencies
npm install

# Then run the database setup script
node scripts/create-tables-direct.js
```

Note: The automatic setup requires proper authentication with your Supabase project.

## Development

### Folder Structure

- `src/app`: Next.js App Router pages
- `src/components`: React components
- `src/lib`: Utilities, hooks, and context providers
- `src/lib/api`: API service functions
- `src/lib/supabase`: Supabase client and utilities
- `src/lib/types`: TypeScript type definitions

## License

MIT