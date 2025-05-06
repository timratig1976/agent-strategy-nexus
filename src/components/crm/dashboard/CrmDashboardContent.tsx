
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity, Building2, Clock, Contact, DollarSign, FileText } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { RecentActivity } from "./RecentActivity";
import { CompaniesCard } from "./CompaniesCard";

const CrmDashboardContent: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    potentialRevenue: 0,
    recentInteractions: 0,
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch contact count
        const { count: contactCount, error: contactError } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true });
        
        if (contactError) throw contactError;
        
        // Fetch active deals (status not 'won' or 'lost')
        const { data: activeDeals, error: dealsError } = await supabase
          .from('deals')
          .select('amount')
          .not('status', 'in', '("won", "lost")');
        
        if (dealsError) throw dealsError;
        
        // Fetch recent interactions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: interactionCount, error: interactionError } = await supabase
          .from('interactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());
        
        if (interactionError) throw interactionError;
        
        // Calculate potential revenue
        const potentialRevenue = activeDeals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
        
        setStats({
          totalContacts: contactCount || 0,
          activeDeals: activeDeals?.length || 0,
          potentialRevenue,
          recentInteractions: interactionCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading dashboard data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const statCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      description: "Across all campaigns",
      icon: <Contact className="h-5 w-5" />,
      trend: "+5%",
      color: "bg-blue-500",
    },
    {
      title: "Active Deals",
      value: stats.activeDeals,
      description: "In pipeline",
      icon: <DollarSign className="h-5 w-5" />,
      trend: "+12%",
      color: "bg-green-500",
    },
    {
      title: "Potential Revenue",
      value: `$${stats.potentialRevenue.toLocaleString()}`,
      description: "From active deals",
      icon: <FileText className="h-5 w-5" />,
      trend: "+8%",
      color: "bg-purple-500",
    },
    {
      title: "Recent Interactions",
      value: stats.recentInteractions,
      description: "Last 30 days",
      icon: <Clock className="h-5 w-5" />,
      trend: "+15%",
      color: "bg-amber-500",
    },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">CRM Dashboard</h1>
      
      <StatsGrid isLoading={isLoading} stats={statCards} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity isLoading={isLoading} />
        <CompaniesCard isLoading={isLoading} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Marketing Strategy Integration</h2>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Connect Marketing & Sales</h3>
              <p className="text-muted-foreground">
                Link your marketing strategies to your CRM data for better insights
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Card className="p-4 bg-muted/50">
              <Building2 className="mb-2 h-5 w-5 text-blue-500" />
              <h4 className="font-medium">Lead Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Track leads from your marketing campaigns to deal closure
              </p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <FileText className="mb-2 h-5 w-5 text-purple-500" />
              <h4 className="font-medium">Campaign Performance</h4>
              <p className="text-sm text-muted-foreground">
                Monitor which marketing strategies generate the most valuable leads
              </p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CrmDashboardContent;
