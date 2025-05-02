
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "@/types/marketing";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) {
          throw error;
        }

        // Transform the data to match our Strategy interface
        const transformedStrategies: Strategy[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          agents: [],  // We'll fetch these separately if needed
          results: []  // We'll fetch these separately if needed
        }));

        setStrategies(transformedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        toast({
          title: "Error",
          description: "Failed to load marketing strategies",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketing Strategies</h1>
        <Link to="/create-strategy">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Strategy
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px] animate-pulse">
              <CardHeader className="bg-gray-100 dark:bg-gray-800 h-[60px]"></CardHeader>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : strategies.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-60">
            <p className="text-xl text-gray-500 mb-4">No marketing strategies yet</p>
            <Link to="/create-strategy">
              <Button>Create Your First Strategy</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Link to={`/strategy/${strategy.id}`} key={strategy.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>
                    {new Date(strategy.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                      ${strategy.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {strategy.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {strategy.agents?.length || 0} agents
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{strategy.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
