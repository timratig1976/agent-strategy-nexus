
import React from "react";
import { CheckCircle, BookOpen, Activity, BarChart } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <BookOpen className="h-7 w-7 text-blue-500" />,
      title: "Choose your application",
      description: "Switch between Marketing Strategy and CRM to fit your current needs."
    },
    {
      icon: <CheckCircle className="h-7 w-7 text-green-500" />,
      title: "Set up your data",
      description: "Configure your business information and import your contacts."
    },
    {
      icon: <Activity className="h-7 w-7 text-purple-500" />,
      title: "Get insights",
      description: "Leverage AI-powered marketing strategies and customer relationship tools."
    },
    {
      icon: <BarChart className="h-7 w-7 text-amber-500" />,
      title: "Track progress",
      description: "Monitor your success and refine your approach over time."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg shadow-sm transition-all hover:shadow-md">
            <div className="mt-1">{step.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
