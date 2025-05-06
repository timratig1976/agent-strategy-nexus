
import React from "react";
import NavBar from "@/components/NavBar";
import AIPromptManager from "@/components/marketing/ai-prompt-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIPromptManagerPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => navigate("/marketing-hub")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketing Hub</span>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Prompt Manager</h1>
        <AIPromptManager />
      </div>
    </div>
  );
};

export default AIPromptManagerPage;
