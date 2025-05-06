
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { prompt, platform } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt parameter' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Modify the prompt based on the platform
    let finalPrompt = prompt;
    let size = "1024x1024";

    if (platform === "facebook" || platform === "instagram") {
      finalPrompt += " Create an engaging social media ad image for Facebook or Instagram.";
      size = "1024x1024"; // Square format works on both
    } else if (platform === "linkedin") {
      finalPrompt += " Create a professional looking ad image suitable for LinkedIn.";
      size = "1024x1024";
    } else if (platform === "twitter") {
      finalPrompt += " Create a concise, eye-catching image for Twitter.";
      size = "1024x512"; // Twitter's landscape orientation
    } else if (platform === "google_ads") {
      finalPrompt += " Create a clean, information-focused ad image for Google Display Network.";
      size = "1024x512";
    }

    console.log(`Generating image with prompt: ${finalPrompt}`);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: size,
        quality: "standard"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API returned error:', data.error);
      throw new Error(data.error.message || "Error generating image");
    }

    return new Response(
      JSON.stringify({
        image_url: data.data?.[0]?.url,
        revised_prompt: data.data?.[0]?.revised_prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
