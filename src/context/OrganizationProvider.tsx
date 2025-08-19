
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Organization, OrganizationContextType } from "@/types/organization";
import { toast } from "sonner";
import { useApiClient } from "@/hooks/useApiClient";

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
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient("");

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setOrganizations([]);
        setCurrentOrganization(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ organizations: any[]; currentOrganization: any | null }>(`/api/organizations`);
        const orgs = (res.organizations || []).map((o: any) => ({
          id: o.id,
          name: o.name,
          slug: o.slug,
          logo_url: o.logo_url ?? null,
          created_at: o.created_at,
          updated_at: o.updated_at,
        })) as Organization[];
        setOrganizations(orgs);
        setCurrentOrganization(res.currentOrganization ? {
          id: res.currentOrganization.id,
          name: res.currentOrganization.name,
          slug: res.currentOrganization.slug,
          logo_url: res.currentOrganization.logo_url ?? null,
          created_at: res.currentOrganization.created_at,
          updated_at: res.currentOrganization.updated_at,
        } as Organization : null);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load organizations");
        toast.error("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const fetchUserOrganizations = async () => {
    try {
      const res = await api.get<{ organizations: any[]; currentOrganization: any | null }>(`/api/organizations`);
      const orgs = (res.organizations || []).map((o: any) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        logo_url: o.logo_url ?? null,
        created_at: o.created_at,
        updated_at: o.updated_at,
      })) as Organization[];
      setOrganizations(orgs);
      setCurrentOrganization(res.currentOrganization ? {
        id: res.currentOrganization.id,
        name: res.currentOrganization.name,
        slug: res.currentOrganization.slug,
        logo_url: res.currentOrganization.logo_url ?? null,
        created_at: res.currentOrganization.created_at,
        updated_at: res.currentOrganization.updated_at,
      } as Organization : null);
      return orgs;
    } catch (e) {
      return [] as Organization[];
    }
  };

  const createOrganization = async (name: string, slug: string): Promise<Organization | null> => {
    try {
      const res = await api.post(`/api/organizations`, { name, slug });
      const org = res.organization as Organization;
      await fetchUserOrganizations();
      toast.success("Organization created");
      return org;
    } catch (e: any) {
      if (e?.status === 409) {
        toast.error("Organization slug already exists. Please try another.");
      } else {
        toast.error("Failed to create organization");
      }
      return null;
    }
  };

  const updateOrganization = async (id: string, data: Partial<Organization>): Promise<Organization | null> => {
    try {
      const res = await api.patch(`/api/organizations`, { id, data });
      const updated = res.organization as Organization;
      setOrganizations((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
      if (currentOrganization?.id === id) setCurrentOrganization({ ...currentOrganization, ...updated });
      toast.success("Organization updated");
      return updated;
    } catch (e) {
      toast.error("Failed to update organization");
      return null;
    }
  };

  // Handle setting current organization and storing preference
  const handleSetCurrentOrganization = async (org: Organization) => {
    setCurrentOrganization(org);
    try {
      await api.post(`/api/organizations?action=setPrimary`, { organizationId: org.id });
    } catch (e) {
      // Non-blocking
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
