// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials for testing
const supabaseUrl = 'https://kxhmsssbbzvdfdenpovl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aG1zc3NiYnp2ZGZkZW5wb3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTAzODUsImV4cCI6MjA2MDc2NjM4NX0.c_0Vl7bEEpLgjXoU0e0oQ0N8zJykXntBd7slMe7VmOo';

console.log('Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test function
async function testConnection() {
  console.log('Testing connection...');
  
  try {
    const { data, error } = await supabase
      .from('_postgres_stats')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
  
  console.log('Test completed');
}

// Run the test
testConnection(); 