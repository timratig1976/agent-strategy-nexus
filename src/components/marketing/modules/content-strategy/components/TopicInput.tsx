
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface TopicInputProps {
  topics: string[];
  onAddTopic: (topic: string) => void;
  onRemoveTopic: (topic: string) => void;
}

const TopicInput = ({ topics, onAddTopic, onRemoveTopic }: TopicInputProps) => {
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      onAddTopic(newTopic.trim());
      setNewTopic("");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Key Topics for Content Pillars *</Label>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add a topic for a content pillar"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <Button 
          type="button"
          size="sm"
          onClick={handleAddTopic}
          disabled={!newTopic.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {topics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <div 
              key={topic} 
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {topic}
              <button 
                type="button" 
                onClick={() => onRemoveTopic(topic)}
                className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {topics.length === 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Add at least one topic to generate content pillars
        </p>
      )}
    </div>
  );
};

export default TopicInput;
