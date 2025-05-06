import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { NavBar } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

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
        <h1 className="text-4xl font-bold">Business Management Hub</h1>
        {user ? (
          <div className="hidden items-center gap-2 md:flex">
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
          Complete business management solution with marketing strategy tools and customer relationship management.
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

      <Tabs defaultValue="marketing" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="marketing" className="flex gap-2 items-center">
            <LayoutDashboard className="h-4 w-4" />
            Marketing Strategy
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            CRM
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketing" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="crm" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Manage Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Store and manage your business contacts, track interactions, and keep your customer data organized in one place.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/crm/contacts")} 
                  className="w-full" 
                  disabled={dbStatus !== 'ready' || !user}
                >
                  {!user ? "Sign in to View Contacts" : "View Contacts"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Monitor your sales pipeline, track deals with potential clients, and never miss an opportunity to close a sale.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/crm/deals")} 
                  variant="outline" 
                  className="w-full"
                  disabled={dbStatus !== 'ready' || !user}
                >
                  {!user ? "Sign in to Track Deals" : "View Deals"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-4 list-decimal list-inside">
          <li className="p-2">
            <span className="font-medium">Choose your application</span> - Switch between Marketing Strategy and CRM to fit your current needs.
          </li>
          <li className="p-2">
            <span className="font-medium">Set up your data</span> - Configure your business information and import your contacts.
          </li>
          <li className="p-2">
            <span className="font-medium">Get insights</span> - Leverage AI-powered marketing strategies and customer relationship tools.
          </li>
          <li className="p-2">
            <span className="font-medium">Track progress</span> - Monitor your success and refine your approach over time.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Index;
