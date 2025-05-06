
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CrmTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const CrmTabContent = ({ dbStatus, isAuthenticated }: CrmTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Store and manage your business contacts, track interactions, and keep your customer data organized in one place.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/crm/contacts")} 
            className="w-full" 
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to View Contacts" : "View Contacts"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Track Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monitor your sales pipeline, track deals with potential clients, and never miss an opportunity to close a sale.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/crm/deals")} 
            variant="outline" 
            className="w-full"
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to Track Deals" : "View Deals"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CrmTabContent;
