
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const CONTENT_FORMATS = [
  "Blog Posts", "Videos", "Podcasts", "Infographics", "Ebooks", 
  "Case Studies", "Webinars", "Social Media Posts"
];

interface ContentFormatsSelectorProps {
  selectedFormats: string[];
  onChange: (field: string, value: string, isChecked: boolean) => void;
}

const ContentFormatsSelector = ({ selectedFormats, onChange }: ContentFormatsSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Preferred Content Formats</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CONTENT_FORMATS.map((format) => (
          <div key={format} className="flex items-center space-x-2">
            <Checkbox 
              id={`format-${format}`}
              checked={selectedFormats.includes(format)}
              onCheckedChange={(checked) => 
                onChange('contentFormats', format, checked === true)
              }
            />
            <Label htmlFor={`format-${format}`} className="text-sm font-normal cursor-pointer">
              {format}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentFormatsSelector;
