
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { Strategy, StrategyState } from "@/types/marketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

interface RoasCalculatorModuleProps {
  strategy: Strategy;
}

const RoasCalculatorModule: React.FC<RoasCalculatorModuleProps> = ({
  strategy,
}) => {
  const { navigateToPreviousStep, navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId: strategy.id,
  });
  
  // Simple ROAS calculator state
  const [adSpend, setAdSpend] = useState<number>(1000);
  const [revenue, setRevenue] = useState<number>(5000);
  
  // Calculate ROAS
  const roas = revenue / adSpend;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ROAS Calculator</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigateToPreviousStep(StrategyState.ROAS_CALCULATOR)}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Funnel Strategy
          </Button>
          <Button 
            onClick={() => navigateToNextStep(StrategyState.ROAS_CALCULATOR)}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            Continue to Ad Campaign
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Return on Ad Spend Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Calculate and forecast your Return on Ad Spend (ROAS) to ensure your advertising investments are profitable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad-spend">Ad Spend ($)</Label>
                <Input 
                  id="ad-spend" 
                  type="number" 
                  value={adSpend} 
                  onChange={(e) => setAdSpend(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue Generated ($)</Label>
                <Input 
                  id="revenue" 
                  type="number" 
                  value={revenue} 
                  onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-md flex flex-col items-center justify-center">
              <div className="text-center">
                <h3 className="text-sm font-medium text-slate-500">Your ROAS</h3>
                <div className="text-4xl font-bold mt-2">
                  {roas.toFixed(2)}x
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  For every $1 spent, you earn ${roas.toFixed(2)}
                </p>
                <div className={`mt-4 text-sm px-3 py-1 rounded-full inline-block ${
                  roas >= 3 ? "bg-green-100 text-green-800" : 
                  roas >= 2 ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {roas >= 4 ? "Excellent" : 
                   roas >= 3 ? "Good" : 
                   roas >= 2 ? "Acceptable" : 
                   "Needs Improvement"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 mt-6 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700">
              Complete ROAS Calculator features will include:
            </p>
            <ul className="list-disc list-inside mt-2 text-blue-600 space-y-1">
              <li>Channel-specific ROAS comparison</li>
              <li>Campaign budget optimization</li>
              <li>Projected vs. actual ROAS tracking</li>
              <li>Break-even analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoasCalculatorModule;
