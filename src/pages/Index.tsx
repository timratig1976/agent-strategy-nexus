
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketing Strategy Hub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create comprehensive marketing strategies with AI-powered agents that work together to provide insights across different marketing domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Create a Marketing Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Build a custom marketing strategy by selecting specialized AI agents that work together to analyze your audience, content, SEO, social media, and more.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/create-strategy")} className="w-full">
              Get Started
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
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-4 list-decimal list-inside">
          <li className="p-2">
            <span className="font-medium">Create a strategy</span> - Define your marketing objectives and select the relevant AI agents.
          </li>
          <li className="p-2">
            <span className="font-medium">Run agents</span> - Each agent will analyze a specific aspect of your marketing approach.
          </li>
          <li className="p-2">
            <span className="font-medium">Review insights</span> - Get comprehensive recommendations based on combined agent analyses.
          </li>
          <li className="p-2">
            <span className="font-medium">Implement & iterate</span> - Apply the insights and refine your strategy over time.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Index;
