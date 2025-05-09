
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
    
    console.log(`Starting to crawl URL: ${url}`);
    
    // Normalize the URL - add https:// if missing
    const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    try {
      // Call the crawler service to fetch website data
      const crawlResult = await crawlWebsite(normalizedUrl, FIRECRAWL_API_KEY);
      console.log("Raw crawl result received, checking content quality");
      
      // Check if we have substantial content
      if (!hasSubstantialContent(crawlResult)) {
        console.log("No substantial content was extracted from the website. Using enhanced fallback.");
        
        // Try to extract any metadata or information from the response
        const enhancedResults = enhanceEmptyResults(crawlResult, normalizedUrl);
        
        return new Response(JSON.stringify(enhancedResults), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Process and enrich the data
      console.log(`Processing data from ${crawlResult.data?.length || 0} pages`);
      
      const processedData = {
        success: true,
        pagesCrawled: crawlResult.data?.length || 0,
        contentExtracted: true,
        summary: extractSummary(crawlResult.data),
        keywordsFound: extractKeywords(crawlResult.data),
        technologiesDetected: detectTechnologies(crawlResult.data),
        data: crawlResult.data || [],
        id: crawlResult.id || null,
        url: normalizedUrl
      };
      
      console.log("Data processing complete, returning result");

      return new Response(JSON.stringify(processedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (crawlError) {
      console.error('Crawl operation failed:', crawlError);
      
      // Create a fallback response with domain information
      console.log("Creating fallback response based on URL");
      const fallbackResponse = enhanceEmptyResults(null, normalizedUrl);
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
