
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
 * Detect technologies used in the website with more accurate identification
 */
export function detectTechnologies(pageData: any): string[] {
  const technologies: Set<string> = new Set();
  
  if (!pageData) return [];
  
  // Function to check for technology signatures in HTML content
  const checkHtmlForTechnologies = (html: string) => {
    if (!html) return;
    
    const htmlLower = html.toLowerCase();
    
    // CMS systems
    if (htmlLower.includes('wp-content') || htmlLower.includes('wp-includes') || htmlLower.includes('wordpress')) 
      technologies.add("WordPress");
    
    if (htmlLower.includes('drupal')) 
      technologies.add("Drupal");
    
    if (htmlLower.includes('joomla')) 
      technologies.add("Joomla");
      
    if (htmlLower.includes('magento')) 
      technologies.add("Magento");
    
    // E-commerce platforms
    if (htmlLower.includes('woocommerce')) 
      technologies.add("WooCommerce");
    
    if (htmlLower.includes('shopify') || htmlLower.includes('shopify.com')) 
      technologies.add("Shopify");
    
    if (htmlLower.includes('bigcommerce')) 
      technologies.add("BigCommerce");
    
    // JavaScript frameworks
    if (htmlLower.includes('react') || htmlLower.includes('reactjs') || htmlLower.includes('_reactrootcontainer')) 
      technologies.add("React");
    
    if (htmlLower.includes('vue') || htmlLower.includes('vuejs') || htmlLower.includes('v-bind') || htmlLower.includes('v-on')) 
      technologies.add("Vue.js");
    
    if (htmlLower.includes('angular') || htmlLower.includes('ng-') || htmlLower.includes('ng-app')) 
      technologies.add("Angular");
    
    // CSS frameworks
    if (htmlLower.includes('bootstrap') || htmlLower.includes('navbar-toggler') || htmlLower.includes('btn-primary')) 
      technologies.add("Bootstrap");
    
    if (htmlLower.includes('tailwind') || htmlLower.includes('tw-') || htmlLower.includes('text-xl')) 
      technologies.add("Tailwind CSS");
      
    if (htmlLower.includes('bulma')) 
      technologies.add("Bulma");
    
    // JavaScript libraries
    if (htmlLower.includes('jquery') || htmlLower.includes('$("') || htmlLower.includes('$(\'')) 
      technologies.add("jQuery");
    
    if (htmlLower.includes('lodash') || htmlLower.includes('_.')) 
      technologies.add("Lodash");
    
    // Analytics & Marketing
    if (htmlLower.includes('google tag manager') || htmlLower.includes('gtm')) 
      technologies.add("Google Tag Manager");
    
    if (htmlLower.includes('google analytics') || htmlLower.includes('ga(')) 
      technologies.add("Google Analytics");
    
    if (htmlLower.includes('hubspot')) 
      technologies.add("HubSpot");
    
    if (htmlLower.includes('marketo')) 
      technologies.add("Marketo");
    
    if (htmlLower.includes('mailchimp')) 
      technologies.add("Mailchimp");
    
    // Web servers (harder to detect from HTML, but sometimes possible)
    if (htmlLower.includes('apache')) 
      technologies.add("Apache");
    
    if (htmlLower.includes('nginx')) 
      technologies.add("Nginx");
    
    // Static site generators
    if (htmlLower.includes('gatsby')) 
      technologies.add("Gatsby");
      
    if (htmlLower.includes('next') || htmlLower.includes('__next')) 
      technologies.add("Next.js");
  };
  
  // Check for technology signatures in HTML of all pages
  if (Array.isArray(pageData)) {
    for (const page of pageData) {
      if (page.html) {
        checkHtmlForTechnologies(page.html);
      } else if (page.content) {
        checkHtmlForTechnologies(page.content);
      }
    }
  } else {
    // Single page data
    if (pageData.html) {
      checkHtmlForTechnologies(pageData.html);
    } else if (pageData.content) {
      checkHtmlForTechnologies(pageData.content);
    }
  }
  
  return Array.from(technologies);
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
