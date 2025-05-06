
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CrawlerResultsProps {
  results: {
    pagesCrawled: number;
    contentExtracted: boolean;
    summary: string;
    keywordsFound: string[];
    technologiesDetected: string[];
  };
}

const WebsiteCrawlerResults: React.FC<CrawlerResultsProps> = ({ results }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Summary of content extracted from your website
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground">{results.summary}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded">
              <div className="text-sm text-muted-foreground">Pages Crawled</div>
              <div className="text-2xl font-semibold">{results.pagesCrawled}</div>
            </div>
            <div className="bg-muted p-3 rounded">
              <div className="text-sm text-muted-foreground">Technologies</div>
              <div className="text-2xl font-semibold">{results.technologiesDetected.length}</div>
            </div>
          </div>
        </div>

        <KeywordsList keywords={results.keywordsFound} />
        <TechnologiesList technologies={results.technologiesDetected} />
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full">
          Download Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};

interface KeywordsListProps {
  keywords: string[];
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => (
  <div>
    <h3 className="font-medium mb-2">Keywords Found</h3>
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword, index) => (
        <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          {keyword}
        </div>
      ))}
    </div>
  </div>
);

interface TechnologiesListProps {
  technologies: string[];
}

const TechnologiesList: React.FC<TechnologiesListProps> = ({ technologies }) => (
  <div>
    <h3 className="font-medium mb-2">Technologies Detected</h3>
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <div key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
          {tech}
        </div>
      ))}
    </div>
  </div>
);

export default WebsiteCrawlerResults;
