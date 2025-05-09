
/**
 * Processors for FireCrawl API responses
 */

/**
 * Extract keywords from scraped content
 */
export function extractKeywords(pageData: any): string[] {
  // Simple keyword extraction based on common patterns
  const keywords: string[] = [];
  
  if (pageData.markdown) {
    const content = pageData.markdown.toLowerCase();
    
    // Extract potential keywords from headings
    const headingMatches = content.match(/#{1,6}\s+([a-z0-9\s]+)/g) || [];
    headingMatches.forEach(match => {
      const keyword = match.replace(/#{1,6}\s+/, "").trim();
      if (keyword.length > 3 && !keywords.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    // Extract from bold or emphasized text
    const emphasisMatches = content.match(/(\*\*|__|\*|_)([a-z0-9\s]+)\1/g) || [];
    emphasisMatches.forEach(match => {
      const keyword = match.replace(/(\*\*|__|\*|_)/g, "").trim();
      if (keyword.length > 3 && !keywords.includes(keyword)) {
        keywords.push(keyword);
      }
    });
  }
  
  // Limit to top 10 keywords
  return keywords.slice(0, 10);
}

/**
 * Process scraped data into a consistent format
 */
export function processScrapedData(scrapeResult: any, url: string): any {
  // Extract the page data from the result
  const pageData = scrapeResult.data;
  
  // Process into a consistent format that only includes the markdown content and basic metadata
  return {
    success: true,
    pagesCrawled: 1, // Most scrapes are single page
    contentExtracted: !!pageData.markdown,
    summary: pageData.markdown ? pageData.markdown.substring(0, 300) + "..." : "Content successfully extracted",
    keywordsFound: extractKeywords(pageData),
    data: [{
      markdown: pageData.markdown || "",
      metadata: pageData.metadata || {}
    }], // Only include markdown and metadata
    url: url,
    id: scrapeResult.id || null
  };
}
