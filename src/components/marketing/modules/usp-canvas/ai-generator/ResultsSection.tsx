
import React from 'react';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';

interface ResultsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storedAIResult: StoredAIResult;
  handleAddJobs: (jobs: any[]) => void;
  handleAddPains: (pains: any[]) => void;
  handleAddGains: (gains: any[]) => void;
  isGenerating: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  activeTab,
  storedAIResult,
  handleAddJobs,
  handleAddPains,
  handleAddGains,
  isGenerating
}) => {
  return (
    <div className="mt-8">
      {activeTab === 'jobs' && (
        <AIResultsPanel
          title="Kundenaufgaben"
          items={storedAIResult.jobs}
          onAddItems={handleAddJobs}
          renderItem={(item, index) => (
            <AIResultsItem
              key={index}
              item={item}
              ratingProperty="priority"
              ratingLabel="Priorität"
            />
          )}
        />
      )}

      {activeTab === 'pains' && (
        <AIResultsPanel
          title="Kundenprobleme"
          items={storedAIResult.pains}
          onAddItems={handleAddPains}
          renderItem={(item, index) => (
            <AIResultsItem
              key={index}
              item={item}
              ratingProperty="severity"
              ratingLabel="Schwere"
            />
          )}
        />
      )}

      {activeTab === 'gains' && (
        <AIResultsPanel
          title="Kundenvorteile"
          items={storedAIResult.gains}
          onAddItems={handleAddGains}
          renderItem={(item, index) => (
            <AIResultsItem
              key={index}
              item={item}
              ratingProperty="importance"
              ratingLabel="Wichtigkeit"
            />
          )}
        />
      )}
    </div>
  );
};

export default ResultsSection;
