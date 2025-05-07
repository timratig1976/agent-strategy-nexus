
import { SupabaseClient } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface SupabaseClient<Database = any> {
    rpc<
      // Use the function name from the Database["public"]["Functions"] interface
      FunctionName extends keyof Database["public"]["Functions"],
      // Use the Args type from the specified function
      Args extends Database["public"]["Functions"][FunctionName]["Args"],
      // Use the Returns type from the specified function
      Returns = Database["public"]["Functions"][FunctionName]["Returns"]
    >(
      fn: FunctionName,
      params?: Args,
      options?: { 
        count?: null | 'exact' | 'planned' | 'estimated',
        head?: boolean
      }
    ): Promise<{
      data: Returns;
      error: Error | null;
      count: number | null;
      status: number;
      statusText: string;
    }>;

    // Add a special RPC function for JSONB operations
    rpc(
      fn: 'jsonb_set_key_to_value',
      params: { 
        json_data: any, 
        key_name: string, 
        new_value: string
      },
      options?: {
        count?: null | 'exact' | 'planned' | 'estimated',
        head?: boolean
      }
    ): Promise<{
      data: any;
      error: Error | null;
      count: number | null;
      status: number;
      statusText: string;
    }>;
    
    // Add our custom RPC function for updating agent results final status
    rpc(
      fn: 'update_agent_results_final_status',
      params: { 
        strategy_id_param: string, 
        result_type_param: string
      },
      options?: {
        count?: null | 'exact' | 'planned' | 'estimated',
        head?: boolean
      }
    ): Promise<{
      data: any;
      error: Error | null;
      count: number | null;
      status: number;
      statusText: string;
    }>;
  }
}
