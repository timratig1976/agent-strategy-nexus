
import { SupabaseClient } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface SupabaseClient<Database = any> {
    rpc<
      Name extends string,
      Result = unknown,
      Args = unknown
    >(
      fn: Name,
      params?: Args,
      options?: { 
        count?: null | 'exact' | 'planned' | 'estimated',
        head?: boolean
      }
    ): Promise<{
      data: Result;
      error: Error | null;
      count: number | null;
    }>;
  }
}
