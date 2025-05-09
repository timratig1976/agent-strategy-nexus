
/**
 * Common text extraction utilities for FireCrawl content processing
 */

/**
 * Extract common words from text, excluding stop words
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

/**
 * Extract a summary from the content, preferably from meta description or home page
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
  
  if (homePage?.markdown) {
    return homePage.markdown.substring(0, 300) + "...";
  }
  
  return "Content was extracted but no meaningful summary could be generated.";
}

/**
 * Extract keywords from scraped content
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
    if (page.metadata && page.metadata.title) {
      extractCommonWords(page.metadata.title.toLowerCase(), 3).forEach(word => keywords.add(word));
    }
  });
  
  return Array.from(keywords).slice(0, 15);
}
