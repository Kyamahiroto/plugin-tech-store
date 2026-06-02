import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crtjfemyudugyabuulas.supabase.co';
const supabaseAnonKey = 'sb_publishable_kLEIdOsLYse0Bu2Lh3chBg_HOqjm8cn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
