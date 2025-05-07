
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { 
  NavBar, 
  PageHeader, 
  DatabaseStatus, 
  MarketingTabContent
} from "@/components";

const Index = () => {
  const { user } = useAuth();
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {user && <NavBar />}
      
      <PageHeader user={user} onLogout={() => {}} />

      <DatabaseStatus status={dbStatus} />

      <div className="mb-12">
        <MarketingTabContent dbStatus={dbStatus} isAuthenticated={!!user} />
      </div>
    </div>
  );
};

export default Index;
