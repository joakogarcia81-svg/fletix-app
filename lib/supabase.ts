import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser/Server compatible Supabase client
// Gracefully handles missing credentials during build/CI
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as ReturnType<typeof createClient>);

if (!supabase) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Fletix Warning: Supabase credentials are not fully configured in your environment. ' +
        'Using mock data fallback.',
    );
  }
}
