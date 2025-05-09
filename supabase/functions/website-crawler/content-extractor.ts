
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
    (page.url && (
      page.url.endsWith('/') || 
      page.url.endsWith('/index.html') || 
      !page.url.includes('/')
    ))
  ) || data[0];
  
  if (homePage?.content) {
    // Take first 300 characters as a summary
    return homePage.content.substring(0, 300) + "...";
  }
  
  // If no suitable home page, combine content from first few pages
  for (let i = 0; i < Math.min(3, data.length); i++) {
    if (data[i] && data[i].content) {
      combinedContent += data[i].content + ' ';
      if (combinedContent.length > 300) break;
    }
  }
  
  if (combinedContent) {
    return combinedContent.substring(0, 300) + "...";
  }
  
  // If we have a title but no content, use that
  if (homePage?.title) {
    return `Website titled "${homePage.title}" was found, but no meaningful content could be extracted.`;
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
    
    // Extract from title
    if (page.title) {
      extractCommonWords(page.title.toLowerCase(), 3).forEach(word => keywords.add(word));
    }
  });
  
  // If not enough keywords found, extract common words from content
  if (keywords.size < 5) {
    let combinedText = '';
    
    // Combine content from up to first 5 pages
    for (let i = 0; i < Math.min(5, data.length); i++) {
      if (data[i] && data[i].content) {
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
    'React': ['react', 'reactjs', 'jsx', '_jsx', 'react-dom'],
    'Angular': ['ng-', 'angular', 'ngController', 'ng-app'],
    'Vue.js': ['vue', 'nuxt', 'vuejs', 'v-for', 'v-if'],
    'Bootstrap': ['bootstrap', 'btn-primary', 'container-fluid'],
    'Shopify': ['shopify', 'myshopify', 'shopify-section'],
    'Wix': ['wix', 'wixsite', '_wixCssImports'],
    'Squarespace': ['squarespace', 'static.squarespace'],
    'Google Analytics': ['analytics', 'gtag', 'ga.js', 'google-analytics', 'UA-'],
    'Google Tag Manager': ['gtm.js', 'googletagmanager'],
    'jQuery': ['jquery', '$("', '$(\'', '$.'],
    'Cloudflare': ['cloudflare', 'cdnjs.cloudflare'],
    'Next.js': ['next/static', '__next', '_next', 'NextPage'],
    'Gatsby': ['gatsby-', '__gatsby'],
    'Tailwind CSS': ['tailwind', 'tw-'],
    'Material UI': ['mui-', 'material-ui'],
    'Webflow': ['webflow'],
    'Font Awesome': ['fontawesome', 'fa-'],
    'TypeScript': ['typescript', 'ts-'],
    'PHP': ['php', '.php'],
    'WordPress WooCommerce': ['woocommerce', 'wc-'],
    'Elementor': ['elementor'],
    'Hubspot': ['hubspot', 'hs-'],
    'Mailchimp': ['mailchimp', 'mc-'],
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
    
    // Look for URLs that indicate technologies
    if (page.url) {
      const url = page.url.toLowerCase();
      if (url.includes('/wp-content/')) technologies.add('WordPress');
      if (url.includes('/wp-admin/')) technologies.add('WordPress');
      if (url.includes('/wp-includes/')) technologies.add('WordPress');
      if (url.includes('myshopify.com')) technologies.add('Shopify');
    }
  });
  
  return Array.from(technologies);
}

/**
 * Extracts common words from text
 */
export function extractCommonWords(text: string, count: number): string[] {
  if (!text) return [];
  
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'of', 'this',
    'that', 'these', 'those', 'it', 'its', 'we', 'our', 'they', 'their', 'he', 'she',
    'his', 'her', 'you', 'your', 'has', 'have', 'had', 'not', 'no', 'do', 'does', 
    'did', 'can', 'could', 'will', 'would', 'should', 'shall', 'may', 'might', 
    'must', 'as', 'from', 'when', 'where', 'why', 'how', 'what', 'who', 'whom',
    'which', 'whose', 'if', 'then', 'than', 'so'
  ]);
  
  // Extract words and count frequency
  const words = text.match(/\b(\w{3,})\b/g) || [];
  const wordCount: Record<string, number> = {};
  
  words.forEach(word => {
    const cleaned = word.toLowerCase();
    if (!stopWords.has(cleaned) && cleaned.length > 2 && !(/^\d+$/.test(cleaned))) {
      wordCount[cleaned] = (wordCount[cleaned] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top words
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}
