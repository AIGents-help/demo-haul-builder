import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = 'https://vcfksbpioimlqmvkrtwb.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_bXlF8-82IEMjYc2qzthnfQ_PmxZxsPt';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabase;
