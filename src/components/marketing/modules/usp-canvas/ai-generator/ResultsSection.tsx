
import React, { useState } from 'react';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';
import TabbedContent from '@/components/ui/tabbed-content';
import { TabItem } from '@/components/ui/tabbed-content/types';
import { toast } from 'sonner';

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

  // Handle adding a single job
  const handleAddSingleJob = (job: any) => {
    if (job) {
      onAddJobs([job]);
      toast.success('Job added to Customer Profile');
    }
  };

  // Handle adding a single pain
  const handleAddSinglePain = (pain: any) => {
    if (pain) {
      onAddPains([pain]);
      toast.success('Pain added to Customer Profile');
    }
  };

  // Handle adding a single gain
  const handleAddSingleGain = (gain: any) => {
    if (gain) {
      onAddGains([gain]);
      toast.success('Gain added to Customer Profile');
    }
  };

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
          onAddSingleItem={handleAddSingleJob}
          renderItem={(item, index) => (
            <AIResultsItem
              key={`job-${index}`}
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
          onAddSingleItem={handleAddSinglePain}
          renderItem={(item, index) => (
            <AIResultsItem
              key={`pain-${index}`}
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
          onAddSingleItem={handleAddSingleGain}
          renderItem={(item, index) => (
            <AIResultsItem
              key={`gain-${index}`}
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
