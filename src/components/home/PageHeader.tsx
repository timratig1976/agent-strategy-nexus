
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
  
  // Get user display name or email
  const userDisplayName = user?.email || "User";
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 pb-6 border-b">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Strategy Hub
        </h1>
      </div>
      
      {user ? (
        <div className="flex items-center gap-3">
          <div className="bg-muted px-3 py-2 rounded-md text-sm text-muted-foreground">
            {userDisplayName}
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => navigate("/auth")} 
          className="px-4 py-2 h-10 shadow-md hover:shadow-lg transition-shadow"
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
