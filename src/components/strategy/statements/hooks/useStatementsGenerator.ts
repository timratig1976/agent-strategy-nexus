
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MarketingAIService } from '@/services/marketingAIService';

interface UseStatementsGeneratorProps {
  strategyId?: string;
}

export const useStatementsGenerator = ({ strategyId }: UseStatementsGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Generate statements with AI
  const generateStatements = useCallback(async (uspData: any) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return { painStatements: [], gainStatements: [] };
    }

    try {
      setIsGenerating(true);
      setProgressPercent(10);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgressPercent(prev => Math.min(prev + 5, 90));
      }, 1000);

      // Call the marketing AI service to generate statements
      const response = await MarketingAIService.generateContent('statements', 'generate', {
        strategyId,
        uspData
      });

      clearInterval(progressInterval);
      setProgressPercent(100);

      if (response.error) {
        toast.error(response.error);
        return { painStatements: [], gainStatements: [] };
      }

      // Process the response to extract pain and gain statements
      const result = response.data?.rawOutput || '';
      
      // Parse the results (this is a simple parsing logic, adjust as needed based on AI output)
      const painStatements = extractStatements(result, 'PAIN STATEMENTS');
      const gainStatements = extractStatements(result, 'GAIN STATEMENTS');

      return { 
        painStatements: painStatements.map(content => ({ 
          content, 
          impact: determineImpact(content) 
        })),
        gainStatements: gainStatements.map(content => ({ 
          content, 
          impact: determineImpact(content) 
        }))
      };
    } catch (error: any) {
      console.error('Error generating statements:', error);
      toast.error(error.message || 'Failed to generate statements');
      return { painStatements: [], gainStatements: [] };
    } finally {
      setIsGenerating(false);
      setProgressPercent(0);
    }
  }, [strategyId]);

  // Helper function to extract statements from AI response
  const extractStatements = (text: string, sectionTitle: string): string[] => {
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
      console.error('Error parsing statements:', error);
      return [];
    }
  };

  // Helper function to determine impact level based on content
  const determineImpact = (content: string): 'low' | 'medium' | 'high' => {
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
  };

  return {
    generateStatements,
    isGenerating,
    progressPercent
  };
};

export default useStatementsGenerator;
