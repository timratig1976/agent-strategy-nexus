
/**
 * Content processing utilities for FireCrawl results
 */

/**
 * Process API response data into a structured format
 */
export function processApiResponse(apiResponse: any, url: string): any {
  // Check if we have valid content in the response
  const hasData = apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0;
  
  // Process the data regardless of content "quality"
  const processedData = {
    success: true,
    pagesCrawled: apiResponse.data?.length || 0,
    contentExtracted: hasData, // Only true if we actually have data
    summary: hasData ? extractSummary(apiResponse.data) : "No content was extracted from the website.",
    keywordsFound: hasData ? extractKeywords(apiResponse.data) : [],
    technologiesDetected: hasData ? detectTechnologies(apiResponse.data) : [],
    data: apiResponse.data || [],
    id: apiResponse.id || null,
    url: url,
    status: apiResponse.status || 'completed'
  };
  
  return processedData;
}

/**
 * Extract summary from crawled data
 */
export function extractSummary(data: any[]): string {
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

/**
 * Extract keywords from crawled data
 */
export function extractKeywords(data: any[]): string[] {
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
      extractCommonWords(page.title.toLowerCase(), 3).forEach(word => keywords.add(word));
    }
  });
  
  // If not enough keywords, extract from content
  if (keywords.size < 5 && data[0] && data[0].content) {
    const commonWords = extractCommonWords(data[0].content.toLowerCase(), 10);
    commonWords.forEach(word => keywords.add(word));
  }
  
  return Array.from(keywords).slice(0, 15);
}

/**
 * Detect technologies used on the website
 */
export function detectTechnologies(data: any[]): string[] {
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

/**
 * Extract common words from text
 */
export function extractCommonWords(text: string, count: number): string[] {
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
