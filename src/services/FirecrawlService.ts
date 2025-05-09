
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
  protectedSite?: boolean;
}

interface CrawlErrorResponse {
  success: false;
  error: string;
  details?: any[];
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
      console.log('Making crawl request to Firecrawl API for URL:', url);
      
      // Build request options
      const requestOptions: CrawlOptions = {
        limit: options?.limit || 10,
        formats: options?.formats || ['markdown', 'html'],
        timeout: options?.timeout || 30000
      };
      
      // Make direct API call to Firecrawl
      const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
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
        const errorData = await response.json() as CrawlErrorResponse;
        console.error("FireCrawl API error:", errorData);
        
        // Return a fallback result when the API fails
        return this.createFallbackResult(url, errorData);
      }
      
      const result = await response.json();
      console.log("FireCrawl crawl completed successfully");
      
      // Process and enhance the API response
      return this.processApiResponse(result, url);
    } catch (error) {
      console.error("Error crawling website:", error);
      return this.createFallbackResult(url, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
  
  private static processApiResponse(apiResponse: any, url: string): WebsiteCrawlResult {
    // Check if we have substantial content
    const hasContent = this.hasSubstantialContent(apiResponse);
    
    if (!hasContent) {
      console.log("No substantial content was extracted. Using enhanced fallback.");
      return this.enhanceEmptyResults(apiResponse, url);
    }
    
    // Process the data
    const processedData: WebsiteCrawlResult = {
      success: true,
      pagesCrawled: apiResponse.data?.length || 0,
      contentExtracted: true,
      summary: this.extractSummary(apiResponse.data),
      keywordsFound: this.extractKeywords(apiResponse.data),
      technologiesDetected: this.detectTechnologies(apiResponse.data),
      data: apiResponse.data || [],
      id: apiResponse.id || null,
      url: url
    };
    
    return processedData;
  }
  
  private static hasSubstantialContent(crawlResult: any): boolean {
    if (!crawlResult || !crawlResult.data || !Array.isArray(crawlResult.data)) {
      return false;
    }
    
    return crawlResult.data.some((page: any) => {
      // Check for substantial HTML content
      if (page.html && page.html.length > 500) {
        const hasStructuredContent = page.html.includes('<div') && 
                                    page.html.includes('<p') && 
                                    page.html.length > 1000;
        return hasStructuredContent;
      }
      
      // Check for substantial markdown content
      if (page.content && page.content.trim().length > 200) {
        const lowerContent = page.content.toLowerCase();
        const isErrorPage = lowerContent.includes('access denied') || 
                           lowerContent.includes('404') || 
                           lowerContent.includes('not found');
        return !isErrorPage;
      }
      
      return false;
    });
  }
  
  private static createFallbackResult(url: string, error: any): WebsiteCrawlResult {
    console.log("Creating fallback result for URL:", url);
    console.error("Original error:", error);
    
    return {
      success: false,
      pagesCrawled: 0,
      contentExtracted: false,
      summary: `Could not extract content from ${url}. The site may be protected against crawling or there might be a connection issue.`,
      keywordsFound: [],
      technologiesDetected: ["Unknown"],
      data: [],
      url: url,
      protectedSite: true
    };
  }
  
  private static enhanceEmptyResults(crawlResult: any, url: string): WebsiteCrawlResult {
    try {
      // Try to extract domain info
      let domain = url;
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname;
      } catch (e) {
        console.error("Error parsing URL in enhance function:", e);
      }
      
      // Extract company name from domain
      const domainParts = domain.split('.');
      const possibleCompanyName = domainParts.length >= 2 ? 
        domainParts[domainParts.length - 2].charAt(0).toUpperCase() + 
        domainParts[domainParts.length - 2].slice(1) : 
        domain;
      
      // Try to get any partial data that might be available
      let partialData = [];
      if (crawlResult && crawlResult.data && Array.isArray(crawlResult.data)) {
        partialData = crawlResult.data;
      }
      
      // Detect technologies from partial data
      const detectedTechnologies = ["Website Protection"];
      if (partialData.length > 0 && partialData[0].html) {
        const htmlContent = partialData[0].html.toLowerCase();
        
        // Basic technology detection
        if (htmlContent.includes('react') || htmlContent.includes('react-dom')) {
          detectedTechnologies.push("React");
        }
        if (htmlContent.includes('wordpress') || htmlContent.includes('wp-content')) {
          detectedTechnologies.push("WordPress");
        }
      }
      
      // Extract title and description if available
      let title = possibleCompanyName + " Website";
      let description = "";
      if (partialData.length > 0) {
        if (partialData[0].title) {
          title = partialData[0].title;
        }
        
        if (partialData[0].metadata && partialData[0].metadata.description) {
          description = partialData[0].metadata.description;
        }
      }
      
      // Extract keywords
      const keywords = [possibleCompanyName, title, domain];
      
      // Build summary
      const summary = description ? 
        `The website ${domain} appears to be protected against web crawling. From the meta description we found: "${description}"` :
        `The website ${domain} appears to be protected against crawling or uses technology that prevents content extraction.`;
      
      return {
        success: true,
        pagesCrawled: partialData.length || 1,
        contentExtracted: false,
        summary: summary,
        keywordsFound: [...new Set(keywords)],
        technologiesDetected: [...new Set(detectedTechnologies)],
        data: partialData,
        id: crawlResult?.id || null,
        url: url,
        protectedSite: true
      };
    } catch (e) {
      console.error("Error enhancing empty results:", e);
      return this.createFallbackResult(url, e);
    }
  }
  
  // Content extraction methods
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
