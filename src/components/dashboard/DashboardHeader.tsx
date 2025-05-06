
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Marketing Strategies</h1>
      <Link to="/create-strategy">
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Strategy
        </Button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
