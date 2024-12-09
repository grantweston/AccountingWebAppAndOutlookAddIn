import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/utils/environment';

const { url, key } = getSupabaseConfig();

export const supabase = createClient(url, key); 