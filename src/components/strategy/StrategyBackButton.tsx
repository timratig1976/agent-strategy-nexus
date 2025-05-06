
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StrategyBackButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate('/dashboard')} 
      className="mb-4"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
  );
};

export default StrategyBackButton;
