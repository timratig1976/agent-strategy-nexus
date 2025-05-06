
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompaniesCardProps {
  isLoading?: boolean;
}

type CompanyCount = {
  company: string;
  count: number;
};

const CompaniesCard = ({ isLoading = false }: CompaniesCardProps) => {
  const [topCompanies, setTopCompanies] = useState<CompanyCount[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // This query gets companies and counts contacts per company
        const { data, error } = await supabase
          .from('contacts')
          .select('company')
          .not('company', 'is', null)
          .order('company');
        
        if (error) throw error;
        
        // Count contacts per company
        const companyMap: Record<string, number> = {};
        data?.forEach(contact => {
          if (!contact.company) return;
          companyMap[contact.company] = (companyMap[contact.company] || 0) + 1;
        });
        
        // Convert to array and sort by count
        const companies = Object.entries(companyMap)
          .filter(([name]) => name && name.trim() !== '')
          .map(([company, count]) => ({ company, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setTopCompanies(companies);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, []);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>Organizations in your CRM</CardDescription>
      </CardHeader>
      <CardContent>
        {(isLoading || loading) ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="h-4 w-28 rounded bg-muted"></div>
                </div>
                <div className="h-4 w-8 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        ) : topCompanies.length > 0 ? (
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{company.company}</span>
                </div>
                <span className="text-sm text-muted-foreground">{company.count} contacts</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No company data available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add company information to your contacts
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/crm/contacts">Manage Contacts</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompaniesCard;
