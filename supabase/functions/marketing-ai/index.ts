
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with service role key (admin)
const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey!
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { module, action, data } = await req.json();
    console.log("Marketing AI function called with:", { module, action });
    console.log("Request data:", JSON.stringify(data));
    
    // Fetch custom prompt from database if available
    const { data: promptData, error: promptError } = await supabase
      .from('ai_prompts')
      .select('system_prompt, user_prompt')
      .eq('module', module)
      .maybeSingle();
    
    if (promptError) {
      console.log("Error fetching prompt:", promptError);
    }
    
    // Construct system prompt based on custom prompt or fallback to default
    let systemPrompt = "";
    if (promptData && promptData.system_prompt) {
      systemPrompt = promptData.system_prompt;
      console.log("Using custom system prompt from database");
    } else {
      systemPrompt = getSystemPrompt(module, action);
      console.log("Using default system prompt");
    }
    
    // Create appropriate user prompt based on custom template or fallback to default
    let userPrompt = "";
    if (promptData && promptData.user_prompt) {
      // Replace variables in the template with actual data
      userPrompt = replacePlaceholders(promptData.user_prompt, data);
      console.log("Using custom user prompt template from database (after replacement)");
    } else {
      userPrompt = constructUserPrompt(module, action, data);
      console.log("Using default user prompt");
    }
    
    console.log("Final system prompt:", systemPrompt);
    console.log("Final user prompt:", userPrompt);
    
    // Add enhancement text if provided
    const enhancementIncluded = !!(data.enhancementText && data.enhancementText.trim());
    if (enhancementIncluded) {
      console.log("Enhancement text provided:", data.enhancementText);
      userPrompt += `\n\nAdditional instructions for customizing output: ${data.enhancementText.trim()}`;
    }
    
    // Make OpenAI API call
    console.log("Calling OpenAI API...");
    const model = 'gpt-4o-mini'; // Use the most efficient model by default
    const openaiRequest = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    };
    
    console.log("OpenAI request:", JSON.stringify(openaiRequest));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", JSON.stringify(error));
      throw new Error(`OpenAI Error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log("OpenAI response received:", JSON.stringify(result));
    
    const content = result.choices[0].message.content;
    
    // Parse the result based on module and action
    const parsedResult = parseAIResult(module, action, content);
    console.log("Parsed result:", JSON.stringify(parsedResult));

    return new Response(JSON.stringify({ 
      result: parsedResult,
      debug: {
        prompt: {
          system: systemPrompt,
          user: userPrompt
        },
        response: result,
        enhancementIncluded,
        model
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in marketing-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      debug: {
        timestamp: new Date().toISOString(),
        error: error.toString()
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to replace placeholders in the prompt template
function replacePlaceholders(template: string, data: any): string {
  let result = template;
  
  // Replace all placeholders in format {{variable}} with the corresponding data
  const placeholderPattern = /\{\{(\w+)\}\}/g;
  let match;
  
  while ((match = placeholderPattern.exec(template)) !== null) {
    const placeholder = match[0];
    const key = match[1];
    
    if (data[key] !== undefined) {
      let value = data[key];
      
      // Handle arrays specially
      if (Array.isArray(value)) {
        value = value.join(', ');
      }
      
      result = result.replace(placeholder, value);
    }
  }
  
  return result;
}

// Helper functions for different modules
function getSystemPrompt(module: string, action: string): string {
  const basePrompt = "You are an expert marketing strategist AI assistant helping to create professional marketing content.";
  
  const modulePrompts: Record<string, Record<string, string>> = {
    'briefing': {
      'generate': `${basePrompt} Your task is to create a comprehensive marketing strategy briefing based on the provided company and product information. Include key strategy elements, target audience, main marketing channels, and actionable next steps.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing marketing strategy briefing based on feedback and updated information.`
    },
    'persona': {
      'generate': `${basePrompt} Your task is to create detailed customer personas based on the marketing briefing. Include demographics, behavior patterns, motivations, goals, pain points, and preferred communication channels.`,
      'edit': `${basePrompt} Your task is to refine and improve existing customer personas based on feedback and additional information.`
    },
    'contentStrategy': {
      'generate': `${basePrompt} Your task is to create a comprehensive content strategy with content pillars based on the provided keyword, target audience, and business goals. Include subtopics, content ideas, and distribution recommendations.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing content strategy based on feedback and updated information.`
    },
    'uspGenerator': {
      'generate': `${basePrompt} Your task is to create compelling unique selling propositions (USPs) that differentiate the business from competitors based on the provided information.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing unique selling proposition based on feedback and updated information.`
    },
    'campaignIdeas': {
      'generate': `${basePrompt} Your task is to create innovative marketing campaign ideas tailored to the business goals, target audience, and industry provided.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing marketing campaign idea based on feedback and updated information.`
    },
    'leadMagnets': {
      'generate': `${basePrompt} Your task is to create effective lead magnet ideas that will attract the target audience and convert them into leads.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing lead magnet idea based on feedback and updated information.`
    },
    'adCreative': {
      'generate': `${basePrompt} Your task is to create compelling ad copy and creative concepts for the specified platform and audience.`,
      'edit': `${basePrompt} Your task is to refine and improve existing ad creative based on feedback and updated performance data.`
    },
    'channelStrategy': {
      'generate': `${basePrompt} Your task is to recommend the optimal marketing channel mix based on the business goals, budget, and target audience provided.`,
      'edit': `${basePrompt} Your task is to refine and improve an existing channel strategy based on feedback and updated performance data.`
    },
    'usp_canvas_profile': {
      'generate': `${basePrompt} Your task is to create a comprehensive customer profile for a Value Proposition Canvas based on the provided briefing and persona information. Focus on customer jobs (tasks they're trying to accomplish), pains (problems, risks, negative experiences), and gains (positive outcomes, benefits). Make each item specific, concrete and actionable.`
    },
    'usp_canvas_value_map': {
      'generate': `${basePrompt} Your task is to create a value map for a Value Proposition Canvas that directly addresses the customer profile. Focus on products/services that help customers complete jobs, pain relievers that address specific customer pains, and gain creators that produce customer gains. Make sure each item relates directly to specific elements in the customer profile.`
    }
  };
  
  return modulePrompts[module]?.[action] || basePrompt;
}

function constructUserPrompt(module: string, action: string, data: any): string {
  switch (module) {
    case 'briefing':
      return `I need to create a marketing strategy briefing for:
      - Strategy ID: ${data.strategyId}
      - Strategy Name: ${data.formData?.name || ''}
      - Company Name: ${data.formData?.companyName || ''}
      - Website URL: ${data.formData?.websiteUrl || ''}
      - Product/Service Description: ${data.formData?.productDescription || data.formData?.description || ''}
      - Additional Information: ${data.formData?.additionalInfo || ''}
      
      Please provide a comprehensive marketing strategy briefing that includes:
      1. An overview of the company and its offerings
      2. Target audience analysis
      3. Key marketing channels to prioritize
      4. Key benefits of the product/service to highlight
      5. Call to action and next steps`;
    
    case 'persona':
      return `I need to create detailed customer personas based on the following marketing briefing:

      ${data.briefingContent}
      
      Please provide detailed customer persona(s) that include:
      1. Demographics (age, gender, income, education, job position)
      2. Behavioral traits and motivations
      3. Goals and challenges
      4. Pain points and objections
      5. Preferred communication channels and content types
      6. Decision-making factors
      7. Buying journey stages
      
      Format the personas in a clear, structured way that can be used for developing targeted marketing strategies.`;
    
    case 'contentStrategy':
      return `I need to create a content strategy for my business with these details:
      - Main Topic/Keyword: ${data.keyword}
      - Target Audience: ${data.targetAudience}
      - Business Industry/Goals: ${data.businessGoals}
      - Brand Tone: ${data.tone || 'Professional'}
      ${data.additionalInfo ? `- Additional Information: ${data.additionalInfo}` : ''}
      ${data.marketingGoals?.length > 0 ? `- Marketing Goals: ${data.marketingGoals.join(', ')}` : ''}
      ${data.existingContent ? `- Existing Content: ${data.existingContent}` : ''}
      ${data.competitorInsights ? `- Competitor Insights: ${data.competitorInsights}` : ''}
      
      Please provide a detailed content strategy with:
      1. A main content pillar focused on the keyword
      2. 4-5 key subtopics related to the main content pillar
      3. Content ideas for each subtopic (3 per subtopic)
      4. Relevant keywords to target
      5. Recommended content formats
      6. Suggested distribution channels`;
    
    case 'uspGenerator':
      return `I need to create unique selling propositions for:
      - Business: ${data.businessName}
      - Industry: ${data.industry}
      - Target Audience: ${data.targetAudience}
      - Key Features: ${data.keyFeatures}
      - Competitor Weaknesses: ${data.competitorWeaknesses}
      - Business Values: ${data.businessValues?.join(', ')}
      - Business Strengths: ${data.businessStrengths?.join(', ')}
      - Customer Pain Points: ${data.customerPainPoints}
      
      Please generate 3 compelling unique selling propositions with supporting points and differentiators.`;
    
    case 'usp_canvas_profile':
      let profileSection = data.section || 'all';
      let prompt = `I need to create a customer profile for a Value Proposition Canvas based on the following marketing briefing:\n\n${data.briefingContent}\n\n`;
      
      // Add persona data if available
      if (data.personaContent) {
        prompt += `Consider the following target persona when creating the customer profile:\n\n${data.personaContent}\n\n`;
      }
      
      prompt += `${profileSection === 'all' ? 'Please provide all three components of the customer profile:' : `Please focus only on the "${profileSection}" section of the customer profile:`}\n\n`;
      
      if (profileSection === 'all' || profileSection === 'jobs') {
        prompt += `1. Customer Jobs: What are the functional, social, and emotional jobs your customer is trying to get done? Include key tasks they're trying to complete, problems they're trying to solve, or needs they're trying to satisfy. For each job, indicate its priority (high, medium, or low).\n\n`;
      }
      
      if (profileSection === 'all' || profileSection === 'pains') {
        prompt += `2. Customer Pains: What are the negative outcomes, risks, obstacles, or bad experiences your customer encounters when trying to complete their jobs? For each pain, indicate its severity (high, medium, or low).\n\n`;
      }
      
      if (profileSection === 'all' || profileSection === 'gains') {
        prompt += `3. Customer Gains: What benefits and positive outcomes does your customer expect, desire, or would be surprised by? For each gain, indicate its importance (high, medium, or low).\n\n`;
      }
      
      prompt += `Format your response in a structured way, with clearly labeled sections for each component.`;
      return prompt;
    
    case 'usp_canvas_value_map':
      let valueMapSection = data.section || 'all';
      let valueMapPrompt = `I need to create a value map for a Value Proposition Canvas that addresses the following customer profile:\n\n${JSON.stringify(data.customerProfile, null, 2)}\n\n`;
      
      valueMapPrompt += `Additional context from the marketing briefing:\n${data.briefingContent}\n\n`;
      
      // Add persona data if available
      if (data.personaContent) {
        valueMapPrompt += `Consider this persona when creating value propositions:\n\n${data.personaContent}\n\n`;
      }
      
      valueMapPrompt += `${valueMapSection === 'all' ? 'Please provide all three components of the value map:' : `Please focus only on the "${valueMapSection}" section of the value map:`}\n\n`;
      
      if (valueMapSection === 'all' || valueMapSection === 'products') {
        valueMapPrompt += `1. Products & Services: What products and services do you offer that help your customer get their functional, social, and emotional jobs done? These should be linked to specific customer jobs where possible.\n\n`;
      }
      
      if (valueMapSection === 'all' || valueMapSection === 'painRelievers') {
        valueMapPrompt += `2. Pain Relievers: How do your products and services alleviate customer pains? Describe how they eliminate or reduce negative outcomes, obstacles, and risks. These should be linked to specific customer pains where possible.\n\n`;
      }
      
      if (valueMapSection === 'all' || valueMapSection === 'gainCreators') {
        valueMapPrompt += `3. Gain Creators: How do your products and services create customer gains? Describe how they produce outcomes and benefits that match your customer's expectations, desires, or would surprise them. These should be linked to specific customer gains where possible.\n\n`;
      }
      
      valueMapPrompt += `Format your response in a structured way, with clearly labeled sections for each component.`;
      return valueMapPrompt;
    
    default:
      return JSON.stringify(data);
  }
}

function parseAIResult(module: string, action: string, result: string): any {
  try {
    // For content strategy parsing
    if (module === 'contentStrategy' && action === 'generate') {
      // Extract the content pillar data from the free-text response
      // This is a simplified parsing approach - in production you might want more robust parsing
      
      // Find potential subtopics
      const subtopicRegex = /(?:Key Subtopics?|Subtopics?):(.*?)(?:Content Ideas?|Keywords?|$)/gsi;
      const subtopicsMatch = subtopicRegex.exec(result);
      
      let subtopics: any[] = [];
      if (subtopicsMatch && subtopicsMatch[1]) {
        // Extract numbered or bulleted subtopics
        const subtopicLines = subtopicsMatch[1].split('\n').filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/));
        subtopics = subtopicLines.map(line => {
          const cleanLine = line.replace(/^[\d\.\*\-\•]+\s+/, '').trim();
          return {
            id: crypto.randomUUID(),
            title: cleanLine,
            description: `Subtopic about ${cleanLine}`,
            contentIdeas: [] // Will be filled later
          };
        });
      }
      
      // Find content ideas for each subtopic
      const ideasRegex = /(?:Content Ideas?|Content Suggestions?):(.*?)(?:Keywords?|Formats?|Channels?|$)/gsi;
      const ideasMatch = ideasRegex.exec(result);
      
      if (ideasMatch && ideasMatch[1] && subtopics.length > 0) {
        const ideasSection = ideasMatch[1].trim();
        
        // Attempt to match ideas with subtopics
        subtopics.forEach((subtopic, index) => {
          const subtopicRegex = new RegExp(`(?:${subtopic.title}|Subtopic ${index + 1}):(.*?)(?:${index < subtopics.length - 1 ? `(?:${subtopics[index+1].title}|Subtopic ${index + 2}):|$` : '$'})`, 'gsi');
          const subtopicIdeasMatch = subtopicRegex.exec(ideasSection);
          
          if (subtopicIdeasMatch && subtopicIdeasMatch[1]) {
            const ideaLines = subtopicIdeasMatch[1].split('\n').filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/));
            subtopic.contentIdeas = ideaLines.map(line => {
              const cleanLine = line.replace(/^[\d\.\*\-\•]+\s+/, '').trim();
              return {
                id: crypto.randomUUID(),
                title: cleanLine,
                description: cleanLine,
                format: 'Blog Post'
              };
            });
          }
        });
      }
      
      // Extract keywords
      const keywordsRegex = /(?:Keywords?|Key Phrases?):(.*?)(?:Formats?|Channels?|$)/gsi;
      const keywordsMatch = keywordsRegex.exec(result);
      
      let keywords: string[] = [];
      if (keywordsMatch && keywordsMatch[1]) {
        const keywordLines = keywordsMatch[1].split('\n').filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/));
        keywords = keywordLines.map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim());
      }
      
      // Extract formats
      const formatsRegex = /(?:Content Formats?|Recommended Formats?):(.*?)(?:Channels?|Distribution?|$)/gsi;
      const formatsMatch = formatsRegex.exec(result);
      
      let formats: string[] = [];
      if (formatsMatch && formatsMatch[1]) {
        const formatLines = formatsMatch[1].split('\n').filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/));
        formats = formatLines.map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim());
      }
      
      // Extract channels
      const channelsRegex = /(?:Distribution Channels?|Channels?):(.*?)$/gsi;
      const channelsMatch = channelsRegex.exec(result);
      
      let channels: string[] = [];
      if (channelsMatch && channelsMatch[1]) {
        const channelLines = channelsMatch[1].split('\n').filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/));
        channels = channelLines.map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim());
      }
      
      return {
        title: subtopics.length > 0 ? subtopics[0].title : "Content Strategy",
        description: `A comprehensive content strategy focused on ${subtopics[0]?.title || "the main topic"}`,
        subtopics: subtopics,
        keywords: keywords,
        formats: formats,
        channels: channels,
        createdAt: new Date()
      };
    }
    
    // Parse USP Generator results
    if (module === 'uspGenerator' && action === 'generate') {
      // Simple approach for demo - extract the USPs based on structure
      const uspSections = result.split(/(?:USP|Unique Selling Proposition) #\d+:/gi).filter(Boolean);
      
      return uspSections.map(section => {
        const titleMatch = section.match(/(?:Title|Headline):\s*(.*?)(?:\n|$)/i);
        const descriptionMatch = section.match(/(?:Description|Summary):\s*(.*?)(?:\n|$)/i);
        const supportPointsMatch = section.toString().match(/(?:Supporting Points|Key Points|Evidence):([\s\S]*?)(?:Differentiators|Applications|$)/i);
        const differentiatorMatch = section.toString().match(/(?:Differentiators|What Sets Apart):([\s\S]*?)(?:Applications|Where to Use|$)/i);
        const applicationMatch = section.toString().match(/(?:Applications|Where to Use):([\s\S]*?)$/i);
        
        const supportingPoints = supportPointsMatch && supportPointsMatch[1] ? 
          supportPointsMatch[1].split('\n')
            .filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/))
            .map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim())
          : [];
            
        const differentiators = differentiatorMatch && differentiatorMatch[1] ? 
          differentiatorMatch[1].split('\n')
            .filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/))
            .map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim())
          : [];
            
        const applicationAreas = applicationMatch && applicationMatch[1] ? 
          applicationMatch[1].split('\n')
            .filter(line => line.trim().match(/^[\d\.\*\-\•]+\s+/))
            .map(line => line.replace(/^[\d\.\*\-\•]+\s+/, '').trim())
          : [];
        
        return {
          id: crypto.randomUUID(),
          title: titleMatch ? titleMatch[1].trim() : "Unique Selling Proposition",
          description: descriptionMatch ? descriptionMatch[1].trim() : section.substring(0, 100).trim(),
          audience: "", // To be filled from request data
          supportingPoints: supportingPoints,
          differentiators: differentiators,
          applicationAreas: applicationAreas,
          createdAt: new Date()
        };
      });
    }
    
    // For persona generation, just return raw output
    if (module === 'persona' && action === 'generate') {
      return { rawOutput: result };
    }

    // Parse USP Canvas Profile results
    if (module === 'usp_canvas_profile' && action === 'generate') {
      const uspCanvasResult: {
        jobs?: Array<{content: string, priority: 'low' | 'medium' | 'high'}>,
        pains?: Array<{content: string, severity: 'low' | 'medium' | 'high'}>,
        gains?: Array<{content: string, importance: 'low' | 'medium' | 'high'}>
      } = {};
      
      // Extract customer jobs
      const jobsRegex = /(?:Customer Jobs|Jobs)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const jobsMatch = result.match(jobsRegex);
      
      if (jobsMatch && jobsMatch[1]) {
        uspCanvasResult.jobs = jobsMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => {
            const content = line.replace(/^[-•*]|^\d+\./, '').trim();
            // Check for priority indicators in the content
            let priority: 'low' | 'medium' | 'high' = 'medium';
            
            if (content.toLowerCase().includes('priority: high') || 
                content.toLowerCase().includes('high priority')) {
              priority = 'high';
            } else if (content.toLowerCase().includes('priority: low') || 
                      content.toLowerCase().includes('low priority')) {
              priority = 'low';
            }
            
            // Remove any priority text from the content
            const cleanContent = content
              .replace(/priority: (high|medium|low)/i, '')
              .replace(/(high|medium|low) priority/i, '')
              .trim();
              
            return {
              content: cleanContent,
              priority
            };
          });
      }
      
      // Extract customer pains
      const painsRegex = /(?:Customer Pains|Pains)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const painsMatch = result.match(painsRegex);
      
      if (painsMatch && painsMatch[1]) {
        uspCanvasResult.pains = painsMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => {
            const content = line.replace(/^[-•*]|^\d+\./, '').trim();
            // Check for severity indicators in the content
            let severity: 'low' | 'medium' | 'high' = 'medium';
            
            if (content.toLowerCase().includes('severity: high') || 
                content.toLowerCase().includes('high severity')) {
              severity = 'high';
            } else if (content.toLowerCase().includes('severity: low') || 
                      content.toLowerCase().includes('low severity')) {
              severity = 'low';
            }
            
            // Remove any severity text from the content
            const cleanContent = content
              .replace(/severity: (high|medium|low)/i, '')
              .replace(/(high|medium|low) severity/i, '')
              .trim();
              
            return {
              content: cleanContent,
              severity
            };
          });
      }
      
      // Extract customer gains
      const gainsRegex = /(?:Customer Gains|Gains)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const gainsMatch = result.match(gainsRegex);
      
      if (gainsMatch && gainsMatch[1]) {
        uspCanvasResult.gains = gainsMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => {
            const content = line.replace(/^[-•*]|^\d+\./, '').trim();
            // Check for importance indicators in the content
            let importance: 'low' | 'medium' | 'high' = 'medium';
            
            if (content.toLowerCase().includes('importance: high') || 
                content.toLowerCase().includes('high importance')) {
              importance = 'high';
            } else if (content.toLowerCase().includes('importance: low') || 
                      content.toLowerCase().includes('low importance')) {
              importance = 'low';
            }
            
            // Remove any importance text from the content
            const cleanContent = content
              .replace(/importance: (high|medium|low)/i, '')
              .replace(/(high|medium|low) importance/i, '')
              .trim();
              
            return {
              content: cleanContent,
              importance
            };
          });
      }
      
      return uspCanvasResult;
    }
    
    // Parse USP Canvas Value Map results
    if (module === 'usp_canvas_value_map' && action === 'generate') {
      const valueMapResult: {
        products?: Array<{content: string, relatedJobIds?: string[]}>,
        painRelievers?: Array<{content: string, relatedPainIds?: string[]}>,
        gainCreators?: Array<{content: string, relatedGainIds?: string[]}>
      } = {};
      
      // Extract products & services (similar approach as above)
      const productsRegex = /(?:Products & Services|Products and Services)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const productsMatch = result.match(productsRegex);
      
      if (productsMatch && productsMatch[1]) {
        valueMapResult.products = productsMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => ({
            content: line.replace(/^[-•*]|^\d+\./, '').trim(),
            relatedJobIds: [] // These would need to be connected by the user in the UI
          }));
      }
      
      // Extract pain relievers
      const painRelieversRegex = /(?:Pain Relievers)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const painRelieversMatch = result.match(painRelieversRegex);
      
      if (painRelieversMatch && painRelieversMatch[1]) {
        valueMapResult.painRelievers = painRelieversMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => ({
            content: line.replace(/^[-•*]|^\d+\./, '').trim(),
            relatedPainIds: [] // These would need to be connected by the user in the UI
          }));
      }
      
      // Extract gain creators
      const gainCreatorsRegex = /(?:Gain Creators)[\s\S]*?((?:(?:[-•*]\s*|[0-9]+\.\s*).+(?:\n|$))+)/im;
      const gainCreatorsMatch = result.match(gainCreatorsRegex);
      
      if (gainCreatorsMatch && gainCreatorsMatch[1]) {
        valueMapResult.gainCreators = gainCreatorsMatch[1].split('\n')
          .filter(line => line.trim().match(/^[-•*]|^\d+\./))
          .map(line => ({
            content: line.replace(/^[-•*]|^\d+\./, '').trim(),
            relatedGainIds: [] // These would need to be connected by the user in the UI
          }));
      }
      
      return valueMapResult;
    }
    
    // Default parsing behavior - just return the result as-is
    return { rawOutput: result };
    
  } catch (error) {
    console.error("Error parsing AI result:", error);
    return { error: "Failed to parse AI response", raw: result };
  }
}
