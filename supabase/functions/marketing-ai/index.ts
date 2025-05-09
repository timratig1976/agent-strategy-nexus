
// Update this file if it exists or create a new one if necessary
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'
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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify OpenAI API key is available
    if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }

    // Initialize OpenAI API
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)

    // Get request body
    const requestData = await req.json()
    const { 
      module,
      action,
      data,
      options = {}
    } = requestData

    console.log(`Processing request for module: ${module}, action: ${action}`)
    console.log(`Data includes: ${Object.keys(data || {}).join(', ')}`)

    // Get the prompts from the database for the specified module
    const { data: promptData, error: promptError } = await supabase
      .from('ai_prompts')
      .select('system_prompt, user_prompt')
      .eq('module', module)
      .maybeSingle()

    console.log(`Prompt data fetch result: ${!!promptData}, error: ${!!promptError}`)

    if (promptError) {
      throw new Error(`Error fetching prompts: ${promptError.message}`)
    }

    if (!promptData || !promptData.system_prompt || !promptData.user_prompt) {
      throw new Error(`No prompts found for module: ${module}`)
    }

    // Extract prompts
    const { system_prompt, user_prompt } = promptData

    // Process the placeholders in the user prompt
    let processedUserPrompt = user_prompt

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
    } = data || {}

    console.log('Data received:', { 
      strategyId, 
      hasFormData: !!formData, 
      hasEnhancement: !!enhancementText, 
      hasDocumentContent: !!documentContent,
      hasWebsiteData: !!websiteData
    })

    // Replace placeholders based on the data
    if (strategyId) {
      processedUserPrompt = processedUserPrompt.replace(/{{strategyId}}/g, strategyId)
    }

    // Handle form data replacement
    if (formData) {
      // Replace formData.X placeholders
      Object.entries(formData).forEach(([key, value]) => {
        const regex = new RegExp(`{{formData\\.${key}}}`, 'g')
        processedUserPrompt = processedUserPrompt.replace(regex, value as string || '')
      })
    }

    // Handle website crawl data
    if (data.websiteData) {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if websiteCrawlData}}([\s\S]*?){{websiteCrawlData}}([\s\S]*?){{\/if}}/g, 
        `$1${data.websiteData}$2`
      )
    } else {
      // Remove the conditional block if websiteCrawlData is not available
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if websiteCrawlData}}[\s\S]*?{{\/if}}/g, 
        ''
      )
    }

    // Handle documentContent
    if (documentContent) {
      processedUserPrompt = `${processedUserPrompt}\n\nAdditional Documents:\n${documentContent}`
    }

    // Handle briefing content
    if (briefingContent) {
      processedUserPrompt = processedUserPrompt.replace(/{{briefingContent}}/g, briefingContent)
    }

    // Handle persona content
    if (personaContent) {
      processedUserPrompt = processedUserPrompt.replace(/{{personaContent}}/g, personaContent)
    }

    // Handle enhancement text
    if (enhancementText) {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if enhancementText}}([\s\S]*?){{enhancementText}}([\s\S]*?){{\/if}}/g, 
        `$1${enhancementText}$2`
      )
    } else {
      // Remove the conditional block if enhancement text is not available
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if enhancementText}}[\s\S]*?{{\/if}}/g, 
        ''
      )
    }

    // Handle output language
    if (outputLanguage === 'deutsch') {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if outputLanguage equals "deutsch"}}([\s\S]*?){{\/if}}/g, 
        '$1'
      )
    } else {
      processedUserPrompt = processedUserPrompt.replace(
        /{{#if outputLanguage equals "deutsch"}}[\s\S]*?{{\/if}}/g, 
        ''
      )
    }

    console.log('System prompt length:', system_prompt.length)
    console.log('Processed user prompt length:', processedUserPrompt.length)

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: processedUserPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const response = completion.data.choices[0].message?.content || ''

    // Return the response
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'application/json')

    return new Response(
      JSON.stringify({
        result: {
          rawOutput: response
        },
        debugInfo: {
          system_prompt,
          user_prompt: processedUserPrompt,
          response_tokens: completion.data.usage?.completion_tokens,
          prompt_tokens: completion.data.usage?.prompt_tokens,
          total_tokens: completion.data.usage?.total_tokens,
        }
      }),
      { headers }
    )

  } catch (error) {
    console.error('Error in marketing-ai function:', error)
    
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'application/json')
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { status: 500, headers }
    )
  }
})
