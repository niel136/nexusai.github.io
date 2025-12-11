import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas pelo usuário
const SUPABASE_URL = 'https://nnaafaxidmkoaarmtkxj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYWFmYXhpZG1rb2Fhcm10a3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODAwNTIsImV4cCI6MjA4MTA1NjA1Mn0.JbMrMBCm6h2rJK-8FHX9stRKH8OI4iCqlxG9jZjlQKQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
