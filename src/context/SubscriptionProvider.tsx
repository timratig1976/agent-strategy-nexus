
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/context/OrganizationProvider";
import { Subscription, SubscriptionTier } from "@/types/organization";

interface SubscriptionContextType {
  subscription: Subscription | null;
  tier: SubscriptionTier | null;
  loading: boolean;
  error: string | null;
  checkoutSubscription: (priceId: string) => Promise<string | null>;
  manageSubscription: () => Promise<string | null>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  tier: null,
  loading: true,
  error: null,
  checkoutSubscription: async () => null,
  manageSubscription: async () => null,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrganization } = useOrganization();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentOrganization) {
      fetchSubscriptionData();
    } else {
      setSubscription(null);
      setTier(null);
      setLoading(false);
    }
  }, [currentOrganization]);

  const fetchSubscriptionData = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch subscription with tier data
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          tier:tier_id (*)
        `)
        .eq('organization_id', currentOrganization.id)
        .single();

      if (error) throw error;

      if (data) {
        setSubscription({
          id: data.id,
          organization_id: data.organization_id,
          tier_id: data.tier_id,
          status: data.status,
          current_period_end: data.current_period_end,
          cancel_at_period_end: data.cancel_at_period_end,
        });
        
        setTier(data.tier as SubscriptionTier);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const checkoutSubscription = async (priceId: string): Promise<string | null> => {
    if (!currentOrganization) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          organizationId: currentOrganization.id,
          priceId
        }
      });

      if (error) throw error;
      
      return data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
      setError("Failed to create checkout session");
      return null;
    }
  };

  const manageSubscription = async (): Promise<string | null> => {
    if (!currentOrganization) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { organizationId: currentOrganization.id }
      });

      if (error) throw error;
      
      return data.url;
    } catch (err) {
      console.error("Error opening customer portal:", err);
      setError("Failed to open subscription management");
      return null;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        tier,
        loading,
        error,
        checkoutSubscription,
        manageSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
