
import React, { useState } from 'react';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';
import TabbedContent from '@/components/ui/tabbed-content';
import { TabItem } from '@/components/ui/tabbed-content/types';

interface ResultsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storedAIResult: StoredAIResult;
  onAddJobs: (jobs: any[]) => void;
  onAddPains: (pains: any[]) => void;
  onAddGains: (gains: any[]) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  storedAIResult,
  onAddJobs,
  onAddPains,
  onAddGains
}) => {
  const [currentTab, setCurrentTab] = useState<string>('jobs');

  const tabs: TabItem[] = [
    {
      id: 'jobs',
      label: "Kundenaufgaben (Jobs)",
      count: storedAIResult.jobs?.length || 0,
      content: (
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
      )
    },
    {
      id: 'pains',
      label: "Kundenprobleme (Pains)",
      count: storedAIResult.pains?.length || 0,
      content: (
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
      )
    },
    {
      id: 'gains',
      label: "Kundenvorteile (Gains)",
      count: storedAIResult.gains?.length || 0,
      content: (
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
      )
    }
  ];

  return (
    <div className="mt-8">
      <TabbedContent
        tabs={tabs}
        defaultTabId="jobs"
        activeTabId={currentTab}
        onTabChange={setCurrentTab}
        className="bg-background border rounded-md"
        tabsClassName="p-1"
        contentClassName="p-4"
      />
    </div>
  );
};

export default ResultsSection;
