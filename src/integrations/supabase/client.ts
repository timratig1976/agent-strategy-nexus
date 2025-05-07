
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Define proper TypeScript types for the RPC functions
export interface StrategyMetadata {
  id: string;
  strategy_id: string;
  company_name: string | null;
  website_url: string | null;
  product_description: string | null;
  product_url: string | null;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
}

// Extend the Database interface to include our RPC functions with proper types
declare global {
  interface Database {
    public: {
      Functions: {
        get_strategy_metadata: {
          Args: { strategy_id_param: string };
          Returns: StrategyMetadata[];
        };
        upsert_strategy_metadata: {
          Args: {
            strategy_id_param: string;
            company_name_param: string;
            website_url_param: string;
            product_description_param: string;
            product_url_param: string;
            additional_info_param: string;
          };
          Returns: void;
        };
      };
    };
  }
}

export const supabase = createClient<Database>(
  "https://lqrbflaupbwizcyhwcsz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcmJmbGF1cGJ3aXpjeWh3Y3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzI1OTIsImV4cCI6MjA2MTE0ODU5Mn0.litCu9gZUJ8xAnZXWmsEMxxsJigPQT5YqNMZ0vf6oMY"
);
