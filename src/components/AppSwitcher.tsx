
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const AppSwitcher = () => {
  return (
    <div className="flex items-center">
      <Link to="/dashboard">
        <Button variant="ghost" className="bg-gradient-to-r from-background to-muted font-medium px-4">
          <span className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-blue-500" />
            Marketing Strategy
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default AppSwitcher;
