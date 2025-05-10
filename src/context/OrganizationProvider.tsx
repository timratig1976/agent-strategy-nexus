
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { Organization, OrganizationContextType } from "@/types/organization";
import { toast } from "sonner";

const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  currentOrganization: null,
  setCurrentOrganization: () => {},
  createOrganization: async () => null,
  updateOrganization: async () => null,
  loading: true,
  error: null,
});

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserOrganizations();
    } else {
      setOrganizations([]);
      setCurrentOrganization(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserOrganizations = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: memberships, error: membershipError } = await supabase
        .from('org_memberships')
        .select('organization_id, is_primary')
        .eq('user_id', user?.id);

      if (membershipError) throw membershipError;

      if (memberships && memberships.length > 0) {
        const orgIds = memberships.map(m => m.organization_id);
        
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('*')
          .in('id', orgIds);
        
        if (orgsError) throw orgsError;
        
        setOrganizations(orgs || []);
        
        // Find primary organization or default to first one
        const primaryMembership = memberships.find(m => m.is_primary);
        if (primaryMembership && orgs) {
          const primaryOrg = orgs.find(org => org.id === primaryMembership.organization_id);
          if (primaryOrg) {
            setCurrentOrganization(primaryOrg);
          } else if (orgs.length > 0) {
            setCurrentOrganization(orgs[0]);
          }
        } else if (orgs && orgs.length > 0) {
          setCurrentOrganization(orgs[0]);
        }
      } else {
        // User has no organizations, may need to create one
        setOrganizations([]);
        setCurrentOrganization(null);
      }
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError("Failed to load organizations");
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (name: string, slug: string): Promise<Organization | null> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({ name, slug })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Refresh organizations list
        await fetchUserOrganizations();
        return data;
      }
      return null;
    } catch (err: any) {
      console.error("Error creating organization:", err);
      if (err.code === '23505') { // Unique constraint violation
        toast.error("Organization slug already exists. Please try another.");
      } else {
        toast.error("Failed to create organization");
      }
      return null;
    }
  };

  const updateOrganization = async (id: string, data: Partial<Organization>): Promise<Organization | null> => {
    try {
      const { data: updatedOrg, error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (updatedOrg) {
        // Update local state
        setOrganizations(orgs => 
          orgs.map(org => org.id === id ? { ...org, ...updatedOrg } : org)
        );
        
        if (currentOrganization?.id === id) {
          setCurrentOrganization({ ...currentOrganization, ...updatedOrg });
        }
        
        return updatedOrg;
      }
      return null;
    } catch (err) {
      console.error("Error updating organization:", err);
      toast.error("Failed to update organization");
      return null;
    }
  };

  // Handle setting current organization and storing preference
  const handleSetCurrentOrganization = (org: Organization) => {
    setCurrentOrganization(org);
    
    // Update primary organization in database
    const updatePrimary = async () => {
      try {
        // First, set all to non-primary
        await supabase
          .from('org_memberships')
          .update({ is_primary: false })
          .eq('user_id', user?.id);
        
        // Then set the selected one to primary
        await supabase
          .from('org_memberships')
          .update({ is_primary: true })
          .eq('user_id', user?.id)
          .eq('organization_id', org.id);
      } catch (err) {
        console.error("Error updating primary organization:", err);
      }
    };
    
    if (user) {
      updatePrimary();
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        setCurrentOrganization: handleSetCurrentOrganization,
        createOrganization,
        updateOrganization,
        loading,
        error,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
