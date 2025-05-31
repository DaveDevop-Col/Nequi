// fuente/clienteSupabase.js
 import { createClient } from '@supabase/supabase-js'; // Descomentar cuando se conecte a Supabase


const SUPABASE_URL = 'https://ijdelzuybszzvtfdhdvo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZGVsenV5YnN6enZ0ZmRoZHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTk0MTgsImV4cCI6MjA2MzczNTQxOH0.HPGDuHHbuwOZvTOEiVsFGY1JNBu-6O6wPyYYbfmgb7o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

