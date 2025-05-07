
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

interface CrmTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

// This component is now empty since we've removed CRM functionality
const CrmTabContent = ({ dbStatus, isAuthenticated }: CrmTabContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-8">
      <p className="text-muted-foreground">
        CRM functionality has been removed.
      </p>
    </div>
  );
};

export default CrmTabContent;
