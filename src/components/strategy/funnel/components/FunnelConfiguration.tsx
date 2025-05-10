
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

const FunnelConfiguration: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Funnel Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">What is a Marketing Funnel?</h3>
              <p className="text-sm text-muted-foreground">
                A marketing funnel represents the customer journey from the initial awareness stage to the final purchase. It helps you visualize and understand the process of turning prospects into customers.
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Common Funnel Stages:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded">TOFU</span>
                <span><strong>Awareness</strong> - Prospects become aware of your brand.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded">MOFU</span>
                <span><strong>Interest/Consideration</strong> - Prospects show interest in solutions.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded">BOFU</span>
                <span><strong>Decision</strong> - Prospects are ready to purchase.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded">POST</span>
                <span><strong>Retention</strong> - Customer loyalty and advocacy.</span>
              </li>
            </ul>
          </div>
          
          <p className="text-sm">
            Create your custom funnel structure below by adding stages and touchpoints relevant to your business and marketing strategy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelConfiguration;
