
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { LogOut } from "lucide-react";
import NavBar from "@/components/NavBar";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'not-setup'>('checking');

  // Check if database tables exist
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Try to get one row from strategies table to check if it exists
        const { data, error } = await supabase
          .from('strategies')
          .select('id')
          .limit(1);
        
        if (error && error.code === '42P01') {
          // Table doesn't exist error
          setDbStatus('not-setup');
        } else {
          setDbStatus('ready');
        }
      } catch (error) {
        console.error('Error checking database:', error);
        setDbStatus('not-setup');
        toast.error('Could not verify database status');
      }
    };

    checkDatabase();
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {user && <NavBar />}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Marketing Strategy Hub</h1>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        )}
      </div>

      <div className="text-center mb-12">
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create comprehensive marketing strategies with AI-powered agents that work together to provide insights across different marketing domains.
        </p>
      </div>

      {dbStatus === 'checking' && (
        <Card className="mb-8 border-dashed border-2 border-blue-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <p>Checking database status...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {dbStatus === 'not-setup' && (
        <Card className="mb-8 border-2 border-red-300">
          <CardHeader>
            <CardTitle className="text-red-500">Database Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The application requires database tables to be set up before you can use it. Please click the button below to set up the database.</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/setup-database")} 
              variant="destructive" 
              className="w-full"
            >
              Setup Database Now
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
              disabled={dbStatus !== 'ready' || !user}
            >
              {!user ? "Sign in to Get Started" : "Get Started"}
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
              disabled={dbStatus !== 'ready' || !user}
            >
              {!user ? "Sign in to View Dashboard" : "Go to Dashboard"}
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
