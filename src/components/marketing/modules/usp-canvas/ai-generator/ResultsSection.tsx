
import React from 'react';
import ResultTabs from './ResultTabs';
import { StoredAIResult } from '../types';

interface ResultsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storedAIResult: StoredAIResult;
  handleAddJobs: () => void;
  handleAddPains: () => void;
  handleAddGains: () => void;
  handleAddSingleJob: (job: any) => void;
  handleAddSinglePain: (pain: any) => void;
  handleAddSingleGain: (gain: any) => void;
  formatContent: (items: any[] | undefined, onAddSingleItem?: (item: any) => void) => React.ReactNode;
  isGenerating: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  activeTab,
  setActiveTab,
  storedAIResult,
  handleAddJobs,
  handleAddPains,
  handleAddGains,
  handleAddSingleJob,
  handleAddSinglePain,
  handleAddSingleGain,
  formatContent,
  isGenerating
}) => {
  return (
    <div>
      <ResultTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storedAIResult={storedAIResult}
        handleAddJobs={handleAddJobs}
        handleAddPains={handleAddPains}
        handleAddGains={handleAddGains}
        handleAddSingleJob={handleAddSingleJob}
        handleAddSinglePain={handleAddSinglePain}
        handleAddSingleGain={handleAddSingleGain}
        formatContent={formatContent}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ResultsSection;
