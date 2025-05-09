
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
 * Detect technologies used in the website
 */
export function detectTechnologies(pageData: any): string[] {
  const technologies: string[] = [];
  
  if (pageData.html) {
    const html = pageData.html.toLowerCase();
    
    // Check for common technologies
    if (html.includes("wordpress")) technologies.push("WordPress");
    if (html.includes("woocommerce")) technologies.push("WooCommerce");
    if (html.includes("shopify")) technologies.push("Shopify");
    if (html.includes("react")) technologies.push("React");
    if (html.includes("vue")) technologies.push("Vue.js");
    if (html.includes("angular")) technologies.push("Angular");
    if (html.includes("bootstrap")) technologies.push("Bootstrap");
    if (html.includes("tailwind")) technologies.push("Tailwind CSS");
    if (html.includes("jquery")) technologies.push("jQuery");
    if (html.includes("google tag manager")) technologies.push("Google Tag Manager");
    if (html.includes("google analytics")) technologies.push("Google Analytics");
    if (html.includes("hubspot")) technologies.push("HubSpot");
    if (html.includes("marketo")) technologies.push("Marketo");
    if (html.includes("mailchimp")) technologies.push("Mailchimp");
  }
  
  return technologies;
}

/**
 * Process scraped data into a consistent format
 */
export function processScrapedData(scrapeResult: any, url: string): any {
  // Extract the page data from the result
  const pageData = scrapeResult.data;
  
  // Process into a consistent format
  return {
    success: true,
    pagesCrawled: 1, // Most scrapes are single page
    contentExtracted: true,
    summary: pageData.markdown ? pageData.markdown.substring(0, 300) + "..." : "Content successfully extracted",
    keywordsFound: extractKeywords(pageData),
    technologiesDetected: detectTechnologies(pageData),
    data: [pageData], // Wrap in an array for consistency with crawl results
    url: url,
    id: scrapeResult.id || null
  };
}
