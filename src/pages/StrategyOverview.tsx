
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import useStrategyData from "@/hooks/useStrategyData";
import { Skeleton } from "@/components/ui/skeleton";

const StrategyOverview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { strategy, isLoading } = useStrategyData({ id });

  useEffect(() => {
    if (!id) {
      toast.error("Missing strategy ID");
      navigate("/dashboard");
    }
  }, [id, navigate]);

  const handleCreateBriefing = () => {
    navigate(`/strategy-details/${id}?tab=briefing`);
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-48 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-40" />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!strategy) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Strategy Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested strategy could not be found or you don't have permission to access it.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-start mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Strategy Created: {strategy.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <p className="text-green-800 font-medium">Your marketing strategy has been successfully created!</p>
                <p className="text-green-700 mt-2">You can now proceed to create an AI briefing for this strategy.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Strategy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Strategy Name</p>
                    <p className="text-base">{strategy.name}</p>
                  </div>
                  {strategy.description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-base">{strategy.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCreateBriefing}>
                  Create AI Briefing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StrategyOverview;
