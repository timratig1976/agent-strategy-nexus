
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

interface ProjectBriefingFormData {
  projectName: string;
  companyName: string;
  industryType: string;
  targetAudience: string;
  projectGoals: string;
  website: string;
}

const ProjectBriefingModule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectBriefingFormData>({
    projectName: "",
    companyName: "",
    industryType: "",
    targetAudience: "",
    projectGoals: "",
    website: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here we would send the data to the backend
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Project brief created",
        description: "Your marketing project has been set up successfully.",
      });

      // Navigate to the next step or dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting project brief:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem setting up your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Briefcase className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Project Onboarding & Briefing</h2>
          <p className="text-muted-foreground mt-1">
            Set up your marketing project and define your goals
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide details about your company and marketing goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    placeholder="Q4 Marketing Campaign"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your Company"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industryType">Industry</Label>
                  <Input
                    id="industryType"
                    name="industryType"
                    placeholder="E.g., Technology, Healthcare, Retail"
                    value={formData.industryType}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  placeholder="Describe your ideal customers"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectGoals">Project Goals</Label>
                <Textarea
                  id="projectGoals"
                  name="projectGoals"
                  placeholder="What are your marketing objectives?"
                  value={formData.projectGoals}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProjectBriefingModule;
