
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

export interface StrategyDocument {
  id: string;
  strategy_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  processed: boolean;
  extracted_text: string | null;
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
            company_name_param: string | null;
            website_url_param: string | null;
            product_description_param: string | null;
            product_url_param: string | null;
            additional_info_param: string | null;
          };
          Returns: void;
        };
        update_agent_results_final_status: {
          Args: {
            strategy_id_param: string;
            result_type_param: string;
          };
          Returns: void;
        };
        get_strategy_documents: {
          Args: { strategy_id_param: string };
          Returns: StrategyDocument[];
        };
        insert_strategy_document: {
          Args: {
            strategy_id_param: string;
            file_path_param: string;
            file_name_param: string;
            file_type_param: string;
            file_size_param: number;
          };
          Returns: string; // UUID of the created document
        };
        delete_strategy_document: {
          Args: { document_id_param: string };
          Returns: boolean;
        };
      };
    };
  }
}

export const supabase = createClient<Database>(
  "https://lqrbflaupbwizcyhwcsz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcmJmbGF1cGJ3aXpjeWh3Y3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzI1OTIsImV4cCI6MjA2MTE0ODU5Mn0.litCu9gZUJ8xAnZXWmsEMxxsJigPQT5YqNMZ0vf6oMY"
);
