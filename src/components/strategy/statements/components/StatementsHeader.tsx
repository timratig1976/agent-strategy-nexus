
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatementsHeaderProps {
  onNavigateBack: () => void;
  isNavigating?: boolean;
}

const StatementsHeader: React.FC<StatementsHeaderProps> = ({
  onNavigateBack,
  isNavigating = false
}) => {
  return (
    <div className="flex justify-between items-center p-6 bg-white border-b">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={onNavigateBack}
        disabled={isNavigating}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to USP Canvas
      </Button>
      
      <div className="text-right">
        <h2 className="text-xl font-semibold">Pain & Gain Statements</h2>
        <p className="text-sm text-muted-foreground">
          Create impactful statements for your marketing campaign
        </p>
      </div>
    </div>
  );
};

export default StatementsHeader;
