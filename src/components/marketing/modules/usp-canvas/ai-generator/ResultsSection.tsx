
import React from 'react';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';

interface ResultsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storedAIResult: StoredAIResult;
  onAddJobs: (jobs: any[]) => void;
  onAddPains: (pains: any[]) => void;
  onAddGains: (gains: any[]) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  activeTab,
  setActiveTab,
  storedAIResult,
  onAddJobs,
  onAddPains,
  onAddGains
}) => {
  return (
    <div className="mt-8 space-y-6">
      {/* Display all three sections at once instead of conditionally */}
      <AIResultsPanel
        title="Kundenaufgaben (Jobs)"
        items={storedAIResult.jobs || []}
        onAddItems={onAddJobs}
        renderItem={(item, index) => (
          <AIResultsItem
            key={index}
            item={item}
            ratingProperty="priority"
            ratingLabel="Priorität"
          />
        )}
      />

      <AIResultsPanel
        title="Kundenprobleme (Pains)"
        items={storedAIResult.pains || []}
        onAddItems={onAddPains}
        renderItem={(item, index) => (
          <AIResultsItem
            key={index}
            item={item}
            ratingProperty="severity"
            ratingLabel="Schwere"
          />
        )}
      />

      <AIResultsPanel
        title="Kundenvorteile (Gains)"
        items={storedAIResult.gains || []}
        onAddItems={onAddGains}
        renderItem={(item, index) => (
          <AIResultsItem
            key={index}
            item={item}
            ratingProperty="importance"
            ratingLabel="Wichtigkeit"
          />
        )}
      />
    </div>
  );
};

export default ResultsSection;
