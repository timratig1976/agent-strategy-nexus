
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

const CreateStrategy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be signed in to create a strategy",
        variant: "destructive"
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your strategy",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create the strategy
      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          name: name.trim(),
          description: description.trim(),
          user_id: user.id,
          state: 'briefing',
          status: 'draft',
        })
        .select()
        .single();
      
      if (strategyError) throw strategyError;
      
      // Add initial task
      const initialTask = {
        strategy_id: strategy.id,
        title: "Define your marketing goals",
        state: 'briefing',
        is_completed: false
      };
      
      const { error: taskError } = await supabase
        .from('strategy_tasks')
        .insert(initialTask);
      
      if (taskError) throw taskError;
      
      toast({
        title: "Strategy Created",
        description: "Your marketing strategy has been created successfully"
      });
      
      navigate(`/strategy/${strategy.id}`);
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast({
        title: "Error",
        description: "Failed to create strategy",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Marketing Strategy</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Strategy Name</Label>
                <Input 
                  id="name" 
                  placeholder="E.g., Q3 Product Launch Strategy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Briefly describe your marketing strategy and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Strategy"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateStrategy;
