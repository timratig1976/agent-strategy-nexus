
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  "https://lqrbflaupbwizcyhwcsz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcmJmbGF1cGJ3aXpjeWh3Y3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzI1OTIsImV4cCI6MjA2MTE0ODU5Mn0.litCu9gZUJ8xAnZXWmsEMxxsJigPQT5YqNMZ0vf6oMY"
);
