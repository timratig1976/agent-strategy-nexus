
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Strategy, StrategyState } from "@/types/marketing";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";
import { stateToSlug } from "@/utils/strategyUrlUtils";

interface StrategiesTableProps {
  strategies: Strategy[];
  stateLabels: Record<string, string>;
  stateColors: Record<string, string>;
}

// Helper function to get progress percentage based on strategy state
const getProgressPercentage = (state: StrategyState | string): number => {
  const stateMap: Record<string, number> = {
    'briefing': 12.5,
    'persona': 25,
    'pain_gains': 37.5,
    'statements': 50,
    'channel_strategy': 62.5,
    'funnel': 75,
    'roas_calculator': 87.5,
    'ads': 100,
    'completed': 100
  };
  
  return stateMap[state as string] || 0;
};

const StrategiesTable: React.FC<StrategiesTableProps> = ({ 
  strategies, 
  stateLabels, 
  stateColors 
}) => {
  // State for sorting
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort strategies
  const sortedStrategies = [...strategies].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "updatedAt") {
      comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortField === "state") {
      comparison = getProgressPercentage(b.state) - getProgressPercentage(a.state);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Display sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    }
    return null;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (strategies.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No Strategies Yet</h3>
        <p className="text-muted-foreground mb-6">Create your first marketing strategy to get started</p>
        <Link to="/create-strategy">
          <Button>Create Your First Strategy</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Strategy Name {renderSortIndicator("name")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("updatedAt")}
            >
              <div className="flex items-center">
                Last Updated {renderSortIndicator("updatedAt")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("state")}
            >
              <div className="flex items-center">
                Status & Progress {renderSortIndicator("state")}
              </div>
            </TableHead>
            <TableHead>Current Stage</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStrategies.map((strategy) => {
            const stateLabel = stateLabels[strategy.state] || strategy.state;
            const stateColor = stateColors[strategy.state] || "bg-gray-100 text-gray-800";
            const progressPercentage = getProgressPercentage(strategy.state);
            const stateSlug = stateToSlug[strategy.state as StrategyState] || "briefing";
            
            return (
              <TableRow key={strategy.id}>
                <TableCell className="font-medium">
                  {strategy.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(strategy.updatedAt)}
                </TableCell>
                <TableCell>
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${stateColor} mb-1.5`}>
                      {stateLabel}
                    </span>
                    <Progress value={progressPercentage} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {getStateLabel(strategy.state)}
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/strategy/${strategy.id}/${stateSlug}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StrategiesTable;
