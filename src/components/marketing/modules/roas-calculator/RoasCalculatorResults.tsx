
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoasResults } from "./types";
import { BarChart3, DollarSign, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RoasCalculatorResultsProps {
  results: RoasResults | null;
  onReset: () => void;
}

const RoasCalculatorResults = ({ results, onReset }: RoasCalculatorResultsProps) => {
  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No results available. Please calculate ROAS first.</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(results.revenue)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{results.roas.toFixed(2)}x</span>
            </div>
            <div className="mt-2">
              <Progress value={Math.min(results.roas * 20, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Target Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {results.roas >= (results.targetRoas || 1) ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-600">On Target</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-2xl font-bold text-red-600">Below Target</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Monthly Ad Spend</TableCell>
                <TableCell className="text-right">{formatCurrency(results.adSpend)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Clicks</TableCell>
                <TableCell className="text-right">{results.clicks.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Click-Through Rate (CTR)</TableCell>
                <TableCell className="text-right">{formatPercent(results.ctr)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Conversion Rate</TableCell>
                <TableCell className="text-right">{formatPercent(results.conversionRate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Conversions</TableCell>
                <TableCell className="text-right">{results.conversions.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Order Value</TableCell>
                <TableCell className="text-right">{formatCurrency(results.averageOrderValue)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost per Click (CPC)</TableCell>
                <TableCell className="text-right">{formatCurrency(results.cpc)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost per Acquisition (CPA)</TableCell>
                <TableCell className="text-right">{formatCurrency(results.cpa)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Financial Metrics</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(results.revenue)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profit</TableCell>
                <TableCell className="text-right">{formatCurrency(results.profit)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Return on Ad Spend (ROAS)</TableCell>
                <TableCell className="text-right">{results.roas.toFixed(2)}x</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Target ROAS</TableCell>
                <TableCell className="text-right">{results.targetRoas?.toFixed(2) || "N/A"}x</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profit Margin</TableCell>
                <TableCell className="text-right">{formatPercent(results.profitMargin)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={onReset} 
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Different Values</span>
        </Button>
      </div>
    </div>
  );
};

export default RoasCalculatorResults;
