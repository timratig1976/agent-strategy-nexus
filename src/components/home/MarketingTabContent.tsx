
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MarketingTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const MarketingTabContent = ({ dbStatus, isAuthenticated }: MarketingTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a Marketing Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Build a custom marketing strategy by selecting specialized AI agents that work together to analyze your audience, content, SEO, social media, and more.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/create-strategy")} 
            className="w-full" 
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to Get Started" : "Get Started"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Your Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access all your marketing strategies in one place. Review insights, track progress, and update your strategic approach based on AI recommendations.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            className="w-full"
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
