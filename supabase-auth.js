// Script to authenticate with Supabase CLI
const { execSync } = require('child_process');

console.log('=== Supabase CLI Authentication Helper ===');
console.log('This script will help you authenticate with Supabase CLI');
console.log('\nFollow these steps:');

console.log('\n1. First, install the Supabase CLI if you haven\'t already:');
console.log('npm install -g supabase');

console.log('\n2. To login to Supabase, run:');
console.log('npx supabase login');
console.log('(This will open a browser where you can authorize the CLI)');

console.log('\n3. After logging in, you can verify your authentication by listing your projects:');
console.log('npx supabase projects list');

console.log('\n4. If you see your projects listed, your authentication is working correctly.');
console.log('   If you encounter "Unauthorized" errors, try running "npx supabase login" again.');

console.log('\n5. Once authenticated, you can run the setup-mcp.js script to set up your database:');
console.log('node setup-mcp.js');

console.log('\nNote: The Supabase CLI stores access tokens in your system\'s credential store.');
console.log('This is more secure than storing tokens in environment variables or config files.'); 