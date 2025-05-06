
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Database, Loader2 } from "lucide-react";

interface DatabaseStatusProps {
  status: 'checking' | 'ready' | 'not-setup';
}

const DatabaseStatus = ({ status }: DatabaseStatusProps) => {
  const navigate = useNavigate();
  
  if (status === 'checking') {
    return (
      <Card className="mb-8 border-dashed bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p>Checking database status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'not-setup') {
    return (
      <Card className="mb-8 border-2 border-red-200 bg-red-50/50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Database className="h-5 w-5" />
            Database Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The application requires database tables to be set up before you can use it. Please click the button below to set up the database.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/setup-database")} 
            variant="destructive" 
            className="w-full shadow-sm hover:shadow-md transition-shadow"
          >
            Setup Database Now
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return null;
};

export default DatabaseStatus;
