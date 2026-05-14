import { createClient } from '@supabase/supabase-js';

// Мы будем использовать переменные из .env.local файла
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing in .env.local');
}

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);