
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Loader2, Plus, Save, Trash2, Columns, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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
    ctaColor: "#4f46e5",
    layout: "centered",
    includeTestimonials: true,
    includeFaq: false,
    template: "simple"
  });
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  
  const funnelStages = funnelData?.stages || [];
  
  // Available templates
  const templates = [
    { value: "simple", label: "Simple Lead Gen" },
    { value: "product", label: "Product Focused" },
    { value: "service", label: "Service Based" },
    { value: "webinar", label: "Webinar Registration" },
    { value: "ebook", label: "Ebook Download" }
  ];
  
  // Layout options
  const layouts = [
    { value: "centered", label: "Centered Hero" },
    { value: "split", label: "Split Screen" },
    { value: "zigzag", label: "Zig-Zag Sections" },
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
    
    const updatedPages = [
      ...landingPages,
      {
        id: `page-${Date.now()}`,
        ...newLandingPage
      }
    ];
    
    setLandingPages(updatedPages);
    
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
      ctaColor: "#4f46e5",
      layout: "centered",
      includeTestimonials: true,
      includeFaq: false,
      template: "simple"
    });
    
    setIsAddingPage(false);
    toast.success("Landing page added");
  };
  
  // Handle removing a landing page
  const handleRemovePage = (pageId: string) => {
    const updatedPages = landingPages.filter(page => page.id !== pageId);
    setLandingPages(updatedPages);
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
  
  // Add feature to the new landing page
  const handleAddFeature = () => {
    if (!newFeature) return;
    
    setNewLandingPage({
      ...newLandingPage,
      features: [...newLandingPage.features, newFeature]
    });
    
    setNewFeature("");
  };
  
  // Remove feature from the new landing page
  const handleRemoveFeature = (feature: string) => {
    setNewLandingPage({
      ...newLandingPage,
      features: newLandingPage.features.filter(f => f !== feature)
    });
  };
  
  // Add benefit to the new landing page
  const handleAddBenefit = () => {
    if (!newBenefit) return;
    
    setNewLandingPage({
      ...newLandingPage,
      benefits: [...newLandingPage.benefits, newBenefit]
    });
    
    setNewBenefit("");
  };
  
  // Remove benefit from the new landing page
  const handleRemoveBenefit = (benefit: string) => {
    setNewLandingPage({
      ...newLandingPage,
      benefits: newLandingPage.benefits.filter(b => b !== benefit)
    });
  };
  
  // Create a landing page from funnel stage
  const createFromFunnelStage = (stageId: string) => {
    const stage = funnelStages.find((s: any) => s.id === stageId);
    if (!stage) return;
    
    let template = "simple";
    let ctaText = "Get Started";
    
    // Determine appropriate template based on funnel stage position
    const stageIndex = funnelStages.findIndex((s: any) => s.id === stageId);
    if (stageIndex === 0) {
      // Awareness stage
      template = "simple";
      ctaText = "Learn More";
    } else if (stageIndex === funnelStages.length - 1) {
      // Conversion stage
      template = "product";
      ctaText = "Buy Now";
    } else if (stageIndex === 1) {
      // Interest/consideration stage
      template = "webinar";
      ctaText = "Register Now";
    } else {
      // Middle stages
      template = "ebook";
      ctaText = "Download Now";
    }
    
    setNewLandingPage({
      ...newLandingPage,
      name: `${stage.name} Landing Page`,
      funnelStage: stageId,
      headline: `${stage.name}: Solve Your ${stage.name.toLowerCase()} Challenges`,
      subheadline: stage.description,
      ctaText,
      template
    });
    
    setIsAddingPage(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading landing page data...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Landing Page Designer</h3>
        <div className="space-x-2">
          <Button 
            onClick={() => setIsAddingPage(true)}
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
      
      {/* Funnel Stages Card */}
      {funnelStages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create from Funnel Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {funnelStages.map((stage: any) => (
                <Button
                  key={stage.id}
                  variant="outline"
                  onClick={() => createFromFunnelStage(stage.id)}
                  className="justify-start h-auto py-2"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{stage.name}</span>
                    <span className="text-xs text-muted-foreground">Create landing page</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {isAddingPage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Landing Page</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-name">Landing Page Name</Label>
                    <Input
                      id="page-name"
                      value={newLandingPage.name}
                      onChange={(e) => setNewLandingPage({...newLandingPage, name: e.target.value})}
                      placeholder="Enter landing page name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-url">URL Path (Optional)</Label>
                    <Input
                      id="page-url"
                      value={newLandingPage.url}
                      onChange={(e) => setNewLandingPage({...newLandingPage, url: e.target.value})}
                      placeholder="e.g., /landing/special-offer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-funnel-stage">Funnel Stage</Label>
                    <Select 
                      value={newLandingPage.funnelStage}
                      onValueChange={(value) => setNewLandingPage({...newLandingPage, funnelStage: value})}
                    >
                      <SelectTrigger id="page-funnel-stage">
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
                    <Label htmlFor="page-template">Page Template</Label>
                    <Select 
                      value={newLandingPage.template}
                      onValueChange={(value) => setNewLandingPage({...newLandingPage, template: value})}
                    >
                      <SelectTrigger id="page-template">
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
                
                <div className="space-y-2">
                  <Label htmlFor="page-headline">Headline</Label>
                  <Input
                    id="page-headline"
                    value={newLandingPage.headline}
                    onChange={(e) => setNewLandingPage({...newLandingPage, headline: e.target.value})}
                    placeholder="Enter main headline"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page-subheadline">Subheadline</Label>
                  <Textarea
                    id="page-subheadline"
                    value={newLandingPage.subheadline}
                    onChange={(e) => setNewLandingPage({...newLandingPage, subheadline: e.target.value})}
                    placeholder="Enter supporting text"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    {newLandingPage.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="flex-1">{feature}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(feature)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                    />
                    <Button onClick={handleAddFeature}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    {newLandingPage.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                        <Check className="h-4 w-4 text-blue-500" />
                        <span className="flex-1">{benefit}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit"
                    />
                    <Button onClick={handleAddBenefit}>Add</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-layout">Page Layout</Label>
                    <Select 
                      value={newLandingPage.layout}
                      onValueChange={(value) => setNewLandingPage({...newLandingPage, layout: value})}
                    >
                      <SelectTrigger id="page-layout">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="cta-text">Call to Action Text</Label>
                    <Input
                      id="cta-text"
                      value={newLandingPage.ctaText}
                      onChange={(e) => setNewLandingPage({...newLandingPage, ctaText: e.target.value})}
                      placeholder="e.g., Sign Up Now"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cta-color">CTA Button Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="cta-color"
                        type="color"
                        value={newLandingPage.ctaColor}
                        onChange={(e) => setNewLandingPage({...newLandingPage, ctaColor: e.target.value})}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={newLandingPage.ctaColor}
                        onChange={(e) => setNewLandingPage({...newLandingPage, ctaColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-testimonials">Include Testimonials</Label>
                    <Switch
                      id="include-testimonials"
                      checked={newLandingPage.includeTestimonials}
                      onCheckedChange={(checked) => setNewLandingPage({...newLandingPage, includeTestimonials: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-faq">Include FAQ Section</Label>
                    <Switch
                      id="include-faq"
                      checked={newLandingPage.includeFaq}
                      onCheckedChange={(checked) => setNewLandingPage({...newLandingPage, includeFaq: checked})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="bg-white border rounded-md shadow-sm h-[400px] overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center">
                      <h2 className="text-2xl font-bold text-gray-800">{newLandingPage.headline || "Your Headline Here"}</h2>
                      <p className="mt-2 text-gray-600">{newLandingPage.subheadline || "Your subheadline text goes here"}</p>
                      
                      <div className="mt-6">
                        <div 
                          className="inline-block px-6 py-3 text-white rounded-md font-medium"
                          style={{ backgroundColor: newLandingPage.ctaColor }}
                        >
                          {newLandingPage.ctaText || "Get Started"}
                        </div>
                      </div>
                      
                      {(newLandingPage.features.length > 0 || newLandingPage.benefits.length > 0) && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {newLandingPage.features.length > 0 && (
                            <div className="text-left">
                              <h3 className="font-medium mb-2">Features</h3>
                              <ul className="space-y-2">
                                {newLandingPage.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {newLandingPage.benefits.length > 0 && (
                            <div className="text-left">
                              <h3 className="font-medium mb-2">Benefits</h3>
                              <ul className="space-y-2">
                                {newLandingPage.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-blue-500" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {newLandingPage.includeTestimonials && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-md text-left">
                          <p className="italic">"This is a sample testimonial that would appear on your landing page."</p>
                          <p className="mt-2 font-medium">- Sample Customer</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    Preview is simplified. Actual landing page would include full design based on selected template.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingPage(false)}
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
      
      {landingPages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No landing pages created yet. Design landing pages for your ad campaigns.
            </p>
            <Button 
              onClick={() => setIsAddingPage(true)}
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
          {landingPages.map((page) => (
            <Card key={page.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{page.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePage(page.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="border rounded-md p-3 overflow-hidden bg-slate-50">
                  <div className="bg-white border rounded-md shadow-sm p-4">
                    <h3 className="font-bold text-base">{page.headline}</h3>
                    {page.subheadline && (
                      <p className="text-sm text-muted-foreground mt-1">{page.subheadline}</p>
                    )}
                    <div className="mt-2">
                      <span 
                        className="inline-block px-3 py-1 text-white text-xs rounded"
                        style={{ backgroundColor: page.ctaColor }}
                      >
                        {page.ctaText}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {page.funnelStage && (
                    <div>
                      <span className="font-medium">Funnel Stage:</span>{' '}
                      {funnelStages.find((s: any) => s.id === page.funnelStage)?.name || 'Unknown'}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Template:</span>{' '}
                    {templates.find(t => t.value === page.template)?.label || page.template}
                  </div>
                  <div>
                    <span className="font-medium">Layout:</span>{' '}
                    {layouts.find(l => l.value === page.layout)?.label || page.layout}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Sections:</span>
                    <span className="text-xs">
                      {[
                        ...(page.includeTestimonials ? ['Testimonials'] : []),
                        ...(page.includeFaq ? ['FAQ'] : [])
                      ].join(', ') || 'Standard'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Columns className="h-3 w-3" />
                  <span>
                    {page.features.length} features, {page.benefits.length} benefits
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Card className="bg-slate-50 border border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">Tips for Effective Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Match your landing page to the specific ad creative and funnel stage</li>
            <li>• Keep your headline clear and focused on the primary benefit</li>
            <li>• Use a single, prominent call-to-action that stands out</li>
            <li>• Include social proof like testimonials or reviews</li>
            <li>• Optimize for mobile users to prevent drop-off</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPageDesigner;
