
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
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Business Management Hub</h1>
      {user ? (
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      ) : (
        <Button onClick={() => navigate("/auth")}>
          Sign In
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
