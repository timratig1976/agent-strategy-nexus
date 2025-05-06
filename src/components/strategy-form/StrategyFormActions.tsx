
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface StrategyFormActionsProps {
  submitting: boolean;
}

const StrategyFormActions = ({ submitting }: StrategyFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex justify-between">
      <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
        Cancel
      </Button>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Processing..." : "Create Strategy"}
      </Button>
    </CardFooter>
  );
};

export default StrategyFormActions;
