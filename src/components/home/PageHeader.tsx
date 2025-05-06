
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

interface PageHeaderProps {
  user: any;
  onLogout: () => void;
}

const PageHeader = ({ user, onLogout }: PageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 pb-6 border-b">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Business Management Hub
        </h1>
        <p className="text-muted-foreground mt-2">Complete business solution for your enterprise</p>
      </div>
      
      {user ? (
        <div className="flex items-center gap-3">
          <div className="bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground">
            {user.email}
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      ) : (
        <Button onClick={() => navigate("/auth")} className="shadow-md hover:shadow-lg transition-shadow">
          Sign In
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
