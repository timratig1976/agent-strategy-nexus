
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { crawlWebsite, hasSubstantialContent } from "./crawler-service.ts";
import { extractSummary, extractKeywords, detectTechnologies } from "./content-extractor.ts";
import { enhanceEmptyResults } from "./result-enhancer.ts";

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key is available
    if (!FIRECRAWL_API_KEY) {
      throw new Error("Missing Firecrawl API key. Please set FIRECRAWL_API_KEY in your environment variables.");
    }

    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }
    
    // Call the crawler service to fetch website data
    const crawlResult = await crawlWebsite(url, FIRECRAWL_API_KEY);
    console.log("Crawl completed successfully");
    
    // Check if we have substantial content
    if (!hasSubstantialContent(crawlResult)) {
      console.log("No substantial content was extracted from the website. Using enhanced fallback.");
      
      // Try to extract any metadata or information from the response
      const enhancedResults = enhanceEmptyResults(crawlResult, url);
      
      return new Response(JSON.stringify(enhancedResults), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process and enrich the data
    const processedData = {
      success: true,
      pagesCrawled: 1,
      contentExtracted: true,
      summary: extractSummary([{ content: crawlResult.data.content }]),
      keywordsFound: extractKeywords([{ content: crawlResult.data.content }]),
      technologiesDetected: detectTechnologies([{ html: crawlResult.data.html }]),
      data: [
        {
          url: url,
          content: crawlResult.data.content,
          html: crawlResult.data.html
        }
      ],
      id: crawlResult.id || null,
      url: url
    };

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in website crawler function:', error);
    
    // Return a more informative error response for debugging
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
