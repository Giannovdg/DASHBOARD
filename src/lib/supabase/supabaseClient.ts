import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create a Supabase client for use in client components
export const supabaseClient = createClientComponentClient();

export default supabaseClient; 