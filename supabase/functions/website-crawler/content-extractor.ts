
// Helper functions for content extraction and processing

/**
 * Extracts a summary from crawled data
 */
export function extractSummary(data: any[]): string {
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

/**
 * Extracts keywords from crawled data
 */
export function extractKeywords(data: any[]): string[] {
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

/**
 * Detects technologies used on the website
 */
export function detectTechnologies(data: any[]): string[] {
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

/**
 * Extracts common words from text
 */
export function extractCommonWords(text: string, count: number): string[] {
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

