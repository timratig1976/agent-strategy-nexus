
import React from "react";
import { User, Target, BarChart } from "lucide-react";
import StatCard from "./StatCard";

interface StatsGridProps {
  contactsCount: number;
  dealsCount: number;
  dealsValue: number;
  isLoading: boolean;
}

const StatsGrid = ({ 
  contactsCount, 
  dealsCount, 
  dealsValue, 
  isLoading 
}: StatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Contacts"
        value={contactsCount}
        description="People in your network"
        icon={<User className="w-4 h-4 text-muted-foreground" />}
        linkHref="/crm/contacts"
        linkText="View all contacts"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Active Deals"
        value={dealsCount}
        description="Ongoing sales opportunities"
        icon={<Target className="w-4 h-4 text-muted-foreground" />}
        linkHref="/crm/deals"
        linkText="View all deals"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Pipeline Value"
        value={`$${!isLoading ? dealsValue.toLocaleString() : '...'}`}
        description="Total value of active deals"
        icon={<BarChart className="w-4 h-4 text-muted-foreground" />}
        linkHref="/crm/deals"
        linkText="View pipeline"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsGrid;
