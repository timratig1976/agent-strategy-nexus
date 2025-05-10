
import { User } from "@supabase/supabase-js";

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  is_primary: boolean;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  tier_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
  current_period_end?: string;
  cancel_at_period_end: boolean;
  tier?: SubscriptionTier;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string | null;
  monthly_price_cents: number;
  features: Record<string, any>;
  max_teams: number | null;
  max_members: number | null;
  max_strategies: number | null;
  stripe_price_id?: string;
}

export interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization) => void;
  createOrganization: (name: string, slug: string) => Promise<Organization | null>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization | null>;
  loading: boolean;
  error: string | null;
}
