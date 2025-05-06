
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
import PhaseSelector from "@/components/marketing/PhaseSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MarketingPhase = 
  | 'briefing'
  | 'website_analysis'
  | 'persona_development'
  | 'usp_canvas'
  | 'usp_generator'
  | 'channel_strategy'
  | 'roas_calculator'
  | 'campaign_ideas'
  | 'ad_creative'
  | 'lead_magnets'
  | 'content_strategy';

const CreateStrategy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<MarketingPhase>('briefing');
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [existingStrategies, setExistingStrategies] = useState<Array<{id: string, name: string}>>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);

  // Get the requested phase from URL params, if available
  useEffect(() => {
    const phaseParam = searchParams.get('phase');
    if (phaseParam) {
      setSelectedPhase(phaseParam as MarketingPhase);
      setActiveTab('existing'); // Default to existing tab when a specific phase is requested
    }
    
    // Fetch existing strategies for the current user
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('id, name')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        setExistingStrategies(data || []);
        
        // If we have strategies and a phase param, select the first strategy
        if (data && data.length > 0 && phaseParam) {
          setSelectedStrategyId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
        toast({
          title: "Error",
          description: "Failed to load existing strategies",
          variant: "destructive"
        });
      }
    };
    
    fetchStrategies();
  }, [searchParams, user, toast]);

  const handleCreateStrategy = async (e: React.FormEvent) => {
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
          phase: selectedPhase,
          status: 'draft',
        })
        .select()
        .single();
      
      if (strategyError) throw strategyError;
      
      // Add initial task based on the selected phase
      const initialTask = {
        strategy_id: strategy.id,
        title: `Complete ${selectedPhase.replace('_', ' ')} phase`,
        state: selectedPhase as any,
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

  const handlePhaseSelect = (phase: MarketingPhase) => {
    setSelectedPhase(phase);
    
    if (activeTab === 'existing' && selectedStrategyId) {
      // Navigate to the strategy page with the selected phase
      navigate(`/strategy/${selectedStrategyId}?phase=${phase}`);
    }
  };

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
  };

  const handleContinue = () => {
    if (activeTab === 'new') {
      // Submit the form to create a new strategy
      handleCreateStrategy(new Event('submit') as any);
    } else if (selectedStrategyId) {
      // Navigate to the existing strategy with the selected phase
      navigate(`/strategy/${selectedStrategyId}?phase=${selectedPhase}`);
    } else {
      toast({
        title: "No Strategy Selected",
        description: "Please select an existing strategy to continue",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {selectedPhase === 'briefing' 
                ? 'Create New Marketing Strategy' 
                : `Add ${selectedPhase.replace('_', ' ')} to Your Strategy`}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'new' | 'existing')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="new">Create New Strategy</TabsTrigger>
                <TabsTrigger value="existing">Use Existing Strategy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new" className="space-y-6">
                <form id="create-strategy-form" onSubmit={handleCreateStrategy} className="space-y-6">
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
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Starting Phase</Label>
                    <PhaseSelector 
                      onPhaseSelect={handlePhaseSelect} 
                      initialPhase={selectedPhase}
                    />
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="existing" className="space-y-6">
                {existingStrategies.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Existing Strategy</Label>
                      <div className="grid gap-2">
                        {existingStrategies.map(strategy => (
                          <Card 
                            key={strategy.id}
                            className={`cursor-pointer hover:bg-accent transition-colors ${
                              selectedStrategyId === strategy.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleStrategySelect(strategy.id)}
                          >
                            <CardContent className="p-4">
                              <p className="font-medium">{strategy.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Select Phase</Label>
                      <PhaseSelector 
                        onPhaseSelect={handlePhaseSelect}
                        currentStrategyId={selectedStrategyId || undefined}
                        initialPhase={selectedPhase}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You don't have any existing strategies yet.
                    </p>
                    <Button onClick={() => setActiveTab('new')}>
                      Create Your First Strategy
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleContinue}
              disabled={submitting || (activeTab === 'existing' && !selectedStrategyId)}
            >
              {submitting ? "Processing..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateStrategy;
