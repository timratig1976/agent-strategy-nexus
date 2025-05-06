
import React from "react";
import { ChartBar } from "lucide-react";
import { useChannelStrategy } from "./useChannelStrategy";
import ChannelStrategyForm from "./ChannelStrategyForm";
import ChannelStrategyResults from "./ChannelStrategyResults";

const ChannelStrategyModule = () => {
  const { 
    formData, 
    setFormData, 
    isLoading, 
    results, 
    handleSubmit 
  } = useChannelStrategy();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <ChartBar className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Channel & Budget Strategy</h2>
          <p className="text-muted-foreground mt-1">
            Plan your marketing channels and budget allocation
          </p>
        </div>
      </div>

      {!results && (
        <ChannelStrategyForm
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      )}

      {results && (
        <ChannelStrategyResults
          results={results}
          onReset={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default ChannelStrategyModule;
