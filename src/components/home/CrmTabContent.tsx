
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Target, LayoutDashboard } from "lucide-react";

interface CrmTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const CrmTabContent = ({ dbStatus, isAuthenticated }: CrmTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-green-500" />
            CRM Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Get a complete overview of your CRM with contacts, companies, and deals at a glance.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/crm/dashboard")} 
            className="w-full h-10 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to View Dashboard" : "View Dashboard"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Manage Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Store and manage your business contacts, track interactions, and keep your customer data organized in one place.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/crm/contacts")} 
            variant="outline" 
            className="w-full h-10 px-4 py-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {!isAuthenticated ? "Sign in to View Contacts" : "View Contacts"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-500" />
            Track Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Monitor your sales pipeline, track deals with potential clients, and never miss an opportunity to close a sale.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/crm/deals")} 
            variant="outline" 
            className="w-full h-10 px-4 py-2 border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950 dark:hover:text-amber-300"
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
