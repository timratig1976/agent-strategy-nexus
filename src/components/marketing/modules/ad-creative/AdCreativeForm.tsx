import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { AdCreativeFormData } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const adPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "google_ads", label: "Google Ads" }
];

const adTypes = [
  { value: "image", label: "Image Ad" },
  { value: "text", label: "Text Ad" },
  { value: "carousel", label: "Carousel" },
  { value: "video", label: "Video" }
];

const formSchema = z.object({
  platform: z.string().min(1, { message: "Please select an ad platform" }),
  adType: z.string().min(1, { message: "Please select an ad type" }),
  productName: z.string().min(1, { message: "Please enter your product name" }),
  targetAudience: z.string().min(1, { message: "Please describe your target audience" }),
  productDescription: z.string().min(10, { message: "Please provide a product description" }),
  uniqueSellingPoints: z.string().min(1, { message: "Please enter key selling points" }),
  callToAction: z.string().min(1, { message: "Please enter a call to action" }),
  tone: z.string().min(1, { message: "Please select a tone" }),
  generateImage: z.boolean().optional(),
  imageDescription: z.string().optional(),
});

interface AdCreativeFormProps {
  formData: AdCreativeFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdCreativeFormData>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

const AdCreativeForm = ({
  formData,
  setFormData,
  isLoading,
  onSubmit,
  error,
}: AdCreativeFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: formData.platform,
      adType: formData.adType,
      productName: formData.productName,
      targetAudience: formData.targetAudience,
      productDescription: formData.productDescription,
      uniqueSellingPoints: formData.uniqueSellingPoints,
      callToAction: formData.callToAction,
      tone: formData.tone || "professional",
      generateImage: formData.generateImage || false,
      imageDescription: formData.imageDescription || "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Include the generated image URL in form data if available
    const updatedFormData: AdCreativeFormData = {
      platform: values.platform,
      adType: values.adType,
      productName: values.productName,
      targetAudience: values.targetAudience,
      productDescription: values.productDescription,
      uniqueSellingPoints: values.uniqueSellingPoints,
      callToAction: values.callToAction,
      tone: values.tone,
      generateImage: values.generateImage,
      imageDescription: values.imageDescription,
      imageUrl: generatedImage || formData.imageUrl
    };
    
    setFormData(updatedFormData);
    onSubmit(new Event('submit') as unknown as React.FormEvent);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const generateAdImage = async (description: string, platform: string) => {
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ad-image', {
        body: { prompt: description, platform },
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (data?.image_url) {
        setGeneratedImage(data.image_url);
        
        toast({
          title: "Image generated",
          description: "Ad image has been successfully created.",
        });
      } else {
        throw new Error("No image was generated");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const watchGenerateImage = form.watch("generateImage");
  const watchSelectedPlatform = form.watch("platform");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ad Creative</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 mx-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="creative">Creative Elements</TabsTrigger>
            </TabsList>
            
            <CardContent>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Platform</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adPlatforms.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="adType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ad type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your product or service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience (age, interests, pain points, etc.)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of your product or service"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleTabChange("creative")}
                >
                  Next: Creative Elements
                </Button>
              </TabsContent>

              <TabsContent value="creative" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="uniqueSellingPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Selling Points (USPs)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What makes your product/service unique? List key benefits, separated by commas"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter key selling points separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="callToAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call to Action</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Shop Now, Learn More, Sign Up Today" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Tone</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="urgent">Urgent/Compelling</SelectItem>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="luxurious">Luxurious/Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generateImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Generate AI Image</FormLabel>
                        <FormDescription>
                          Use AI to generate an image for your ad
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {watchGenerateImage && (
                  <>
                    <FormField
                      control={form.control}
                      name="imageDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the image you want to generate"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about what you want in the image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col items-center p-4 border border-dashed rounded-md bg-muted/50">
                      {generatedImage ? (
                        <div className="space-y-2 w-full">
                          <img 
                            src={generatedImage} 
                            alt="Generated ad" 
                            className="w-full h-auto max-h-64 object-contain rounded-md"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              const imageDesc = form.getValues().imageDescription;
                              const platform = form.getValues().platform;
                              if (imageDesc) {
                                generateAdImage(imageDesc, platform);
                              }
                            }}
                          >
                            Regenerate Image
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          {isGeneratingImage ? (
                            <div className="flex flex-col items-center space-y-2">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">Generating image...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {form.getValues().imageDescription ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const imageDesc = form.getValues().imageDescription;
                                      const platform = form.getValues().platform;
                                      if (imageDesc) {
                                        generateAdImage(imageDesc, platform);
                                      }
                                    }}
                                  >
                                    Generate Image Now
                                  </Button>
                                ) : (
                                  "Describe your image to generate"
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="flex justify-between space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("basic")}
                  >
                    Previous
                  </Button>
                  <Button type="submit" disabled={isLoading || isGeneratingImage}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ad...
                      </>
                    ) : (
                      "Generate Ad Creative"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className={activeTab === "creative" ? "hidden" : "block"}>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || activeTab !== "basic"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Ad...
                </>
              ) : (
                "Generate Ad Creative"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AdCreativeForm;
