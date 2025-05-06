
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  linkHref: string;
  linkText: string;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  linkHref,
  linkText,
  isLoading = false
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "..." : value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild>
          <Link to={linkHref}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
