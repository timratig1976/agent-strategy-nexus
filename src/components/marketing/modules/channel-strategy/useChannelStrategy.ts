
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChannelStrategyFormData, ChannelStrategyResult } from "./types";

export const useChannelStrategy = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ChannelStrategyFormData>({
    businessType: "",
    monthlyBudget: "",
    targetAudience: "",
    preferredChannels: [],
    marketingGoals: [],
    budgetFlexibility: 50,
    timeframe: "",
    additionalInfo: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ChannelStrategyResult | null>(null);

  const generateMockStrategy = (budget: number): ChannelStrategyResult => {
    // Helper function to get random percentage with preference for specified channels
    const getChannelPercentages = (preferredChannels: string[] = []) => {
      // Define all potential channels
      const allChannels = [
        { id: "social_media", name: "Social Media" },
        { id: "search_ads", name: "Search Ads" },
        { id: "display_ads", name: "Display Ads" },
        { id: "email", name: "Email Marketing" },
        { id: "content", name: "Content Marketing" },
        { id: "seo", name: "SEO" },
        { id: "video", name: "Video Marketing" },
        { id: "influencer", name: "Influencer Marketing" },
        { id: "pr", name: "PR & Media" },
        { id: "events", name: "Events & Webinars" }
      ];
      
      // Start with base weights
      const weights = allChannels.map(channel => {
        // Give higher weight to preferred channels
        const isPreferred = preferredChannels.includes(channel.id);
        return { 
          ...channel,
          weight: isPreferred ? Math.random() * 10 + 10 : Math.random() * 10
        };
      });
      
      // Normalize to percentage (0-100)
      const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
      return weights.map(item => ({
        id: item.id,
        name: item.name,
        percentage: Math.round((item.weight / totalWeight) * 100),
        budgetAmount: Math.round((item.weight / totalWeight) * budget)
      }));
    };

    // Generate channel allocation based on preferredChannels
    const channelAllocation = getChannelPercentages(formData.preferredChannels);
    
    // Sort channels by percentage (descending)
    channelAllocation.sort((a, b) => b.percentage - a.percentage);
    
    // Take top 5 channels
    const topChannels = channelAllocation.slice(0, 5);

    return {
      overview: `Based on your ${formData.businessType} business type and a monthly budget of $${budget}, we've created a channel strategy focused on ${formData.marketingGoals.join(", ")} with a ${formData.timeframe} timeline.`,
      channelAllocation: topChannels,
      kpiEstimates: [
        { name: "Average CPM", value: `$${Math.round(Math.random() * 20 + 10)}` },
        { name: "Expected CTR", value: `${(Math.random() * 3 + 0.5).toFixed(2)}%` },
        { name: "Estimated Reach", value: `${Math.round(budget / 10)} - ${Math.round(budget / 5)} users` },
        { name: "Est. Cost per Lead", value: `$${Math.round(Math.random() * 50 + 30)}` },
        { name: "Projected ROAS", value: `${(Math.random() * 4 + 2).toFixed(2)}x` }
      ],
      recommendations: topChannels.map(channel => ({
        channel: channel.name,
        advice: getChannelAdvice(channel.name, channel.percentage, budget)
      }))
    };
  };

  const getChannelAdvice = (channelName: string, percentage: number, budget: number) => {
    const recommendations: Record<string, string[]> = {
      "Social Media": [
        `Focus on ${budget > 5000 ? 'Facebook, Instagram, and LinkedIn' : 'Instagram and Facebook'} with ${percentage > 30 ? 'daily' : 'regular'} posts and promoted content.`,
        `Use targeted ads to reach specific audience segments with custom creatives.`,
        `Allocate approximately $${Math.round((budget * percentage) / 100)} per month for paid social campaigns.`
      ],
      "Search Ads": [
        `Focus on ${budget > 8000 ? 'branded and non-branded keywords' : 'high-converting keywords'} with well-optimized landing pages.`,
        `Set up conversion tracking and implement regular A/B testing of ad copy.`,
        `Target a CPC of $${Math.round(Math.random() * 3 + 1)}-${Math.round(Math.random() * 5 + 4)}.`
      ],
      "Display Ads": [
        `Use retargeting campaigns to re-engage website visitors and create lookalike audiences.`,
        `Focus on visual creative optimization and regular ad rotation.`,
        `Test different placements across the Google Display Network and other networks.`
      ],
      "Email Marketing": [
        `Implement regular newsletters and ${percentage > 20 ? 'automated nurture sequences' : 'targeted promotional emails'}.`,
        `Focus on growing your subscriber list through lead magnets and website optimization.`,
        `Segment your audience based on behavior and preferences for better targeting.`
      ],
      "Content Marketing": [
        `Create ${budget > 5000 ? 'comprehensive guides and original research' : 'blog posts and infographics'} to establish thought leadership.`,
        `Implement a consistent publishing schedule of ${percentage > 25 ? 'weekly' : 'bi-weekly'} content.`,
        `Focus on SEO optimization and distribution through social and email channels.`
      ],
      "SEO": [
        `Prioritize technical SEO improvements and regular content updates.`,
        `Focus on ${percentage > 20 ? 'both on-page and off-page SEO' : 'primarily on-page optimization'}.`,
        `Target long-tail keywords related to your products/services for better conversion rates.`
      ],
      "Video Marketing": [
        `Create ${budget > 10000 ? 'professional video content' : 'authentic brand videos'} for YouTube and social media.`,
        `Focus on educational content and product demonstrations.`,
        `Implement video SEO best practices and cross-promote across channels.`
      ],
      "Influencer Marketing": [
        `Partner with ${budget > 15000 ? 'macro and micro influencers' : 'micro influencers'} in your niche.`,
        `Focus on authentic partnerships with clear deliverables and metrics.`,
        `Allocate budget for both product/service provision and influencer fees.`
      ],
      "PR & Media": [
        `Focus on industry publications and local media outlets.`,
        `Develop ${percentage > 15 ? 'a comprehensive PR strategy' : 'targeted PR initiatives'} with newsworthy angles.`,
        `Consider hiring a PR specialist or agency for best results.`
      ],
      "Events & Webinars": [
        `Host ${budget > 10000 ? 'regular webinars and in-person events' : 'quarterly webinars'} to engage your audience.`,
        `Focus on educational content and networking opportunities.`,
        `Leverage events for lead generation and relationship building.`
      ]
    };

    const channelAdvice = recommendations[channelName];
    if (channelAdvice) {
      return channelAdvice.join(' ');
    }

    return `Optimize your ${channelName} strategy based on your specific audience needs and goals.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate the budget
      const budget = parseFloat(formData.monthlyBudget);
      if (isNaN(budget) || budget <= 0) {
        throw new Error("Please enter a valid monthly budget");
      }
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate mock strategy results
      const strategyResults = generateMockStrategy(budget);
      setResults(strategyResults);
      
      toast({
        title: "Strategy generated",
        description: "Your channel and budget strategy has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Strategy generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    results,
    handleSubmit,
  };
};
