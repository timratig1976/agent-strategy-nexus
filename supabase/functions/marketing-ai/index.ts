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
    
    // Fetch custom prompt from database if available
    const { data: promptData, error: promptError } = await supabase
      .from('ai_prompts')
      .select('system_prompt, user_prompt')
      .eq('module', module)
      .maybeSingle();
    
    // Construct system prompt based on custom prompt or fallback to default
    let systemPrompt = "";
    if (promptData && promptData.system_prompt) {
      systemPrompt = promptData.system_prompt;
    } else {
      systemPrompt = getSystemPrompt(module, action);
    }
    
    // Create appropriate user prompt based on custom template or fallback to default
    let userPrompt = "";
    if (promptData && promptData.user_prompt) {
      // Replace variables in the template with actual data
      userPrompt = replacePlaceholders(promptData.user_prompt, data);
    } else {
      userPrompt = constructUserPrompt(module, action, data);
    }
    
    // Make OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use mini version for cost efficiency
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI Error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Parse the result based on module and action
    const parsedResult = parseAIResult(module, action, content);

    return new Response(JSON.stringify({ result: parsedResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in marketing-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
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
    }
  };
  
  return modulePrompts[module]?.[action] || basePrompt;
}

function constructUserPrompt(module: string, action: string, data: any): string {
  switch (module) {
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
    
    // Add similar constructions for other modules as needed
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
    
    // Add similar parsing functions for other modules
    
    // Default parsing behavior - just return the result as-is
    return { rawOutput: result };
    
  } catch (error) {
    console.error("Error parsing AI result:", error);
    return { error: "Failed to parse AI response", raw: result };
  }
}
