
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code } from "@/components/ui/code";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const SetupDatabase = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if tables already exist
      const { data: existingTables, error: checkError } = await supabase
        .from('strategies')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code !== 'PGRST116') {
        // If error is not "relation does not exist", then it's some other issue
        throw checkError;
      }
      
      if (existingTables && existingTables.length > 0) {
        setSetupComplete(true);
        toast({
          title: "Database Already Set Up",
          description: "Your database tables already exist!",
        });
        return;
      }
      
      // Create sample strategy
      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          name: 'Sample Marketing Strategy',
          description: 'A demo strategy to showcase the marketing agents platform',
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (strategyError) throw strategyError;
      
      // Create sample agents
      const agents = [
        {
          name: 'Audience Analyzer',
          type: 'audience',
          description: 'Analyzes target audience demographics and preferences',
          is_active: true,
          strategy_id: strategy.id
        },
        {
          name: 'Content Strategist',
          type: 'content',
          description: 'Develops content strategy and content calendar',
          is_active: true,
          strategy_id: strategy.id
        },
        {
          name: 'SEO Optimizer',
          type: 'seo',
          description: 'Provides SEO recommendations and keyword analysis',
          is_active: true,
          strategy_id: strategy.id
        }
      ];
      
      const { error: agentsError } = await supabase
        .from('agents')
        .insert(agents);
      
      if (agentsError) throw agentsError;
      
      setSetupComplete(true);
      toast({
        title: "Setup Complete",
        description: "Database setup with sample data!",
      });
    } catch (err) {
      console.error("Database setup error:", err);
      setError(typeof err === 'object' && err !== null && 'message' in err 
        ? String(err.message) 
        : 'An unknown error occurred');
      toast({
        title: "Setup Error",
        description: "Failed to set up the database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Database Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This page will help you set up the database tables for your marketing strategy application
            and populate them with some sample data to get you started.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium mb-2">The setup will create:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>A sample marketing strategy</li>
              <li>Three sample marketing agents (Audience, Content, SEO)</li>
              <li>Basic structure for your marketing automation platform</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          {setupComplete ? (
            <Link to="/dashboard" className="w-full">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          ) : (
            <Button 
              onClick={setupDatabase} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Setting Up..." : "Set Up Database"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupDatabase;
