
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/context/OrganizationProvider";
import { useSubscription } from "@/context/SubscriptionProvider";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Team, SubscriptionTier } from "@/types/organization";
import { Building, CreditCard, ExternalLink, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import StripeSetup from "@/components/settings/StripeSetup";
import MemberManagement from "@/components/organizations/MemberManagement";

export default function OrganizationSettings() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { currentOrganization } = useOrganization();
  const { tier, subscription, checkoutSubscription, manageSubscription } = useSubscription();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Fetch teams
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['organization-teams', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', organizationId || currentOrganization?.id);
        
      if (error) throw error;
      return data as Team[];
    },
    enabled: !!(organizationId || currentOrganization?.id)
  });
  
  // Fetch available subscription tiers
  const { data: tiers, isLoading: isLoadingTiers } = useQuery({
    queryKey: ['subscription-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('monthly_price_cents', { ascending: true });
        
      if (error) throw error;
      return data as SubscriptionTier[];
    }
  });
  
  const handleSubscribe = async (tierId: string, tierName: string) => {
    try {
      setIsLoading(true);
      
      // Find tier
      const selectedTier = tiers?.find(t => t.id === tierId);
      if (!selectedTier) {
        toast.error("Cannot subscribe to this plan at the moment");
        return;
      }
      
      if (!selectedTier.stripe_price_id) {
        toast.error("Stripe integration is not configured");
        return;
      }
      
      // Get checkout URL
      const checkoutUrl = await checkoutSubscription(selectedTier.stripe_price_id);
      
      if (checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = checkoutUrl;
      } else {
        toast.error("Stripe integration is not configured. Please add your API keys to Supabase.");
      }
    } catch (error) {
      console.error("Error handling subscription:", error);
      toast.error("An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const portalUrl = await manageSubscription();
      
      if (portalUrl) {
        // Redirect to Stripe customer portal
        window.location.href = portalUrl;
      } else {
        toast.error("Stripe integration is not configured. Please add your API keys to Supabase.");
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast.error("An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Check if Stripe is configured - we'll always return false for now
  const isStripeConfigured = false;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            Organization Settings
          </h1>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <Building className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription & Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  View and update your organization's details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p>{currentOrganization?.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Slug</h3>
                    <p>{currentOrganization?.slug}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Teams</h3>
                    {isLoadingTeams ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading teams...</span>
                      </div>
                    ) : (
                      <p>{teams?.length || 0} teams</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>
          
          <TabsContent value="billing">
            {!isStripeConfigured ? (
              <StripeSetup />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                    Manage your organization's subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                    {tier ? (
                      <div className="flex flex-col gap-2 p-4 border rounded-md bg-accent/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-xl">{tier.name}</h4>
                            <p className="text-muted-foreground">{formatPrice(tier.monthly_price_cents)} / month</p>
                          </div>
                          {subscription?.status === 'active' && tier.name !== 'Free' && (
                            <Button 
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={handleManageSubscription}
                              disabled={isLoading || !isStripeConfigured}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                              Manage Plan
                            </Button>
                          )}
                        </div>
                        {subscription?.status === 'active' && subscription.current_period_end && (
                          <p className="text-sm text-muted-foreground">
                            {subscription.cancel_at_period_end 
                              ? `Your subscription will end on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                              : `Your next billing date is ${new Date(subscription.current_period_end).toLocaleDateString()}`
                            }
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                  {isLoadingTiers ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                      {tiers?.map((availableTier) => (
                        <div 
                          key={availableTier.id} 
                          className={`p-4 border rounded-md flex flex-col ${tier?.id === availableTier.id ? 'border-primary/50 bg-primary/5 ring-1 ring-primary' : ''}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-xl mb-2">
                              {availableTier.name}
                              {tier?.id === availableTier.id && (
                                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                  Current Plan
                                </span>
                              )}
                            </h4>
                            <p className="text-2xl font-bold mb-4">
                              {availableTier.monthly_price_cents === 0 
                                ? 'Free' 
                                : `${formatPrice(availableTier.monthly_price_cents)}`
                              }
                              {availableTier.monthly_price_cents > 0 && (
                                <span className="text-sm font-normal text-muted-foreground"> / month</span>
                              )}
                            </p>
                            <div className="space-y-2 mb-6 text-sm">
                              <p>
                                <span className="font-medium">Teams:</span> {availableTier.max_teams === null ? 'Unlimited' : availableTier.max_teams}
                              </p>
                              <p>
                                <span className="font-medium">Members:</span> {availableTier.max_members === null ? 'Unlimited' : availableTier.max_members}
                              </p>
                              <p>
                                <span className="font-medium">Strategies:</span> {availableTier.max_strategies === null ? 'Unlimited' : availableTier.max_strategies}
                              </p>
                              <p>
                                <span className="font-medium">AI Credits:</span> {availableTier.features.ai_credits || 0}
                              </p>
                            </div>
                          </div>
                          <div>
                            {tier?.id === availableTier.id ? (
                              <Button 
                                className="w-full" 
                                variant="outline" 
                                disabled 
                              >
                                Current Plan
                              </Button>
                            ) : (
                              <Button 
                                className="w-full" 
                                onClick={() => handleSubscribe(availableTier.id, availableTier.name)}
                                disabled={isLoading || !isStripeConfigured || (availableTier.name === 'Free' && tier?.name !== 'Free')}
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {availableTier.monthly_price_cents === 0 ? 'Downgrade to Free' : 'Subscribe'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
