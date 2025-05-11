
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Props for the StrategyBackButton component
 */
interface StrategyBackButtonProps {
  /**
   * Optional strategy ID to override the one from URL params
   */
  strategyId?: string;
  
  /**
   * Optional callback to execute when back button is clicked
   */
  onBackClick?: () => void;
  
  /**
   * Optional destination to navigate to (overrides default behavior)
   */
  customDestination?: string;
}

/**
 * A back button component for the strategy workflow
 * 
 * This button navigates back to either the strategy overview page
 * or to the dashboard, depending on context.
 */
const StrategyBackButton: React.FC<StrategyBackButtonProps> = ({
  strategyId,
  onBackClick,
  customDestination
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const id = strategyId || params.id;
  
  const handleBackClick = () => {
    // Use the custom callback if provided
    if (onBackClick) {
      onBackClick();
      return;
    }
    
    // Use custom destination if provided
    if (customDestination) {
      navigate(customDestination);
      return;
    }
    
    // Default navigation logic
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
      aria-label="Back"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      {id ? 'Back to Strategy Overview' : 'Back to Dashboard'}
    </Button>
  );
};

export default StrategyBackButton;
