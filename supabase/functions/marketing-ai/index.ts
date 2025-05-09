
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Default prompts to use as fallbacks when database prompts aren't found
const DEFAULT_PROMPTS = {
  briefing: {
    system_prompt: `You are an expert marketing strategist AI assistant helping to create professional marketing strategy briefings.

Your task is to synthesize information from multiple sources, including:
1. Form data provided by the user
2. Website content crawled from the company URL (when available)
3. Product description and additional context

Create a comprehensive, well-structured marketing strategy briefing that includes:
- Company and product overview based on the provided information and website data
- Target audience analysis that identifies key demographics and psychographics
- Unique value proposition and competitive positioning
- Key marketing channels and tactics recommended for this specific business
- Strategic approach recommendations tailored to the company's industry and offerings
- Prioritized action items and next steps

Format the briefing in a professional, readable structure with clear sections and bullet points where appropriate.
Maintain a professional tone suitable for marketing experts while being accessible.`,
    user_prompt: `I need to create a marketing strategy briefing for:
- Strategy ID: {{strategyId}}
- Strategy Name: {{formData.name}}
- Company Name: {{formData.companyName}}
- Website URL: {{formData.websiteUrl}}
- Product/Service Description: {{formData.productDescription}}
- Additional Information: {{formData.additionalInfo}}

{{#if websiteCrawlData}}
Here is additional data extracted from the company's website:
{{websiteCrawlData}}
{{/if}}

Please provide a comprehensive marketing strategy briefing that includes:
1. An overview of the company and its offerings
2. Target audience analysis
3. Key marketing channels to prioritize
4. Key benefits of the product/service to highlight
5. Recommendations for messaging and positioning
6. Call to action and next steps

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch.
{{/if}}`
  },
  persona: {
    system_prompt: `You are an expert marketing strategist specializing in persona development.

Your task is to create detailed buyer personas based on the marketing briefing and any additional information provided.

For each persona, include:
1. A realistic name and brief description
2. Demographic information (age, gender, income, education, occupation, location)
3. Goals and objectives they are trying to achieve
4. Pain points and challenges they face
5. Behavioral traits and habits
6. Media consumption preferences and channels
7. Decision-making factors that influence their purchase decisions

Create 2-3 distinct personas that represent the primary customer segments for this business.
Format each persona in a clear, structured way that makes it easy to understand the different types of customers.`,
    user_prompt: `Based on the briefing content, create detailed buyer personas:

{{briefingContent}}

{{#if enhancementText}}
Additional guidance: {{enhancementText}}
{{/if}}

Please create 2-3 distinct, detailed buyer personas that represent the key customer segments for this business. For each persona include:
- Name and short description
- Demographics (age, gender, income, location, etc.)
- Goals and aspirations
- Pain points and challenges
- Behavioral traits
- Media preferences and channels
- Decision-making factors`
  },
  usp_canvas: {
    system_prompt: `You are an expert marketing strategist specializing in value proposition and USP development.

Your task is to analyze the marketing briefing and persona information to develop a comprehensive USP Canvas with:
1. Customer Jobs - What tasks and goals customers are trying to accomplish
2. Customer Pains - Problems, frustrations, and challenges customers face
3. Customer Gains - Benefits and positive outcomes customers seek
4. Products & Services - What the business offers to customers
5. Pain Relievers - How products/services alleviate customer pains
6. Gain Creators - How products/services create customer gains

Format your output as structured sections with clear bullet points for each category.`,
    user_prompt: `Based on the provided information, create a USP Canvas that identifies:

{{#if briefingContent}}
Briefing Information:
{{briefingContent}}
{{/if}}

{{#if personaContent}}
Persona Information:
{{personaContent}}
{{/if}}

{{#if enhancementText}}
Additional guidance: {{enhancementText}}
{{/if}}

Please provide:
1. Customer Jobs - Key tasks and goals customers want to accomplish
2. Customer Pains - Main problems and challenges customers face
3. Customer Gains - Desired benefits and positive outcomes
4. Products & Services - What the business offers
5. Pain Relievers - How the offerings solve customer problems
6. Gain Creators - How the offerings deliver benefits`
  }
}

serve(async (req) => {
  // Handle CORS preflight requests - this must be the first thing we check
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Marketing AI function called");
    
    // Verify OpenAI API key is available
    if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }

    // Get request body
    const requestData = await req.json()
    const { 
      module,
      action,
      data,
      options = {}
    } = requestData

    console.log(`Processing request for module: ${module}, action: ${action}`);
    console.log(`Data includes: ${Object.keys(data || {}).join(', ')}`);

    // Get the prompts from the database for the specified module
    const { data: promptData, error: promptError } = await supabase
      .from('ai_prompts')
      .select('system_prompt, user_prompt')
      .eq('module', module)
      .maybeSingle()

    console.log(`Prompt data fetch result: ${!!promptData}, error: ${!!promptError}`);
    
    // Initialize prompts - either from database or defaults
    let system_prompt = '';
    let user_prompt = '';
    let promptSource = 'none';

    // Check if we got prompts from the database
    if (promptData && promptData.system_prompt && promptData.user_prompt) {
      // Use database prompts
      system_prompt = promptData.system_prompt;
      user_prompt = promptData.user_prompt;
      promptSource = 'database';
      console.log(`Using database prompts for module: ${module}`);
    } else {
      // Check if we have default prompts for this module
      if (DEFAULT_PROMPTS[module]) {
        system_prompt = DEFAULT_PROMPTS[module].system_prompt;
        user_prompt = DEFAULT_PROMPTS[module].user_prompt;
        promptSource = 'default';
        console.log(`Using default fallback prompts for module: ${module}`);
      } else {
        // No prompts found in database or defaults
        console.error(`No prompts found for module: ${module}`);
        throw new Error(`No prompts found for module: ${module}`);
      }
    }

    // Process the placeholders in the user prompt
    let processedUserPrompt = user_prompt;

    // Extract data from the request
    const {
      strategyId,
      formData,
      enhancementText,
      briefingContent,
      personaContent,
      documentContent,
      websiteData,
      outputLanguage = 'english'
    } = data || {};

    console.log('Data received:', { 
      strategyId, 
      hasFormData: !!formData, 
      hasEnhancement: !!enhancementText, 
      hasDocumentContent: !!documentContent,
      hasWebsiteData: !!websiteData,
      outputLanguage
    });

    // Replace placeholders based on the data
    if (strategyId) {
      processedUserPrompt = processedUserPrompt.replace(/{{strategyId}}/g, strategyId);
    }

    // Handle form data replacement
    if (formData) {
      // Replace formData.X placeholders
      Object.entries(formData).forEach(([key, value]) => {
        const regex = new RegExp(`{{formData\\.${key}}}`, 'g');
        processedUserPrompt = processedUserPrompt.replace(regex, value || '');
      });
    }

    // Handle website crawl data
    if (websiteData) {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if websiteCrawlData}}([\s\S]*?){{websiteCrawlData}}([\s\S]*?){{\/if}}/g, 
        `$1${websiteData}$2`
      );
    } else {
      // Remove the conditional block if websiteCrawlData is not available
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if websiteCrawlData}}[\s\S]*?{{\/if}}/g, 
        ''
      );
    }

    // Handle documentContent
    if (documentContent) {
      processedUserPrompt = `${processedUserPrompt}\n\nAdditional Documents:\n${documentContent}`;
    }

    // Handle briefing content
    if (briefingContent) {
      processedUserPrompt = processedUserPrompt.replace(/{{briefingContent}}/g, briefingContent);
    }

    // Handle persona content
    if (personaContent) {
      processedUserPrompt = processedUserPrompt.replace(/{{personaContent}}/g, personaContent);
    }

    // Handle enhancement text
    if (enhancementText) {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if enhancementText}}([\s\S]*?){{enhancementText}}([\s\S]*?){{\/if}}/g, 
        `$1${enhancementText}$2`
      );
    } else {
      // Remove the conditional block if enhancement text is not available
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if enhancementText}}[\s\S]*?{{\/if}}/g, 
        ''
      );
    }

    // Handle output language
    if (outputLanguage === 'deutsch') {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if outputLanguage equals "deutsch"}}([\s\S]*?){{\/if}}/g, 
        '$1'
      );
    } else {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if outputLanguage equals "deutsch"}}[\s\S]*?{{\/if}}/g, 
        ''
      );
    }

    console.log('System prompt length:', system_prompt.length);
    console.log('Processed user prompt length:', processedUserPrompt.length);

    // Call OpenAI API with proper error handling
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: processedUserPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API error status:", response.status);
        console.error("OpenAI API error response:", errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
      }
      
      const completion = await response.json();

      if (!completion || !completion.choices || completion.choices.length === 0) {
        console.error('Invalid response from OpenAI API');
        throw new Error('Invalid response from OpenAI API');
      }

      const responseContent = completion.choices[0].message?.content || '';

      // Return the response
      const responseHeaders = new Headers(corsHeaders);
      responseHeaders.set('Content-Type', 'application/json');

      return new Response(
        JSON.stringify({
          result: {
            rawOutput: responseContent
          },
          debugInfo: {
            system_prompt,
            user_prompt: processedUserPrompt,
            response_tokens: completion.usage?.completion_tokens,
            prompt_tokens: completion.usage?.prompt_tokens,
            total_tokens: completion.usage?.total_tokens,
            promptSource
          }
        }),
        { 
          status: 200,
          headers: responseHeaders 
        }
      );
    } catch (apiError) {
      console.error("OpenAI API call failed:", apiError);
      throw new Error(`OpenAI API call failed: ${apiError.message || JSON.stringify(apiError)}`);
    }
  } catch (error) {
    console.error('Error in marketing-ai function:', error);
    
    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', 'application/json');
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { status: 500, headers }
    );
  }
});
