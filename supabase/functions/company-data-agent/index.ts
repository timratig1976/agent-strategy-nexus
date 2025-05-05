
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WebsiteData {
  url: string;
  title?: string;
  description?: string;
  content?: string;
}

interface CompanyData {
  name: string;
  website?: string;
  sources: WebsiteData[];
}

async function crawlWebsite(url: string): Promise<WebsiteData> {
  console.log(`Crawling website: ${url}`);
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Basic extraction of content from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1] : '';
    
    // Extract text content from the HTML (very basic implementation)
    // In a production environment, consider using a proper HTML parser
    const content = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return {
      url,
      title,
      description,
      content: content.slice(0, 10000), // Limit content size
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return { url, content: `Error: ${error.message}` };
  }
}

async function getAgentPrompts(agentId: string) {
  try {
    const { data, error } = await supabase
      .from("agent_prompts")
      .select("*")
      .eq("agent_id", agentId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") { // Not found error is ok
      throw error;
    }

    // Return default prompts if none found
    return {
      systemPrompt: data?.system_prompt || "You are an AI assistant that creates detailed company summaries based on website data.",
      userPrompt: data?.user_prompt || `
Create a comprehensive company summary based on the following information:

Company Name: {{companyName}}
Company Website: {{websiteUrl}}

Website Content:
{{websiteContent}}

Please provide a structured summary with the following sections:
1. Company Overview
2. Products/Services
3. Target Market
4. Key Differentiators
5. Business Goals (based on available information)
6. Customer Personas (if identifiable)

If information for any section is not available, indicate that.
`
    };
  } catch (error) {
    console.error("Error fetching agent prompts:", error);
    // Return default prompts if error
    return {
      systemPrompt: "You are an AI assistant that creates detailed company summaries based on website data.",
      userPrompt: "Create a comprehensive company summary based on the provided information."
    };
  }
}

async function generateSummaryWithOpenAI(companyData: CompanyData, agentId: string): Promise<string> {
  try {
    // Get custom prompts for this agent
    const { systemPrompt, userPrompt } = await getAgentPrompts(agentId);
    
    // Replace variables in the user prompt template
    let formattedUserPrompt = userPrompt
      .replace("{{companyName}}", companyData.name)
      .replace("{{websiteUrl}}", companyData.website || 'Unknown');
    
    // Format website content for the prompt
    const websiteContentFormatted = companyData.sources.map(source => 
      `URL: ${source.url}
      Title: ${source.title || 'Unknown'}
      Description: ${source.description || 'Unknown'}
      
      Content Summary: ${source.content?.substring(0, 1000)}...
      `).join('\n\n');
    
    formattedUserPrompt = formattedUserPrompt.replace("{{websiteContent}}", websiteContentFormatted);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: formattedUserPrompt }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Error generating summary: ${error.message}`;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { companyName, websiteUrl, agentId } = await req.json();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'Company name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create company data object
    const companyData: CompanyData = {
      name: companyName,
      website: websiteUrl,
      sources: []
    };

    // Crawl primary website if provided
    if (websiteUrl) {
      const websiteData = await crawlWebsite(websiteUrl);
      companyData.sources.push(websiteData);

      // Store the crawled data
      await supabase
        .from('agent_data_sources')
        .insert({
          agent_id: agentId,
          source_type: 'website',
          source_url: websiteUrl,
          source_data: websiteData
        });
    }

    // Generate summary with OpenAI
    const summary = await generateSummaryWithOpenAI(companyData, agentId);

    // Store the result
    const { data: resultData, error: resultError } = await supabase
      .from('agent_results')
      .insert({
        agent_id: agentId,
        content: summary,
        metadata: { 
          companyName,
          websiteUrl,
          sourceCount: companyData.sources.length
        }
      })
      .select()
      .single();

    if (resultError) {
      throw resultError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        summary,
        resultId: resultData.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
