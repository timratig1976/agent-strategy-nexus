
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
      const htmlContent = partialData[0].html.toLowerCase();
      
      // Detect common frameworks and technologies
      if (htmlContent.includes('react') || htmlContent.includes('react-dom')) {
        detectedTechnologies.push("React");
      }
      if (htmlContent.includes('vue') || htmlContent.includes('vue.js')) {
        detectedTechnologies.push("Vue.js");
      }
      if (htmlContent.includes('angular') || htmlContent.includes('ng-')) {
        detectedTechnologies.push("Angular");
      }
      if (htmlContent.includes('wp-content') || htmlContent.includes('wordpress')) {
        detectedTechnologies.push("WordPress");
      }
      if (htmlContent.includes('cloudflare')) {
        detectedTechnologies.push("Cloudflare");
      }
      if (htmlContent.includes('javascript') || htmlContent.match(/script type=\"text\/javascript/g)) {
        detectedTechnologies.push("JavaScript Heavy");
      }
      if (htmlContent.includes('gatsby') || htmlContent.includes('___gatsby')) {
        detectedTechnologies.push("Gatsby");
      }
      if (htmlContent.includes('next') || htmlContent.includes('__next')) {
        detectedTechnologies.push("Next.js");
      }
    }
    
    // Check for common security headers in response
    if (crawlResult && crawlResult.headers) {
      if (crawlResult.headers['x-frame-options']) {
        detectedTechnologies.push("X-Frame-Options Protection");
      }
      if (crawlResult.headers['content-security-policy']) {
        detectedTechnologies.push("Content Security Policy");
      }
      if (crawlResult.headers['x-content-type-options']) {
        detectedTechnologies.push("X-Content-Type-Options Protection");
      }
    }
    
    // Get the title if available
    let title = possibleCompanyName + " Website";
    let description = "";
    if (partialData.length > 0) {
      if (partialData[0].title) {
        title = partialData[0].title;
      }
      
      // Try to extract meta description
      if (partialData[0].metadata && partialData[0].metadata.description) {
        description = partialData[0].metadata.description;
      }
    }
    
    // Extract any keywords we can find
    const keywords = [possibleCompanyName, title, domain];
    
    // Add possible industry terms if we can detect them
    if (title.toLowerCase().includes('software') || domain.includes('tech')) {
      keywords.push('Software', 'Technology');
    }
    if (title.toLowerCase().includes('market') || description.toLowerCase().includes('market')) {
      keywords.push('Marketing', 'Digital Marketing');
    }
    
    // Build a more helpful summary
    const summary = description ? 
      `The website ${domain} appears to be protected against web crawling. From the meta description we found: "${description}"` :
      `The website ${domain} appears to be protected against web crawling or uses technology that prevents content extraction. The site may be using JavaScript rendering or content protection techniques. Consider manually reviewing the website at ${url} to gather information for your marketing strategy.`;
    
    return {
      success: true,
      status: "completed",
      pagesCrawled: partialData.length || 1,
      contentExtracted: false,
      summary: summary,
      keywordsFound: [...new Set(keywords)], // Remove duplicates
      technologiesDetected: [...new Set(detectedTechnologies)], // Remove duplicates
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
