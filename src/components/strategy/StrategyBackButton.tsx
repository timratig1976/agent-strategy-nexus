import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface StrategyBackButtonProps {
  strategyId?: string;  // Optional prop for direct ID passing
}

const StrategyBackButton: React.FC<StrategyBackButtonProps> = ({ strategyId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const id = strategyId || params.id;
  
  const handleBackClick = () => {
    if (id) {
      // Navigate to strategy overview if we have an ID
      navigate(`/strategy/${id}`);
    } else {
      // Otherwise go back to dashboard
      navigate('/dashboard');
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      onClick={handleBackClick} 
      className="mb-4"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      {id ? 'Back to Strategy Overview' : 'Back to Dashboard'}
    </Button>
  );
};

export default StrategyBackButton;
