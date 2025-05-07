
import { SupabaseClient } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface SupabaseClient<Database = any> {
    rpc<
      FunctionName extends string,
      Args extends Record<string, unknown> = Record<string, unknown>,
      Result = unknown
    >(
      fn: FunctionName,
      params?: Args,
      options?: { 
        count?: null | 'exact' | 'planned' | 'estimated',
        head?: boolean
      }
    ): Promise<{
      data: Result;
      error: Error | null;
      count: number | null;
      status: number;
      statusText: string;
    }>;
  }
}
