// Simple script to test Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Executing a simple query...');
    
    // Try to get the current timestamp from Supabase
    const { data, error } = await supabase.rpc('get_timestamp');
    
    if (error) {
      console.error('Connection error:', error);
      
      // Try another approach with a simple select query
      console.log('Trying an alternative approach...');
      const { data: version, error: versionError } = await supabase
        .from('_dummy_query_for_version')
        .select('version()')
        .limit(1)
        .single();
      
      if (versionError) {
        console.error('Alternative approach failed:', versionError);
        console.log('Testing direct connection to public schema...');
        
        const { error: schemaError } = await supabase
          .from('pg_tables')
          .select('schemaname, tablename')
          .limit(1);
        
        if (schemaError) {
          console.error('Schema query failed:', schemaError);
          console.log('Connection test failed. Check your Supabase credentials.');
        } else {
          console.log('Connection successful using schema query!');
        }
      } else {
        console.log('Connection successful using alternative approach!');
        console.log('Version:', version);
      }
    } else {
      console.log('Connection successful!');
      console.log('Current timestamp:', data);
    }
  } catch (err) {
    console.error('Unexpected error during connection test:', err);
  }
}

testConnection(); 