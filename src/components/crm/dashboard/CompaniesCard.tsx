
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const CompaniesCard = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>Organizations in your CRM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-100">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Companies by Contact</p>
                <p className="text-xs text-muted-foreground">View companies associated with your contacts</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-center text-muted-foreground">
              Companies are extracted from your contacts' information
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/crm/contacts">Manage Contacts</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompaniesCard;
