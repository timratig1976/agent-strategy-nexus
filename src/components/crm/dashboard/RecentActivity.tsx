
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Interaction } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface RecentActivityProps {
  isLoading: boolean;
}

const RecentActivity = ({ isLoading }: RecentActivityProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data, error } = await supabase
          .from('interactions')
          .select(`
            *,
            contacts(name)
          `)
          .order('date', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast({
          title: "Error loading activity data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [toast]);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interactions with contacts</CardDescription>
      </CardHeader>
      <CardContent>
        {(isLoading || loading) ? (
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
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((item: any) => (
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
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href="/crm/contacts">View All Activity</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;
