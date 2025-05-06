
import React from "react";
import { User, Target, BarChart } from "lucide-react";
import StatCard from "./StatCard";

type StatItem = {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
};

interface StatsGridProps {
  stats: StatItem[];
  isLoading: boolean;
}

const StatsGrid = ({ stats, isLoading }: StatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          linkHref={stat.title.includes("Contacts") ? "/crm/contacts" : "/crm/deals"}
          linkText={stat.title.includes("Contacts") ? "View all contacts" : "View details"}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
