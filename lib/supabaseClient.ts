import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// The Supabase URL is derived from the user-provided database connection string.
const supabaseUrl = 'https://pcqppsrrsytegqvfflcq.supabase.co';

// NOTE: This is a placeholder public anon key.
// For the application to connect to your specific Supabase project,
// you must replace this with the actual Anon Key from your Supabase project dashboard (Project Settings > API).
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcXBwc3Jyc3l0ZWdxdmZmbGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTcxMzUsImV4cCI6MjA2NzM5MzEzNX0.DilnrJprzCDpmErwRT_YtcfsKSXiVmEHNt-uexEDs8g';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);