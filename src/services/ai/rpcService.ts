
import { AIServiceResponse, StrategyMetadata } from "./types";

export class RPCService {
  private static async getAuthHeaders(): Promise<Headers> {
    const headers = new Headers({ "content-type": "application/json" });
    try {
      const anyWindow = window as any;
      const token = await anyWindow?.Clerk?.session?.getToken?.();
      if (token) headers.set("authorization", `Bearer ${token}`);
    } catch {}
    return headers;
  }

  /**
   * Gets strategy metadata from the database using an RPC function
   */
  static async getStrategyMetadata(
    strategyId: string
  ): Promise<AIServiceResponse<StrategyMetadata>> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/strategy-metadata?strategyId=${encodeURIComponent(strategyId)}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) throw new Error(`GET strategy-metadata failed: ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json.items) ? json.items : [];
      if (items.length === 0) {
        return { 
          error: `No metadata found for strategy ID: ${strategyId}` 
        };
      }

      const m = items[0];
      const mapped: StrategyMetadata = {
        strategy_id: strategyId,
        company_name: m?.company_name ?? null,
        website_url: m?.website_url ?? null,
        product_description: m?.product_description ?? null,
        product_url: m?.product_url ?? null,
        additional_info: m?.additional_info ?? null,
      };
      return { data: mapped };
    } catch (error) {
      console.error(`Error fetching strategy metadata for ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching strategy metadata' 
      };
    }
  }

  /**
   * Updates strategy metadata in the database using an RPC function
   */
  static async updateStrategyMetadata(
    strategyId: string,
    metadata: Partial<StrategyMetadata>
  ): Promise<AIServiceResponse<boolean>> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/strategy-metadata`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          strategyId,
          company_name: metadata.company_name ?? null,
          website_url: metadata.website_url ?? null,
          product_description: metadata.product_description ?? null,
          product_url: metadata.product_url ?? null,
          additional_info: metadata.additional_info ?? null,
        }),
      });
      if (!res.ok) throw new Error(`POST strategy-metadata failed: ${res.status}`);
      
      return { data: true };
    } catch (error) {
      console.error(`Error updating strategy metadata for ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating strategy metadata' 
      };
    }
  }

  /**
   * Updates an AI prompt in the database or creates it if it doesn't exist
   */
  static async updateOrCreatePrompt(
    module: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIServiceResponse<boolean>> {
    try {
      console.log(`Updating prompt for module: ${module}`);
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/ai-prompts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ module, system_prompt: systemPrompt, user_prompt: userPrompt }),
      });
      if (!res.ok) throw new Error(`POST ai-prompts failed: ${res.status}`);
      
      console.log(`Successfully updated prompt for module: ${module}`);
      return { data: true };
    } catch (error) {
      console.error(`Error updating AI prompt for module ${module}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating the prompt'
      };
    }
  }
}

