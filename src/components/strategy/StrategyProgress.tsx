
import React from "react";
import { useNavigate } from "react-router-dom";
import { Strategy } from "@/types/marketing";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { getOrderedStages, getStageLabel, getStageIndex } from "@/utils/strategyUrlUtils";

interface StrategyProgressProps {
  currentStage: string;
  strategy: Strategy;
}

const StrategyProgress: React.FC<StrategyProgressProps> = ({ currentStage, strategy }) => {
  const navigate = useNavigate();
  const orderedStages = getOrderedStages();
  const currentIndex = orderedStages.indexOf(currentStage);
  const strategyStateIndex = getStageIndex(strategy.state);

  // Calculate progress percentage
  const totalSteps = orderedStages.length;
  const progressValue = Math.round(((currentIndex + 1) / totalSteps) * 100);
  
  // Navigate to a different stage when clicking on the breadcrumb
  const handleStageClick = (stage: string, index: number) => {
    // Only allow navigation to current or previous stages
    if (index <= strategyStateIndex) {
      navigate(`/strategy/${strategy.id}/${stage}`);
    }
  };
  
  return (
    <div className="my-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Progress</span>
        <span className="text-sm font-medium">{progressValue}%</span>
      </div>
      
      <Progress value={progressValue} className="h-2" />
      
      <Breadcrumb className="mt-4">
        <BreadcrumbList className="flex-wrap">
          {orderedStages.map((stage, index) => (
            <React.Fragment key={stage}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => handleStageClick(stage, index)}
                  className={`
                    ${index === currentIndex ? 'font-semibold text-primary' : ''}
                    ${index > strategyStateIndex ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                >
                  {getStageLabel(stage)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default StrategyProgress;
