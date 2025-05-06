
import React from "react";

const HowItWorks = () => {
  return (
    <div className="bg-muted rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
      <ol className="space-y-4 list-decimal list-inside">
        <li className="p-2">
          <span className="font-medium">Choose your application</span> - Switch between Marketing Strategy and CRM to fit your current needs.
        </li>
        <li className="p-2">
          <span className="font-medium">Set up your data</span> - Configure your business information and import your contacts.
        </li>
        <li className="p-2">
          <span className="font-medium">Get insights</span> - Leverage AI-powered marketing strategies and customer relationship tools.
        </li>
        <li className="p-2">
          <span className="font-medium">Track progress</span> - Monitor your success and refine your approach over time.
        </li>
      </ol>
    </div>
  );
};

export default HowItWorks;
