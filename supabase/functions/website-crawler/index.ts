
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    console.log("Crawling website:", url);

    // Sample response structure since we're not implementing the actual crawler here
    // In a real implementation, you would integrate with a website crawling service
    const crawlResult = {
      success: true,
      status: "completed",
      completed: 5,
      total: 5,
      creditsUsed: 1,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      data: [
        {
          url: url,
          title: "Sample Page Title",
          content: "This is sample content extracted from the website. In a real implementation, this would be actual content from the crawled pages.",
          metadata: {
            description: "Sample meta description",
            keywords: "sample, keywords"
          }
        },
        {
          url: `${url}/about`,
          title: "About Page",
          content: "About page content would appear here.",
          metadata: {
            description: "About page description",
            keywords: "about, company"
          }
        }
      ]
    };

    return new Response(JSON.stringify(crawlResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in website crawler function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
