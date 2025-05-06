
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DISTRIBUTION_CHANNELS = [
  "Website/Blog", "Email Newsletter", "LinkedIn", "Twitter", 
  "Facebook", "Instagram", "YouTube", "TikTok", "Industry Publications"
];

interface DistributionChannelsSelectorProps {
  selectedChannels: string[];
  onChange: (field: string, value: string, isChecked: boolean) => void;
}

const DistributionChannelsSelector = ({ selectedChannels, onChange }: DistributionChannelsSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Distribution Channels</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {DISTRIBUTION_CHANNELS.map((channel) => (
          <div key={channel} className="flex items-center space-x-2">
            <Checkbox 
              id={`channel-${channel}`}
              checked={selectedChannels.includes(channel)}
              onCheckedChange={(checked) => 
                onChange('distributionChannels', channel, checked === true)
              }
            />
            <Label htmlFor={`channel-${channel}`} className="text-sm font-normal cursor-pointer">
              {channel}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionChannelsSelector;
