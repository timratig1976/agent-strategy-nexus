
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, Sparkles, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface LandingPageDesignerProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  funnelData: any;
  isLoading: boolean;
}

const LandingPageDesigner: React.FC<LandingPageDesignerProps> = ({
  campaignData,
  onSaveCampaign,
  funnelData,
  isLoading
}) => {
  const [landingPages, setLandingPages] = useState<any[]>(
    campaignData?.landingPages || []
  );
  
  const [newLandingPage, setNewLandingPage] = useState({
    name: "",
    url: "",
    funnelStage: "",
    headline: "",
    subheadline: "",
    features: [],
    benefits: [],
    ctaText: "Get Started",
    ctaColor: "#3366FF",
    layout: "centered",
    includeTestimonials: true,
    includeFaq: true,
    template: "standard"
  });
  
  const [isAddingLandingPage, setIsAddingLandingPage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  
  // Available templates
  const templates = [
    { value: "standard", label: "Standard Landing Page" },
    { value: "leadgen", label: "Lead Generation" },
    { value: "product", label: "Product Sales Page" },
    { value: "webinar", label: "Webinar Registration" },
    { value: "ebook", label: "E-book Download" }
  ];
  
  // Layout options
  const layouts = [
    { value: "centered", label: "Centered Hero" },
    { value: "split", label: "Split Screen" },
    { value: "zigzag", label: "Zig Zag Sections" },
    { value: "minimal", label: "Minimal" }
  ];
  
  // Handle adding a new landing page
  const handleAddLandingPage = () => {
    if (!newLandingPage.name) {
      toast.error("Please enter a name for your landing page");
      return;
    }
    
    if (!newLandingPage.headline) {
      toast.error("Please enter a headline for your landing page");
      return;
    }
    
    const updatedLandingPages = [
      ...landingPages,
      {
        id: `landingpage-${Date.now()}`,
        ...newLandingPage
      }
    ];
    
    setLandingPages(updatedLandingPages);
    
    // Reset form
    setNewLandingPage({
      name: "",
      url: "",
      funnelStage: "",
      headline: "",
      subheadline: "",
      features: [],
      benefits: [],
      ctaText: "Get Started",
      ctaColor: "#3366FF",
      layout: "centered",
      includeTestimonials: true,
      includeFaq: true,
      template: "standard"
    });
    
    setIsAddingLandingPage(false);
    toast.success("Landing page added");
  };
  
  // Handle removing a landing page
  const handleRemoveLandingPage = (landingPageId: string) => {
    const updatedLandingPages = landingPages.filter(page => page.id !== landingPageId);
    setLandingPages(updatedLandingPages);
    toast.success("Landing page removed");
  };
  
  // Save landing pages
  const handleSave = () => {
    const updatedCampaign = {
      ...(campaignData || {}),
      landingPages: landingPages,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(updatedCampaign);
  };
  
  // Add feature to new landing page
  const handleAddFeature = () => {
    if (!newFeature) return;
    
    setNewLandingPage({
      ...newLandingPage,
      features: [...newLandingPage.features, newFeature]
    });
    
    setNewFeature("");
  };
  
  // Remove feature from new landing page
  const handleRemoveFeature = (feature: string) => {
    setNewLandingPage({
      ...newLandingPage,
      features: newLandingPage.features.filter(f => f !== feature)
    });
  };
  
  // Add benefit to new landing page
  const handleAddBenefit = () => {
    if (!newBenefit) return;
    
    setNewLandingPage({
      ...newLandingPage,
      benefits: [...newLandingPage.benefits, newBenefit]
    });
    
    setNewBenefit("");
  };
  
  // Remove benefit from new landing page
  const handleRemoveBenefit = (benefit: string) => {
    setNewLandingPage({
      ...newLandingPage,
      benefits: newLandingPage.benefits.filter(b => b !== benefit)
    });
  };
  
  // Generate landing page based on funnel stage and campaign data
  const handleGenerateLandingPage = () => {
    if (!funnelData || !funnelData.stages || funnelData.stages.length === 0) {
      toast.error("No funnel data available to create a landing page");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call/generation with a timeout
    setTimeout(() => {
      try {
        // Select a random funnel stage if none is selected
        const selectedStage = newLandingPage.funnelStage || 
          funnelData.stages[Math.floor(Math.random() * funnelData.stages.length)].id;
        
        // Find the selected funnel stage
        const funnelStage = funnelData.stages.find((stage: any) => stage.id === selectedStage);
        
        if (!funnelStage) {
          throw new Error("Selected funnel stage not found");
        }
        
        // Set template based on funnel stage
        let template = "standard";
        let ctaText = "Get Started";
        let layout = "centered";
        
        if (funnelStage.name.toLowerCase().includes("aware")) {
          template = "standard";
          ctaText = "Learn More";
        } else if (funnelStage.name.toLowerCase().includes("interest") || funnelStage.name.toLowerCase().includes("consider")) {
          template = "leadgen";
          ctaText = "Download Now";
        } else if (funnelStage.name.toLowerCase().includes("conversion") || funnelStage.name.toLowerCase().includes("decision")) {
          template = "product";
          ctaText = "Buy Now";
          layout = "split";
        }
        
        // Generate features and benefits
        const generatedFeatures = funnelStage.touchpoints.slice(0, 3).map((touchpoint: string) => 
          `Feature related to ${touchpoint}`
        );
        
        const generatedBenefits = funnelStage.keyMetrics.slice(0, 3).map((metric: string) => 
          `Benefit: Improve your ${metric}`
        );
        
        // Generate headline and subheadline
        const headline = `${funnelStage.name} Solution for Your Business`;
        const subheadline = `Discover how our solution helps with ${funnelStage.description}`;
        
        // Create the generated landing page
        const generatedLandingPage = {
          name: `${funnelStage.name} Landing Page`,
          url: `/${funnelStage.name.toLowerCase().replace(/\s+/g, '-')}`,
          funnelStage: selectedStage,
          headline,
          subheadline,
          features: generatedFeatures,
          benefits: generatedBenefits,
          ctaText,
          ctaColor: "#3366FF",
          layout,
          includeTestimonials: true,
          includeFaq: true,
          template
        };
        
        setNewLandingPage(generatedLandingPage);
        setIsAddingLandingPage(true);
        
        toast.success("Landing page generated based on funnel stage");
        
      } catch (error) {
        console.error("Error generating landing page:", error);
        toast.error("Failed to generate landing page");
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };
  
  // Copy landing page HTML to clipboard
  const handleCopyHtml = (landingPage: any) => {
    // Generate a simple HTML template based on landing page data
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.headline}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white font-sans">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-800">Your Brand</h1>
        </div>
        <nav class="flex space-x-8">
          <a href="#" class="text-gray-500 hover:text-gray-900">Features</a>
          <a href="#" class="text-gray-500 hover:text-gray-900">Benefits</a>
          <a href="#" class="text-gray-500 hover:text-gray-900">Testimonials</a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <div class="bg-gray-50 py-12 md:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${landingPage.layout === 'split' ? 'md:grid md:grid-cols-2 md:gap-8 items-center' : 'text-center'}">
        <div>
          <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            ${landingPage.headline}
          </h2>
          <p class="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 ${landingPage.layout === 'split' ? '' : 'md:max-w-3xl'}">
            ${landingPage.subheadline}
          </p>
          <div class="mt-10">
            <a href="#" class="rounded-md shadow px-8 py-3 bg-[${landingPage.ctaColor}] text-white font-medium hover:bg-opacity-90">
              ${landingPage.ctaText}
            </a>
          </div>
        </div>
        ${landingPage.layout === 'split' ? '<div class="mt-12 md:mt-0"><img src="https://via.placeholder.com/600x400" alt="Hero image" class="rounded-lg shadow-xl"></div>' : ''}
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-[${landingPage.ctaColor}] font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need
          </p>
        </div>

        <div class="mt-10">
          <dl class="${landingPage.layout === 'zigzag' ? '' : 'space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'}">
            ${landingPage.features.map((feature: string, index: number) => `
            <div class="${landingPage.layout === 'zigzag' ? 'flex flex-col md:flex-row items-center my-12 md:my-16' : 'relative'}">
              ${landingPage.layout === 'zigzag' ? (index % 2 === 0 ? `
              <div class="md:w-1/2 md:pr-8">
                <h3 class="text-2xl font-bold text-gray-900">Feature ${index + 1}</h3>
                <p class="mt-2 text-gray-600">${feature}</p>
              </div>
              <div class="md:w-1/2 mt-6 md:mt-0">
                <img src="https://via.placeholder.com/400x300" alt="Feature image" class="rounded-lg shadow">
              </div>` : 
              `<div class="md:w-1/2 mt-6 md:mt-0 md:order-first">
                <img src="https://via.placeholder.com/400x300" alt="Feature image" class="rounded-lg shadow">
              </div>
              <div class="md:w-1/2 md:pl-8">
                <h3 class="text-2xl font-bold text-gray-900">Feature ${index + 1}</h3>
                <p class="mt-2 text-gray-600">${feature}</p>
              </div>`) : `
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[${landingPage.ctaColor}] text-white">
                  <!-- Icon -->
                  ${index + 1}
                </div>
                <p class="ml-16 text-lg font-medium text-gray-900">Feature ${index + 1}</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                ${feature}
              </dd>`}
            </div>`).join('')}
          </dl>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-[${landingPage.ctaColor}] font-semibold tracking-wide uppercase">Benefits</h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why choose us
          </p>
        </div>
        <div class="mt-10">
          <ul class="space-y-4">
            ${landingPage.benefits.map((benefit: string) => `
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">${benefit}</p>
            </li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    ${landingPage.includeTestimonials ? `
    <!-- Testimonials Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-[${landingPage.ctaColor}] font-semibold tracking-wide uppercase">Testimonials</h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What our clients say
          </p>
        </div>
        <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="bg-gray-50 p-6 rounded-lg shadow">
            <p class="text-gray-600 italic">"This product has completely changed how we operate. Highly recommended!"</p>
            <div class="mt-4 flex items-center">
              <div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/150" alt="Client">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Jane Smith</p>
                <p class="text-sm text-gray-500">CEO, Company Inc.</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg shadow">
            <p class="text-gray-600 italic">"The results we've seen since implementing this solution have been incredible."</p>
            <div class="mt-4 flex items-center">
              <div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/150" alt="Client">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">John Doe</p>
                <p class="text-sm text-gray-500">Marketing Director, Enterprise Co.</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg shadow">
            <p class="text-gray-600 italic">"Easy to implement and our team loves using it. Great customer support too!"</p>
            <div class="mt-4 flex items-center">
              <div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/150" alt="Client">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Sarah Johnson</p>
                <p class="text-sm text-gray-500">Operations Manager, Tech Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>` : ''}

    ${landingPage.includeFaq ? `
    <!-- FAQ Section -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-[${landingPage.ctaColor}] font-semibold tracking-wide uppercase">FAQ</h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
        </div>
        <div class="mt-10">
          <dl class="space-y-6 divide-y divide-gray-200">
            <div class="pt-6">
              <dt class="text-lg font-medium text-gray-900">
                How does this solution work?
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                Our solution integrates seamlessly with your existing systems, providing immediate benefits without disrupting your workflow.
              </dd>
            </div>
            <div class="pt-6">
              <dt class="text-lg font-medium text-gray-900">
                What kind of support do you offer?
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                We provide 24/7 customer support via chat, email, and phone to ensure you always have help when you need it.
              </dd>
            </div>
            <div class="pt-6">
              <dt class="text-lg font-medium text-gray-900">
                How long does implementation take?
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                Most customers are up and running within 48 hours, with our team guiding you through the entire process.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>` : ''}

    <!-- CTA Section -->
    <div class="bg-[${landingPage.ctaColor}] py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-center">
          <span class="block">Ready to get started?</span>
        </h2>
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-md shadow">
            <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[${landingPage.ctaColor}] bg-white hover:bg-gray-50">
              ${landingPage.ctaText}
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-gray-400">
        © ${new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  </footer>
</body>
</html>`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(html)
      .then(() => toast.success("HTML template copied to clipboard"))
      .catch((error) => {
        console.error("Failed to copy HTML template:", error);
        toast.error("Failed to copy HTML template");
      });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading landing page data...</span>
      </div>
    );
  }

  const funnelStages = funnelData?.stages || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Landing Page Designer</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateLandingPage}
            disabled={isGenerating || !funnelData}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Landing Page
              </>
            )}
          </Button>
          <Button 
            onClick={() => setIsAddingLandingPage(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Landing Page
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Landing Pages
          </Button>
        </div>
      </div>
      
      {isAddingLandingPage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Landing Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landing-name">Page Name</Label>
                <Input
                  id="landing-name"
                  value={newLandingPage.name}
                  onChange={(e) => setNewLandingPage({...newLandingPage, name: e.target.value})}
                  placeholder="Enter landing page name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="landing-url">URL Path</Label>
                <Input
                  id="landing-url"
                  value={newLandingPage.url}
                  onChange={(e) => setNewLandingPage({...newLandingPage, url: e.target.value})}
                  placeholder="e.g., /landing-page"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landing-funnel-stage">Funnel Stage</Label>
                <Select 
                  value={newLandingPage.funnelStage}
                  onValueChange={(value) => setNewLandingPage({...newLandingPage, funnelStage: value})}
                >
                  <SelectTrigger id="landing-funnel-stage">
                    <SelectValue placeholder="Select funnel stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnelStages.map((stage: any) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="landing-template">Template</Label>
                <Select 
                  value={newLandingPage.template}
                  onValueChange={(value) => setNewLandingPage({...newLandingPage, template: value})}
                >
                  <SelectTrigger id="landing-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-3 w-[400px] mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landing-headline">Headline</Label>
                  <Input
                    id="landing-headline"
                    value={newLandingPage.headline}
                    onChange={(e) => setNewLandingPage({...newLandingPage, headline: e.target.value})}
                    placeholder="Enter headline"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landing-subheadline">Subheadline</Label>
                  <Input
                    id="landing-subheadline"
                    value={newLandingPage.subheadline}
                    onChange={(e) => setNewLandingPage({...newLandingPage, subheadline: e.target.value})}
                    placeholder="Enter subheadline"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landing-cta-text">CTA Button Text</Label>
                    <Input
                      id="landing-cta-text"
                      value={newLandingPage.ctaText}
                      onChange={(e) => setNewLandingPage({...newLandingPage, ctaText: e.target.value})}
                      placeholder="Enter CTA text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landing-cta-color">CTA Button Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="landing-cta-color"
                        value={newLandingPage.ctaColor}
                        onChange={(e) => setNewLandingPage({...newLandingPage, ctaColor: e.target.value})}
                        className="w-12 h-9 p-1"
                      />
                      <Input
                        value={newLandingPage.ctaColor}
                        onChange={(e) => setNewLandingPage({...newLandingPage, ctaColor: e.target.value})}
                        placeholder="#HEX"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newLandingPage.features.map((feature, index) => (
                      <div key={index} className="bg-slate-100 px-3 py-1 rounded-md flex items-center">
                        <span className="text-sm mr-2">{feature}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-slate-200"
                          onClick={() => handleRemoveFeature(feature)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="flex-1"
                    />
                    <Button onClick={handleAddFeature}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Benefits</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newLandingPage.benefits.map((benefit, index) => (
                      <div key={index} className="bg-green-100 px-3 py-1 rounded-md flex items-center">
                        <span className="text-sm mr-2">{benefit}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-green-200"
                          onClick={() => handleRemoveBenefit(benefit)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit"
                      className="flex-1"
                    />
                    <Button onClick={handleAddBenefit}>Add</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landing-layout">Layout</Label>
                  <Select 
                    value={newLandingPage.layout}
                    onValueChange={(value) => setNewLandingPage({...newLandingPage, layout: value})}
                  >
                    <SelectTrigger id="landing-layout">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.value} value={layout.value}>
                          {layout.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="sections" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="testimonials"
                      checked={newLandingPage.includeTestimonials}
                      onCheckedChange={(checked) => 
                        setNewLandingPage({...newLandingPage, includeTestimonials: !!checked})
                      }
                    />
                    <Label htmlFor="testimonials">Include Testimonials Section</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="faq"
                      checked={newLandingPage.includeFaq}
                      onCheckedChange={(checked) => 
                        setNewLandingPage({...newLandingPage, includeFaq: !!checked})
                      }
                    />
                    <Label htmlFor="faq">Include FAQ Section</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingLandingPage(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLandingPage}>
                Add Landing Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Display existing landing pages */}
      {landingPages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No landing pages defined yet. Create landing pages for your marketing funnel.
            </p>
            <Button 
              onClick={() => setIsAddingLandingPage(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first landing page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {landingPages.map((landingPage) => {
            // Find the funnel stage this landing page belongs to
            const funnelStage = funnelStages.find((stage: any) => stage.id === landingPage.funnelStage);
            
            return (
              <Card key={landingPage.id} className="overflow-hidden">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{landingPage.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{landingPage.url || "No URL"}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLandingPage(landingPage.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 bg-slate-50">
                    <div className="text-center py-3 border-b border-slate-200">
                      <h3 className="font-bold">{landingPage.headline}</h3>
                      <p className="text-sm text-muted-foreground">{landingPage.subheadline}</p>
                      <Button
                        className="mt-2"
                        style={{ backgroundColor: landingPage.ctaColor }}
                      >
                        {landingPage.ctaText}
                      </Button>
                    </div>
                    <div className="py-2 px-4">
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <p className="font-medium">Template:</p>
                          <p className="text-muted-foreground">{templates.find(t => t.value === landingPage.template)?.label || landingPage.template}</p>
                        </div>
                        <div>
                          <p className="font-medium">Layout:</p>
                          <p className="text-muted-foreground">{layouts.find(l => l.value === landingPage.layout)?.label || landingPage.layout}</p>
                        </div>
                        {funnelStage && (
                          <div className="col-span-2">
                            <p className="font-medium">Funnel Stage:</p>
                            <p className="text-muted-foreground">{funnelStage.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-12 text-sm"
                      onClick={() => handleCopyHtml(landingPage)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy HTML
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandingPageDesigner;
