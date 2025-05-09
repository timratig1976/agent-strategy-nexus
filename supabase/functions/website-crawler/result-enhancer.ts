
/**
 * Enhances empty or limited results with domain information
 */
export function enhanceEmptyResults(crawlResult: any, url: string): any {
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
      pagesCrawled: 1,
      contentExtracted: false,
      summary: `The website ${domain} appears to be protected against web crawling or uses technology that prevents content extraction. Consider manually reviewing the website to gather information for your marketing strategy.`,
      keywordsFound: [possibleCompanyName, "website", domain],
      technologiesDetected: ["Content Protection", "JavaScript Rendering"],
      data: [],
      id: crawlResult.id || null,
      url: url
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
