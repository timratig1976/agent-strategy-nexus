import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

interface CrmTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

// This component is no longer being used in the app
// but we keep it to avoid breaking any imports
const CrmTabContent = ({ dbStatus, isAuthenticated }: CrmTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-8">
      <Card>
        <CardHeader>
          <CardTitle>CRM Functionality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            CRM functionality has been removed from this application.
          </p>
          {isAuthenticated && (
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Go to Marketing Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmTabContent;
