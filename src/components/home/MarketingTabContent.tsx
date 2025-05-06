
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PenTool, BarChart3 } from "lucide-react";

interface MarketingTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const MarketingTabContent = ({ dbStatus, isAuthenticated }: MarketingTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-500" />
            Create a Marketing Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Build a custom marketing strategy by selecting specialized AI agents that work together to analyze your audience, content, SEO, social media, and more.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/create-strategy")} 
            className="w-full h-10 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to Get Started" : "Get Started"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            View Your Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Access all your marketing strategies in one place. Review insights, track progress, and update your strategic approach based on AI recommendations.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            className="w-full h-10 px-4 py-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300"
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to View Dashboard" : "Go to Dashboard"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarketingTabContent;
