# Supabase MCP Authorization Guide

This guide will help you resolve authorization issues with Supabase MCP (Management Command-line Platform) tools.

## Error: Unauthorized

If you encounter an error like this:
```
Error: Unauthorized. Please provide a valid access token to the MCP server via the --access-token flag.
```

This indicates that your Supabase CLI is not properly authenticated.

## Steps to Resolve

### 1. Install Supabase CLI
If you haven't installed the Supabase CLI, install it globally:
```bash
npm install -g supabase
```

### 2. Login to Supabase
The Supabase CLI uses a secure authentication flow:
```bash
npx supabase login
```

This command will open your default browser and prompt you to log in to your Supabase account. Once logged in, the CLI will store your access token securely in your system's credential store.

### 3. Verify Authentication
Check if your authentication is working by listing your projects:
```bash
npx supabase projects list
```

If you see your projects listed, authentication is working correctly.

### 4. For Specific MCP Commands
When using specific MCP commands in this project, you can either:

a) Run the helper scripts provided:
```bash
node supabase-auth.js  # Instructions for authentication
node setup-mcp.js      # Database setup instructions
```

b) Or run the commands directly, for example:
```bash
npx supabase apply-migration -p YOUR_PROJECT_ID --name create_tables --sql "..."
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Troubleshooting

### Token Expiration
If your token has expired, simply run the login command again:
```bash
npx supabase login
```

### Token Not Found
If you're using the CLI in a different environment or terminal than where you logged in, you may need to log in again in that specific environment.

### Programmatic Access
For programmatic access in your application, continue using the client library with your project URL and anon key as defined in your `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://kxhmsssbbzvdfdenpovl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

These are different from the MCP authentication used for CLI administrative tasks.

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli/introduction)
- [Supabase Project & Organization Management](https://supabase.com/docs/reference/cli/supabase-projects) 