
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PainStatement, GainStatement } from "../types";

interface StatementEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statement: PainStatement | GainStatement | null;
  type: 'pain' | 'gain';
  onSave: (id: string, updates: Partial<PainStatement | GainStatement>) => void;
}

const StatementEditDialog: React.FC<StatementEditDialogProps> = ({
  open,
  onOpenChange,
  statement,
  type,
  onSave
}) => {
  const [content, setContent] = useState('');
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>('medium');
  
  useEffect(() => {
    if (statement) {
      setContent(statement.content);
      setImpact(statement.impact);
    }
  }, [statement]);
  
  const handleSave = () => {
    if (statement) {
      onSave(statement.id, { content, impact });
      onOpenChange(false);
    }
  };
  
  const statementLabel = type === 'pain' ? 'Pain Statement' : 'Gain Statement';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit {statementLabel}</DialogTitle>
          <DialogDescription>
            Make changes to your {type} statement. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="statement">Statement Content</Label>
            <Textarea
              id="statement"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label>Impact Level</Label>
            <RadioGroup value={impact} onValueChange={(v) => setImpact(v as 'low' | 'medium' | 'high')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatementEditDialog;
