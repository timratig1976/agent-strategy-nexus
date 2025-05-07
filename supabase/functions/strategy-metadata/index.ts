
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    const requestBody = await req.json();
    const { action, strategyId } = requestBody;

    console.log(`Processing ${action} action for strategy ID: ${strategyId}`);
    
    if (action === 'get') {
      // Get strategy metadata
      const { data, error } = await supabaseClient
        .from('strategy_metadata')
        .select('*')
        .eq('strategy_id', strategyId);
      
      if (error) {
        console.error("Error fetching strategy metadata:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'update') {
      const { companyName, websiteUrl, productDescription, productUrl, additionalInfo } = requestBody;
      
      // Check if record exists
      const { data: existingData } = await supabaseClient
        .from('strategy_metadata')
        .select('id')
        .eq('strategy_id', strategyId)
        .single();
      
      let result;
      if (existingData) {
        // Update existing record
        result = await supabaseClient
          .from('strategy_metadata')
          .update({
            company_name: companyName,
            website_url: websiteUrl,
            product_description: productDescription,
            product_url: productUrl,
            additional_info: additionalInfo,
            updated_at: new Date().toISOString()
          })
          .eq('strategy_id', strategyId);
      } else {
        // Insert new record
        result = await supabaseClient
          .from('strategy_metadata')
          .insert({
            strategy_id: strategyId,
            company_name: companyName,
            website_url: websiteUrl,
            product_description: productDescription,
            product_url: productUrl,
            additional_info: additionalInfo
          });
      }
      
      if (result.error) {
        console.error("Error updating strategy metadata:", result.error);
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
