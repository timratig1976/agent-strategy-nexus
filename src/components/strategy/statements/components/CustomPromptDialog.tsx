
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface CustomPromptDialogProps {
  defaultPrompt?: string;
  onSavePrompt: (prompt: string) => void;
}

const CustomPromptDialog: React.FC<CustomPromptDialogProps> = ({
  defaultPrompt = '',
  onSavePrompt
}) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);

  const handleSave = () => {
    onSavePrompt(prompt);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={16} />
          Customize Generation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Customize AI Generation</DialogTitle>
          <DialogDescription>
            Provide specific instructions to guide the AI when generating statements.
            This will help make the statements more relevant to your specific needs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Custom Instructions</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Focus on emotional pain points related to time management. Make statements more concise and impactful."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Instructions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPromptDialog;
