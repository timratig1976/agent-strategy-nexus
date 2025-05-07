
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { 
  NavBar, 
  PageHeader, 
  DatabaseStatus, 
  HowItWorks, 
  MarketingTabContent
} from "@/components";

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
      
      <PageHeader user={user} onLogout={handleLogout} />

      <div className="text-center mb-12">
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete business management solution with marketing strategy tools.
        </p>
      </div>

      <DatabaseStatus status={dbStatus} />

      <div className="mb-12">
        <MarketingTabContent dbStatus={dbStatus} isAuthenticated={!!user} />
      </div>

      <HowItWorks />
    </div>
  );
};

export default Index;
