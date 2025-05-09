
/**
 * Utility for detecting technologies used on websites
 */

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
