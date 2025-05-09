
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // This is critical: handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { action, strategyId, briefingContent, profileType, enhancementText, personaContent, outputLanguage } = await req.json();
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is required' 
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!strategyId) {
      return new Response(
        JSON.stringify({ 
          error: 'Strategy ID is required' 
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!briefingContent) {
      return new Response(
        JSON.stringify({ 
          error: 'Briefing content is required' 
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing ${action} request for strategy ${strategyId}`);
    console.log(`Profile type: ${profileType}`);
    console.log(`Output language: ${outputLanguage || 'english'}`);

    // Determine which system prompt to use based on the action
    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'generate_profile') {
      // System prompt for generating customer profiles
      systemPrompt = `You are an expert marketing strategist specializing in value proposition and USP development.

Your task is to analyze the marketing briefing and persona information to develop a comprehensive customer profile with:

1. Customer Jobs - What tasks and goals customers are trying to accomplish
2. Customer Pains - Problems, frustrations, and challenges customers face
3. Customer Gains - Benefits and positive outcomes customers seek

Format your response as a valid JSON object with three arrays: "jobs", "pains", and "gains".
Each item in these arrays should have a "content" field and a priority/severity/importance rating.`;

      // User prompt for generating customer profiles
      userPrompt = `Based on the provided information, create a customer profile that identifies:

Briefing Information:
${briefingContent}

${personaContent ? `Persona Information:\n${personaContent}` : ''}

${enhancementText ? `Additional guidance: ${enhancementText}` : ''}

Please provide a valid JSON with the following structure:
{
  "jobs": [
    { "content": "Job description", "priority": "high" },
    { "content": "Another job", "priority": "medium" }
  ],
  "pains": [
    { "content": "Pain description", "severity": "high" },
    { "content": "Another pain", "severity": "low" }
  ],
  "gains": [
    { "content": "Gain description", "importance": "high" },
    { "content": "Another gain", "importance": "medium" }
  ]
}

For each job, specify a priority of "low", "medium", or "high".
For each pain, specify a severity of "low", "medium", or "high".
For each gain, specify an importance of "low", "medium", or "high".

${outputLanguage === 'deutsch' ? 'Bitte antworte auf Deutsch und erstelle den JSON mit deutschen Inhalten.' : ''}`;
    } else if (action === 'generate_value_proposition') {
      // System prompt for generating value proposition
      systemPrompt = `You are an expert marketing strategist specializing in value proposition and USP development.

Your task is to analyze the customer profile and briefing to develop value proposition elements:

1. Products & Services - What the business offers to customers
2. Pain Relievers - How products/services alleviate customer pains
3. Gain Creators - How products/services create customer gains

Format your response as a valid JSON object with three arrays: "products", "painRelievers", and "gainCreators".
Each item should have a "content" field and relevant relationships to customer jobs, pains, or gains.`;

      // User prompt for generating value proposition
      userPrompt = `Based on the provided information, create value proposition elements:

Briefing Information:
${briefingContent}

Customer Profile Information:
${personaContent || 'No customer profile provided.'}

${enhancementText ? `Additional guidance: ${enhancementText}` : ''}

Please provide a valid JSON with the following structure:
{
  "products": [
    { "content": "Product/service description", "priority": "high" }
  ],
  "painRelievers": [
    { "content": "Pain reliever description", "relatedPainIds": [] }
  ],
  "gainCreators": [
    { "content": "Gain creator description", "relatedGainIds": [] }
  ]
}

For each product, specify a priority of "low", "medium", or "high".
For pain relievers and gain creators, you don't need to include the relatedPainIds and relatedGainIds arrays.

${outputLanguage === 'deutsch' ? 'Bitte antworte auf Deutsch und erstelle den JSON mit deutschen Inhalten.' : ''}`;
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid action. Must be either "generate_profile" or "generate_value_proposition".' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${response.status}` 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const completion = await response.json();
    const content = completion.choices[0].message.content;

    // Parse the JSON response
    let result;
    try {
      // Extract JSON from the response (the model might return markdown)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        content.match(/\{[\s\S]*\}/);
      
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      result = JSON.parse(jsonString.replace(/```/g, '').trim());
      
      console.log("Successfully parsed result");
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      console.log("Raw content:", content);
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to parse AI response: ${e.message}`,
          rawOutput: content 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the result
    return new Response(
      JSON.stringify({ 
        result: {
          ...result,
          rawOutput: content
        },
        debugInfo: {
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          response_tokens: completion.usage?.completion_tokens,
          prompt_tokens: completion.usage?.prompt_tokens,
          total_tokens: completion.usage?.total_tokens
        } 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in USP Canvas AI function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
