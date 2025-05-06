
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import StatsGrid from "./StatsGrid";
import RecentActivity from "./RecentActivity";
import CompaniesCard from "./CompaniesCard";

const CrmDashboardContent = () => {
  const { user } = useAuth();
  
  // Fetch contacts count
  const { data: contactsCount = 0, isLoading: loadingContacts } = useQuery({
    queryKey: ['contacts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error fetching contacts count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user,
  });

  // Fetch deals count
  const { data: dealsCount = 0, isLoading: loadingDeals } = useQuery({
    queryKey: ['deals-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error fetching deals count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user,
  });

  // Fetch open deals value
  const { data: dealsValue = 0, isLoading: loadingDealsValue } = useQuery({
    queryKey: ['deals-value'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('amount')
        .eq('user_id', user?.id)
        .neq('status', 'lost');
      
      if (error) {
        console.error('Error fetching deals value:', error);
        return 0;
      }
      
      return data.reduce((sum, deal) => sum + (deal.amount || 0), 0);
    },
    enabled: !!user,
  });

  // Calculate stats for recent activity
  const { data: recentActivity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ['recent-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          id, 
          type, 
          description, 
          date, 
          contacts(name, email)
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user,
  });

  const isLoading = loadingContacts || loadingDeals || loadingDealsValue || loadingActivity;

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
      </div>

      {/* CRM Stats Cards */}
      <StatsGrid
        contactsCount={contactsCount}
        dealsCount={dealsCount}
        dealsValue={dealsValue}
        isLoading={isLoading}
      />

      {/* Recent Activity and Companies */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity activities={recentActivity} isLoading={isLoading} />
        <CompaniesCard />
      </div>
    </div>
  );
};

export default CrmDashboardContent;
