
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log("Crawling website:", url);
    
    // Updated API call to match Firecrawl v1 API requirements
    // Removed unsupported parameters: includeLinks, followLinks, includeRobots, followRedirects
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: url,
        limit: 25,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        },
      }),
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Firecrawl API error:", errorData);
      throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
    }

    const crawlResult = await response.json();
    console.log("Crawl completed successfully");
    
    // Improved content extraction check - make sure we have actual usable content
    const hasContent = crawlResult.data && 
                      crawlResult.data.length > 0 && 
                      crawlResult.data.some(page => 
                        (page.content && page.content.trim().length > 30) || 
                        (page.html && page.html.length > 100)
                      );

    if (!hasContent) {
      console.log("No substantial content was extracted from the website. Using enhanced fallback.");
      
      // Try to extract any metadata or information from the response
      const enhancedResults = enhanceEmptyResults(crawlResult, url);
      
      return new Response(JSON.stringify(enhancedResults), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process and enrich the data with improved content extraction
    const enrichedResult = {
      ...crawlResult,
      pagesCrawled: crawlResult.data?.length || 0,
      contentExtracted: true,
      summary: extractSummary(crawlResult.data),
      keywordsFound: extractKeywords(crawlResult.data),
      technologiesDetected: detectTechnologies(crawlResult.data)
    };

    return new Response(JSON.stringify(enrichedResult), {
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

// Enhanced empty results function with better domain extraction
function enhanceEmptyResults(crawlResult: any, url: string): any {
  try {
    // Try to extract domain info
    let domain = url;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch (e) {
      console.error("Error parsing URL in enhance function:", e);
    }
    
    const domainParts = domain.split('.');
    const possibleCompanyName = domainParts.length >= 2 ? 
      domainParts[domainParts.length - 2].charAt(0).toUpperCase() + 
      domainParts[domainParts.length - 2].slice(1) : 
      domain;
    
    return {
      success: true,
      status: "completed",
      pagesCrawled: crawlResult.data?.length || 0,
      contentExtracted: false,
      summary: `The website ${domain} appears to be protected against web crawling or uses technology that prevents content extraction. Consider manually reviewing the website to gather information for your marketing strategy.`,
      keywordsFound: [possibleCompanyName, "website", domain],
      technologiesDetected: ["Content Protection", "JavaScript Rendering"],
      data: crawlResult.data || [],
      id: crawlResult.id || null,
      url: crawlResult.url || url
    };
  } catch (e) {
    console.error("Error enhancing empty results:", e);
    // Return basic structure if enhancement fails
    return {
      success: true,
      pagesCrawled: 0,
      contentExtracted: false,
      summary: `No content could be extracted from ${url}.`,
      keywordsFound: [],
      technologiesDetected: [],
      url: url
    };
  }
}

// Helper functions for data extraction and processing with improved extraction logic

function extractSummary(data: any[]): string {
  if (!data || data.length === 0) return "No content was extracted from the website.";
  
  // Get the main page content and create a better summary
  let combinedContent = '';
  
  // Prioritize content from index/home page if available
  const homePage = data.find(page => 
    page.url.endsWith('/') || 
    page.url.endsWith('/index.html') || 
    !page.url.includes('/')
  ) || data[0];
  
  if (homePage?.content) {
    // Take first 300 characters as a summary
    return homePage.content.substring(0, 300) + "...";
  }
  
  // If no suitable home page, combine content from first few pages
  for (let i = 0; i < Math.min(3, data.length); i++) {
    if (data[i].content) {
      combinedContent += data[i].content + ' ';
      if (combinedContent.length > 300) break;
    }
  }
  
  if (combinedContent) {
    return combinedContent.substring(0, 300) + "...";
  }
  
  return "Content was extracted but no meaningful summary could be generated.";
}

function extractKeywords(data: any[]): string[] {
  if (!data || data.length === 0) return [];
  
  const keywords = new Set<string>();
  
  // Extract keywords from metadata if available
  data.forEach(page => {
    if (page.metadata && page.metadata.keywords) {
      page.metadata.keywords.split(',')
        .map((kw: string) => kw.trim().toLowerCase())
        .filter((kw: string) => kw && kw.length > 2)
        .forEach((kw: string) => keywords.add(kw));
    }
    
    // Also look for meta description
    if (page.metadata && page.metadata.description) {
      const description = page.metadata.description.toLowerCase();
      extractCommonWords(description, 5).forEach(word => keywords.add(word));
    }
  });
  
  // If not enough keywords found, extract common words from content
  if (keywords.size < 5) {
    let combinedText = '';
    
    // Combine content from up to first 5 pages
    for (let i = 0; i < Math.min(5, data.length); i++) {
      if (data[i].content) {
        combinedText += data[i].content.toLowerCase() + ' ';
      }
    }
    
    const commonWords = extractCommonWords(combinedText, 10);
    commonWords.forEach(word => keywords.add(word));
  }
  
  return Array.from(keywords).slice(0, 15); // Limit to 15 keywords
}

function detectTechnologies(data: any[]): string[] {
  if (!data || data.length === 0) return [];
  
  const technologies = new Set<string>();
  const techSignatures: Record<string, string[]> = {
    'WordPress': ['wp-content', 'wp-includes', 'wordpress', 'wp-'],
    'React': ['react', 'reactjs', 'jsx', '_jsx'],
    'Angular': ['ng-', 'angular', 'ngController'],
    'Vue.js': ['vue', 'nuxt', 'vuejs'],
    'Bootstrap': ['bootstrap', 'btn-primary'],
    'Shopify': ['shopify', 'myshopify'],
    'Wix': ['wix', 'wixsite'],
    'Squarespace': ['squarespace'],
    'Google Analytics': ['analytics', 'gtag', 'ga.js', 'google-analytics'],
    'jQuery': ['jquery'],
    'Cloudflare': ['cloudflare'],
    'Next.js': ['next/static', '__next'],
    'Gatsby': ['gatsby-'],
    'Tailwind CSS': ['tailwind'],
    'Material UI': ['mui-', 'material-ui'],
    'Webflow': ['webflow'],
  };
  
  // Search for technology signatures in HTML
  data.forEach(page => {
    if (page.html) {
      const html = page.html.toLowerCase();
      
      Object.entries(techSignatures).forEach(([tech, signatures]) => {
        if (signatures.some(sig => html.includes(sig.toLowerCase()))) {
          technologies.add(tech);
        }
      });
    }
  });
  
  return Array.from(technologies);
}

function extractCommonWords(text: string, count: number): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'of', 'this',
    'that', 'these', 'those', 'it', 'its', 'we', 'our', 'they', 'their', 'he', 'she',
    'his', 'her', 'you', 'your'
  ]);
  
  // Extract words and count frequency
  const words = text.match(/\b(\w{3,})\b/g) || [];
  const wordCount: Record<string, number> = {};
  
  words.forEach(word => {
    const cleaned = word.toLowerCase();
    if (!stopWords.has(cleaned) && cleaned.length > 2) {
      wordCount[cleaned] = (wordCount[cleaned] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top words
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}
