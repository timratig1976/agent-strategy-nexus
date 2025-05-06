
"use client";

import React from "react";
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "./chart";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
}

interface ChartOptions {
  responsive?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      max?: number;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    x?: {
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
  maintainAspectRatio?: boolean;
}

interface BarChartProps {
  data: ChartData;
  options?: ChartOptions;
  className?: string;
}

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
    }[];
  };
  options?: ChartOptions;
  className?: string;
}

export function BarChart({ data, options, className }: BarChartProps) {
  // Transform the data format from Chart.js style to Recharts style
  const rechartsData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });

  // Get colors for bars
  const getColor = (datasetIndex: number, barIndex: number) => {
    const dataset = data.datasets[datasetIndex];
    if (Array.isArray(dataset.backgroundColor)) {
      return dataset.backgroundColor[barIndex % dataset.backgroundColor.length];
    }
    return dataset.backgroundColor || "#7dd3fc";
  };

  return (
    <ChartContainer config={{}} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={rechartsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            label={options?.scales?.x?.title?.display ? { 
              value: options.scales.x.title.text || '', 
              position: 'bottom' 
            } : undefined}
          />
          <YAxis 
            domain={[0, options?.scales?.y?.max || 'auto']} 
            label={options?.scales?.y?.title?.display ? { 
              value: options.scales.y.title.text || '', 
              angle: -90, 
              position: 'left' 
            } : undefined}
          />
          <Tooltip content={<ChartTooltipContent />} />
          {options?.plugins?.legend?.display !== false && <Legend />}
          
          {data.datasets.map((dataset, index) => (
            <Bar 
              key={index}
              dataKey={dataset.label}
              name={dataset.label}
              fill={getColor(index, 0)}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function LineChart({ data, options, className }: LineChartProps) {
  // Transform the data format from Chart.js style to Recharts style
  const rechartsData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });

  return (
    <ChartContainer config={{}} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={rechartsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name"
            label={options?.scales?.x?.title?.display ? { 
              value: options.scales.x.title.text || '', 
              position: 'bottom' 
            } : undefined}
          />
          <YAxis 
            domain={[0, options?.scales?.y?.max || 'auto']}
            label={options?.scales?.y?.title?.display ? { 
              value: options.scales.y.title.text || '', 
              angle: -90, 
              position: 'left' 
            } : undefined}
          />
          <Tooltip content={<ChartTooltipContent />} />
          {options?.plugins?.legend?.display !== false && <Legend />}
          
          {data.datasets.map((dataset, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={dataset.label}
              name={dataset.label}
              stroke={dataset.borderColor || `hsl(${(index * 60) % 360}, 80%, 45%)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
