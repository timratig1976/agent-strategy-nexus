
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DatabaseStatusProps {
  status: 'checking' | 'ready' | 'not-setup';
}

const DatabaseStatus = ({ status }: DatabaseStatusProps) => {
  const navigate = useNavigate();
  
  if (status === 'checking') {
    return (
      <Card className="mb-8 border-dashed border-2 border-blue-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <p>Checking database status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'not-setup') {
    return (
      <Card className="mb-8 border-2 border-red-300">
        <CardHeader>
          <CardTitle className="text-red-500">Database Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The application requires database tables to be set up before you can use it. Please click the button below to set up the database.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/setup-database")} 
            variant="destructive" 
            className="w-full"
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
