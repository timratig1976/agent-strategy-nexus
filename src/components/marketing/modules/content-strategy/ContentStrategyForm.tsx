
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { ContentPillarFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface ContentStrategyFormProps {
  formData: ContentPillarFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentPillarFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const formSchema = z.object({
  businessNiche: z.string().min(2, "Business niche is required"),
  targetAudience: z.string().min(2, "Target audience is required"),
  brandVoice: z.array(z.string()).min(1, "Select at least one brand voice"),
  marketingGoals: z.array(z.string()).min(1, "Select at least one marketing goal"),
  existingContent: z.string().optional(),
  competitorInsights: z.string().optional(),
  keyTopics: z.array(z.string()).min(1, "Add at least one key topic"),
  contentFormats: z.array(z.string()).min(1, "Select at least one content format"),
  distributionChannels: z.array(z.string()).min(1, "Select at least one distribution channel")
});

const ContentStrategyForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: ContentStrategyFormProps) => {
  const form = useForm<ContentPillarFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData
  });

  const onSubmit = (values: ContentPillarFormData) => {
    setFormData(values);
    onGenerate();
  };

  const brandVoiceOptions = [
    { id: "professional", label: "Professional" },
    { id: "casual", label: "Casual" },
    { id: "authoritative", label: "Authoritative" },
    { id: "friendly", label: "Friendly" },
    { id: "inspirational", label: "Inspirational" },
    { id: "educational", label: "Educational" },
    { id: "humorous", label: "Humorous" }
  ];

  const marketingGoalOptions = [
    { id: "awareness", label: "Brand Awareness" },
    { id: "engagement", label: "Audience Engagement" },
    { id: "conversion", label: "Conversions" },
    { id: "retention", label: "Customer Retention" },
    { id: "authority", label: "Thought Leadership" },
    { id: "seo", label: "SEO Performance" }
  ];

  const contentFormatOptions = [
    { id: "blog", label: "Blog Posts" },
    { id: "video", label: "Videos" },
    { id: "podcast", label: "Podcasts" },
    { id: "ebook", label: "Ebooks/Guides" },
    { id: "infographic", label: "Infographics" },
    { id: "webinar", label: "Webinars" },
    { id: "social", label: "Social Media Posts" },
    { id: "email", label: "Email Newsletters" }
  ];

  const distributionChannelOptions = [
    { id: "website", label: "Website/Blog" },
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "twitter", label: "Twitter" },
    { id: "youtube", label: "YouTube" },
    { id: "tiktok", label: "TikTok" },
    { id: "email", label: "Email" },
    { id: "podcast", label: "Podcast Platforms" }
  ];

  const [topicInput, setTopicInput] = React.useState("");
  
  const addTopic = () => {
    if (topicInput.trim() && !form.getValues().keyTopics.includes(topicInput.trim())) {
      const updatedTopics = [...form.getValues().keyTopics, topicInput.trim()];
      form.setValue("keyTopics", updatedTopics);
      setTopicInput("");
    }
  };
  
  const removeTopic = (topic: string) => {
    const updatedTopics = form.getValues().keyTopics.filter(t => t !== topic);
    form.setValue("keyTopics", updatedTopics);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="businessNiche"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Niche</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fitness Technology" {...field} />
                </FormControl>
                <FormDescription>
                  Your industry or business specialty
                </FormDescription>
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
                  <Input placeholder="e.g. Fitness enthusiasts aged 25-45" {...field} />
                </FormControl>
                <FormDescription>
                  Who your content should speak to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Brand Voice & Goals</h3>
            <p className="text-sm text-muted-foreground">
              Define how your content should sound and what it should achieve
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="brandVoice"
              render={() => (
                <FormItem>
                  <FormLabel>Brand Voice</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {brandVoiceOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="brandVoice"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingGoals"
              render={() => (
                <FormItem>
                  <FormLabel>Marketing Goals</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {marketingGoalOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="marketingGoals"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Content Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Provide insights about existing content and competitor analysis
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="existingContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Existing Content Overview</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Summarize your current content assets and performance..."
                      className="h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Helps refine strategy recommendations
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="competitorInsights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor Content Insights</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are competitors doing well with their content?"
                      className="h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Helps identify gaps and opportunities
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Content Planning</h3>
            <p className="text-sm text-muted-foreground">
              Define your key topics and how you'll deliver content
            </p>
          </div>

          <FormField
            control={form.control}
            name="keyTopics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Topics</FormLabel>
                <div className="grid gap-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter a content topic"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTopic();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTopic}>
                      Add Topic
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((topic, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        <span>{topic}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0" 
                          onClick={() => removeTopic(topic)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contentFormats"
              render={() => (
                <FormItem>
                  <FormLabel>Content Formats</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {contentFormatOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="contentFormats"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distributionChannels"
              render={() => (
                <FormItem>
                  <FormLabel>Distribution Channels</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {distributionChannelOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="distributionChannels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isGenerating}>
          {isGenerating ? "Generating Strategy..." : "Generate Content Pillar Strategy"}
        </Button>
      </form>
    </Form>
  );
};

export default ContentStrategyForm;
