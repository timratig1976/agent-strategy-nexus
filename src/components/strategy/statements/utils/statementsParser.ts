
import { GeneratedStatements } from '../services/statementsGeneratorService';

/**
 * Parse AI generated statements from raw output
 */
export function parseGeneratedStatements(rawOutput: string): GeneratedStatements {
  try {
    // Extract pain and gain statements from the AI response
    const painStatements = extractStatements(rawOutput, 'PAIN STATEMENTS');
    const gainStatements = extractStatements(rawOutput, 'GAIN STATEMENTS');

    return {
      painStatements: painStatements.map(content => ({ 
        content, 
        impact: determineImpact(content) 
      })),
      gainStatements: gainStatements.map(content => ({ 
        content, 
        impact: determineImpact(content) 
      })),
      rawOutput
    };
  } catch (error) {
    console.error('Error parsing statements:', error);
    return {
      painStatements: [],
      gainStatements: [],
      rawOutput
    };
  }
}

/**
 * Extract statements from AI response text
 */
export function extractStatements(text: string, sectionTitle: string): string[] {
  try {
    // This is a simplified extraction method, you might need to adjust based on actual AI output format
    const sectionRegex = new RegExp(`${sectionTitle}[\\s\\S]*?(?=\\n\\n|$)`, 'i');
    const section = text.match(sectionRegex)?.[0] || '';
    
    // Extract bullet points or numbered items
    const statementsArray = section
      .replace(sectionTitle, '')
      .split(/\n\s*[-*\d]+\.?\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    return statementsArray;
  } catch (error) {
    console.error('Error parsing statements section:', error);
    return [];
  }
}

/**
 * Determine impact level based on content
 */
export function determineImpact(content: string): 'low' | 'medium' | 'high' {
  // Simple heuristic based on statement length and key phrases
  const strongPhrases = ['critical', 'essential', 'significant', 'dramatic', 'extreme', 'urgent'];
  const mediumPhrases = ['important', 'considerable', 'substantial', 'notable'];
  
  const contentLower = content.toLowerCase();
  
  if (strongPhrases.some(phrase => contentLower.includes(phrase))) {
    return 'high';
  } else if (mediumPhrases.some(phrase => contentLower.includes(phrase))) {
    return 'medium';
  } else {
    return 'low';
  }
}
