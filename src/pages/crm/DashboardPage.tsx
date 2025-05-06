
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Target, BarChart, Briefcase } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthProvider";

const CrmDashboardPage = () => {
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
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container py-6 px-4 md:px-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          </div>

          {/* CRM Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <User className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : contactsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  People in your network
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/crm/contacts">View all contacts</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : dealsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ongoing sales opportunities
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/crm/deals">View all deals</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <BarChart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${isLoading ? "..." : dealsValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total value of active deals
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/crm/deals">View pipeline</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with contacts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-32 rounded bg-muted"></div>
                          <div className="h-3 w-24 rounded bg-muted"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((item: any) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full 
                          ${item.type === 'email' ? 'bg-blue-100 text-blue-600' : 
                            item.type === 'call' ? 'bg-green-100 text-green-600' : 
                            item.type === 'meeting' ? 'bg-purple-100 text-purple-600' : 
                            'bg-gray-100 text-gray-600'}`}>
                          {item.type === 'email' ? '✉️' : 
                           item.type === 'call' ? '📞' : 
                           item.type === 'meeting' ? '👥' : '📝'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {item.contacts?.name || 'Contact'} 
                            <span className="font-normal text-muted-foreground"> - {item.type}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent activity found</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Companies</CardTitle>
                <CardDescription>Organizations in your CRM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Companies by Contact</p>
                        <p className="text-xs text-muted-foreground">View companies associated with your contacts</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-center text-muted-foreground">
                      Companies are extracted from your contacts' information
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/crm/contacts">Manage Contacts</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrmDashboardPage;
