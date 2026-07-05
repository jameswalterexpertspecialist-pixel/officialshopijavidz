import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export type Contact = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  services: string[];
  budget?: string;
  message: string;
  consultation_code: string;
  created_at: string;
};
