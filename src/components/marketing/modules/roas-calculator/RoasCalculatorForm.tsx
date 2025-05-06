
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { RoasFormData } from "./types";
import { DollarSign, Percent } from "lucide-react";

interface RoasCalculatorFormProps {
  formData: RoasFormData;
  setFormData: React.Dispatch<React.SetStateAction<RoasFormData>>;
  onCalculate: () => void;
  isLoading: boolean;
  error: string | null;
}

const RoasCalculatorForm = ({ 
  formData, 
  setFormData, 
  onCalculate,
  isLoading,
  error 
}: RoasCalculatorFormProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const channels = [
    { name: "adSpend", label: "Monthly Ad Spend ($)", icon: <DollarSign className="h-4 w-4" /> },
    { name: "clicks", label: "Expected Monthly Clicks", icon: null },
    { name: "ctr", label: "Expected CTR (%)", icon: <Percent className="h-4 w-4" /> },
    { name: "conversionRate", label: "Expected Conversion Rate (%)", icon: <Percent className="h-4 w-4" /> },
    { name: "averageOrderValue", label: "Average Order Value ($)", icon: <DollarSign className="h-4 w-4" /> }
  ];
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((field) => (
            <div key={field.name} className="grid grid-cols-1 gap-2">
              <Label htmlFor={field.name} className="flex items-center gap-1">
                {field.icon}
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step={field.name === 'ctr' || field.name === 'conversionRate' ? '0.1' : '1'}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder="Enter value"
              />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="profitMargin" className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Profit Margin (%)
            </Label>
            <Input
              id="profitMargin"
              name="profitMargin"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.profitMargin}
              onChange={handleInputChange}
              placeholder="Enter profit margin percentage"
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="targetRoas" className="flex items-center gap-1">
              Target ROAS
            </Label>
            <Input
              id="targetRoas"
              name="targetRoas"
              type="number"
              min="0"
              step="0.1"
              value={formData.targetRoas}
              onChange={handleInputChange}
              placeholder="Target ROAS (e.g. 2 means $2 revenue per $1 spent)"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onCalculate}
          disabled={isLoading}
          className="min-w-[150px]"
        >
          {isLoading ? "Calculating..." : "Calculate ROAS"}
        </Button>
      </div>
    </div>
  );
};

export default RoasCalculatorForm;
