
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
        // Ensure the status is one of the allowed values
        let status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
        
        if (['active', 'canceled', 'incomplete', 'past_due', 'trialing'].includes(data.status)) {
          status = data.status as 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
        } else {
          // Default to active if invalid status is returned
          status = 'active';
        }
        
        setSubscription({
          id: data.id,
          organization_id: data.organization_id,
          tier_id: data.tier_id,
          status: status,
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
    // Disabled until Stripe keys are provided
    console.log("Stripe integration is currently disabled. Price ID:", priceId);
    setError("Stripe integration is not configured yet. Please add your Stripe API keys to Supabase.");
    return null;
  };

  const manageSubscription = async (): Promise<string | null> => {
    // Disabled until Stripe keys are provided
    console.log("Stripe subscription management is currently disabled.");
    setError("Stripe integration is not configured yet. Please add your Stripe API keys to Supabase.");
    return null;
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

