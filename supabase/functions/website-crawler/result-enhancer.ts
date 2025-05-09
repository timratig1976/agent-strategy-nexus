
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
    
    // Detect any technologies we can from the partial data
    const detectedTechnologies = ["Website Protection"];
    if (partialData.length > 0 && partialData[0].html) {
      if (partialData[0].html.includes("cloudflare")) {
        detectedTechnologies.push("Cloudflare");
      }
      if (partialData[0].html.includes("javascript")) {
        detectedTechnologies.push("JavaScript Heavy");
      }
    }
    
    // Get the title if available
    let title = possibleCompanyName + " Website";
    if (partialData.length > 0 && partialData[0].title) {
      title = partialData[0].title;
    }
    
    return {
      success: true,
      status: "completed",
      pagesCrawled: partialData.length || 1,
      contentExtracted: false,
      summary: `The website ${domain} appears to be protected against web crawling or uses technology that prevents content extraction. The site may be using JavaScript rendering or content protection techniques. Consider manually reviewing the website at ${url} to gather information for your marketing strategy.`,
      keywordsFound: [possibleCompanyName, title, domain],
      technologiesDetected: detectedTechnologies,
      data: partialData,
      id: crawlResult?.id || null,
      url: url,
      protectedSite: true
    };
  } catch (e) {
    console.error("Error enhancing empty results:", e);
    // Return basic structure if enhancement fails
    return {
      success: true,
      pagesCrawled: 0,
      contentExtracted: false,
      summary: `No content could be extracted from ${url}. The site may be using protection mechanisms against automated crawling.`,
      keywordsFound: [],
      technologiesDetected: ["Unknown"],
      url: url,
      protectedSite: true
    };
  }
}
