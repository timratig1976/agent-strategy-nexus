
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

const StrategyFormHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl">Create New Marketing Strategy</CardTitle>
      </CardHeader>
    </>
  );
};

export default StrategyFormHeader;
