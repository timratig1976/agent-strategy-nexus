
import { toast } from "sonner";

interface CrawlOptions {
  limit?: number;
  formats?: string[];
  timeout?: number;
}

export interface WebsiteCrawlResult {
  success: boolean;
  pagesCrawled: number;
  contentExtracted: boolean;
  summary: string;
  keywordsFound: string[];
  technologiesDetected: string[];
  data: any[];
  id?: string | null;
  url: string;
  status?: string;
  error?: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('FireCrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      // A simple test crawl to verify the API key
      const testResponse = await this.crawlWithApiKey('https://example.com', apiKey, { limit: 1 });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string, options?: CrawlOptions): Promise<WebsiteCrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }

    return this.crawlWithApiKey(url, apiKey, options);
  }

  static async crawlWithApiKey(url: string, apiKey: string, options?: CrawlOptions): Promise<WebsiteCrawlResult> {
    try {
      console.log('Making initial crawl request to Firecrawl API for URL:', url);
      
      // Build request options - Using markdown format only
      const requestOptions: CrawlOptions = {
        limit: options?.limit || 10,
        formats: options?.formats || ['markdown'],
        timeout: options?.timeout || 30000
      };
      
      // Make initial POST request to start the crawl - Using /scrape endpoint
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: url,
          limit: requestOptions.limit,
          scrapeOptions: {
            formats: requestOptions.formats,
            timeout: requestOptions.timeout
          }
        }),
      });
      
      if (!response.ok) {
        // Handle API errors
        const errorData = await response.json();
        console.error("FireCrawl API error:", errorData);
        
        return {
          success: false,
          pagesCrawled: 0,
          contentExtracted: false,
          summary: `Error: ${errorData.message || response.statusText}`,
          keywordsFound: [],
          technologiesDetected: [],
          data: [],
          url: url,
          error: errorData.message || `API returned ${response.status}: ${response.statusText}`
        };
      }
      
      // Parse the initial response which contains the crawl ID and result URL
      const initialResponse = await response.json();
      console.log("FireCrawl initial response:", initialResponse);
      
      if (!initialResponse.id) {
        throw new Error('No crawl ID returned from Firecrawl API');
      }
      
      // Begin polling for results - Using /scrape endpoint
      const resultUrl = `https://api.firecrawl.dev/v1/scrape/${initialResponse.id}`;
      console.log("Polling for crawl results from:", resultUrl);
      
      // Polling configuration
      const maxRetries = 10; // Maximum number of polling attempts
      const pollingDelay = 3000; // 3 seconds between polls
      let attempts = 0;
      let detailedResults: any = null;
      
      // Start polling loop
      while (attempts < maxRetries) {
        console.log(`Polling attempt ${attempts + 1} of ${maxRetries}`);
        
        const detailsResponse = await fetch(resultUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        });
        
        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json();
          console.error("Error fetching crawl details:", errorData);
          throw new Error(`Failed to fetch crawl details: ${errorData.message || detailsResponse.statusText}`);
        }
        
        detailedResults = await detailsResponse.json();
        console.log("Crawl status:", detailedResults.status);
        
        // Check if the crawl is complete
        if (detailedResults.status === "completed" || 
            detailedResults.status === "completed_with_errors" || 
            detailedResults.status === "failed") {
          console.log("Crawl completed with status:", detailedResults.status);
          break; // Exit polling loop if we have a completion status
        }
        
        // If still processing, wait before next attempt
        if (detailedResults.status === "scraping" || detailedResults.status === "processing") {
          console.log(`Crawl in progress (${detailedResults.status}), waiting before next poll...`);
          await new Promise(resolve => setTimeout(resolve, pollingDelay));
          attempts++;
          continue;
        }
        
        // For any unexpected status, just use what we have
        console.log("Unexpected status received:", detailedResults.status);
        break;
      }
      
      // If we reached max attempts but crawl is still in progress
      if (attempts >= maxRetries && 
          (detailedResults.status === "scraping" || detailedResults.status === "processing")) {
        console.log("Maximum polling attempts reached. Returning partial results.");
        detailedResults.status = "timeout";
        detailedResults.message = "Crawl is taking longer than expected. Partial results returned.";
      }
      
      // Process the results
      console.log("Processing final crawl results:", detailedResults);
      return this.processApiResponse(detailedResults, url);
    } catch (error) {
      console.error("Error crawling website:", error);
      // Return the error directly instead of using a fallback
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred during crawl'}`,
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error occurred during crawl'
      };
    }
  }
  
  private static processApiResponse(apiResponse: any, url: string): WebsiteCrawlResult {
    // Check if we have valid content in the response
    const hasData = apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0;
    
    // Process the data regardless of content "quality"
    const processedData: WebsiteCrawlResult = {
      success: true,
      pagesCrawled: apiResponse.data?.length || 0,
      contentExtracted: hasData, // Only true if we actually have data
      summary: hasData ? this.extractSummary(apiResponse.data) : "No content was extracted from the website.",
      keywordsFound: hasData ? this.extractKeywords(apiResponse.data) : [],
      technologiesDetected: hasData ? this.detectTechnologies(apiResponse.data) : [],
      data: apiResponse.data || [],
      id: apiResponse.id || null,
      url: url,
      status: apiResponse.status || 'completed'
    };
    
    return processedData;
  }
  
  // Extract summary from crawled data
  private static extractSummary(data: any[]): string {
    if (!data || data.length === 0) return "No content was extracted from the website.";
    
    // Get the main page content and create a better summary
    let metaDescription = '';
    
    // Check for meta description first as it's often the highest quality summary
    for (const page of data) {
      if (page.metadata && page.metadata.description && page.metadata.description.length > 30) {
        metaDescription = page.metadata.description;
        break;
      }
    }
    
    if (metaDescription) {
      return metaDescription.length > 300 ? metaDescription.substring(0, 300) + "..." : metaDescription;
    }
    
    // Prioritize content from index/home page if available
    const homePage = data.find(page => 
      (page.url && (
        page.url.endsWith('/') || 
        page.url.endsWith('/index.html') || 
        !page.url.includes('/')
      ))
    ) || data[0];
    
    if (homePage?.content) {
      return homePage.content.substring(0, 300) + "...";
    }
    
    return "Content was extracted but no meaningful summary could be generated.";
  }
  
  private static extractKeywords(data: any[]): string[] {
    if (!data || data.length === 0) return [];
    
    const keywords = new Set<string>();
    
    // Extract keywords from metadata
    data.forEach(page => {
      if (page.metadata && page.metadata.keywords) {
        page.metadata.keywords.split(',')
          .map((kw: string) => kw.trim().toLowerCase())
          .filter((kw: string) => kw && kw.length > 2)
          .forEach((kw: string) => keywords.add(kw));
      }
      
      // Extract from title
      if (page.title) {
        this.extractCommonWords(page.title.toLowerCase(), 3).forEach(word => keywords.add(word));
      }
    });
    
    // If not enough keywords, extract from content
    if (keywords.size < 5 && data[0] && data[0].content) {
      const commonWords = this.extractCommonWords(data[0].content.toLowerCase(), 10);
      commonWords.forEach(word => keywords.add(word));
    }
    
    return Array.from(keywords).slice(0, 15);
  }
  
  private static detectTechnologies(data: any[]): string[] {
    if (!data || data.length === 0) return [];
    
    const technologies = new Set<string>();
    const techSignatures: Record<string, string[]> = {
      'WordPress': ['wp-content', 'wp-includes', 'wordpress'],
      'React': ['react', 'reactjs', 'jsx'],
      'Angular': ['ng-', 'angular', 'ngController'],
      'Vue.js': ['vue', 'nuxt', 'vuejs'],
      'Bootstrap': ['bootstrap', 'btn-primary'],
      'jQuery': ['jquery', '$("'],
      'Cloudflare': ['cloudflare', 'cdnjs.cloudflare'],
      'Next.js': ['next/static', '__next'],
      'Gatsby': ['gatsby-', '__gatsby'],
      'Tailwind CSS': ['tailwind', 'tw-']
    };
    
    // Check for technology signatures in HTML
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
  
  private static extractCommonWords(text: string, count: number): string[] {
    if (!text) return [];
    
    // Basic stop words (simplified)
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
      'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'of', 'this'
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
}
