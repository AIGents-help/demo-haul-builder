import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  'https://vcfksbpioimlqmvkrtwb.supabase.co',
  'sb_publishable_bXlF8-82IEMjYc2qzthnfQ_PmxZxsPt',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabase;
