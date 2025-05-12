
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const requestData = await req.json();
    const { 
      strategyId, 
      uspData, 
      customPrompt = '', 
      outputLanguage = 'english', 
      minStatements = 10 
    } = requestData;
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!strategyId) {
      return new Response(
        JSON.stringify({ error: 'Strategy ID is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating statements for strategy ${strategyId}`);
    console.log(`Output language: ${outputLanguage}`);
    console.log(`Minimum statements: ${minStatements}`);
    console.log(`Custom prompt provided: ${customPrompt ? 'Yes' : 'No'}`);
    
    // First try to load custom prompt from settings
    let systemPrompt;
    let userPrompt;
    
    // Try to fetch custom prompts from the database
    try {
      const { data: promptData, error: promptError } = await supabase
        .from('ai_prompts')
        .select('system_prompt, user_prompt')
        .eq('module', 'statements')
        .maybeSingle();
        
      if (!promptError && promptData) {
        systemPrompt = promptData.system_prompt;
        userPrompt = promptData.user_prompt;
        console.log('Using custom prompts from settings');
      }
    } catch (err) {
      console.error('Error fetching custom prompts:', err);
    }

    // If no custom prompts were found, use default prompts
    if (!systemPrompt) {
      systemPrompt = `You are an expert marketing strategist specializing in pain and gain statements.

Your task is to analyze the USP Canvas data and create compelling:
1. Pain Statements - Emotionally resonant descriptions of customer problems
2. Gain Statements - Persuasive descriptions of desired positive outcomes

Format your response as a valid JSON object with two arrays: "painStatements" and "gainStatements".
Each statement should be persuasive, specific, and emotionally resonant.

You must create at least ${minStatements} statements of each type.`;
    }

    if (!userPrompt) {
      userPrompt = `Based on the provided USP Canvas data, create compelling pain and gain statements:

USP Canvas Data:
{{uspData}}

Please provide a valid JSON with the following structure:
{
  "painStatements": [
    { "content": "Pain statement content", "impact": "high" },
    { "content": "Another pain statement", "impact": "medium" }
  ],
  "gainStatements": [
    { "content": "Gain statement content", "impact": "high" },
    { "content": "Another gain statement", "impact": "medium" }
  ]
}

For each statement, specify an impact level of "low", "medium", or "high".
Pain statements should focus on emotional pain points, frustrations, and challenges.
Gain statements should focus on aspirational outcomes and desired positive states.

IMPORTANT: Generate at least {{minStatements}} statements of each type (pain and gain).

{{#if customPrompt}}
ADDITIONAL INSTRUCTIONS: {{customPrompt}}
{{/if}}

{{#if outputLanguage}}
Please respond in {{outputLanguage}}.
{{/if}}`;
    }
    
    // Process template variables in user prompt
    userPrompt = userPrompt
      .replace('{{uspData}}', JSON.stringify(uspData, null, 2))
      .replace('{{minStatements}}', minStatements.toString())
      .replace(/{{#if customPrompt}}[\s\S]*?{{\/if}}/g, customPrompt ? `ADDITIONAL INSTRUCTIONS: ${customPrompt}` : '')
      .replace(/{{#if outputLanguage}}[\s\S]*?{{\/if}}/g, 
        outputLanguage && outputLanguage !== 'english' ? `Please respond in ${outputLanguage}.` : '');
        
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
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }), 
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
      console.log(`Generated ${result.painStatements?.length || 0} pain statements`);
      console.log(`Generated ${result.gainStatements?.length || 0} gain statements`);
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
        painStatements: result.painStatements || [],
        gainStatements: result.gainStatements || [],
        rawOutput: content,
        debugInfo: {
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          response_tokens: completion.usage?.completion_tokens,
          prompt_tokens: completion.usage?.prompt_tokens,
          total_tokens: completion.usage?.total_tokens,
          custom_prompt_provided: !!customPrompt,
          output_language: outputLanguage
        } 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in Statements Generator function:", error);
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
