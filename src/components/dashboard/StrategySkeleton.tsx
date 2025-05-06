
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const StrategySkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-[260px] animate-pulse">
          <CardHeader className="bg-gray-100 dark:bg-gray-800 h-[60px]"></CardHeader>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full mt-4"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StrategySkeleton;
