
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
    <div className="mt-8">
      {activeTab === 'jobs' && (
        <AIResultsPanel
          title="Kundenaufgaben"
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
      )}

      {activeTab === 'pains' && (
        <AIResultsPanel
          title="Kundenprobleme"
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
      )}

      {activeTab === 'gains' && (
        <AIResultsPanel
          title="Kundenvorteile"
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
      )}
    </div>
  );
};

export default ResultsSection;
