
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug } from "lucide-react";

/**
 * Global debug settings component
 */
const DebugSettings: React.FC = () => {
  const [isDebugEnabled, setIsDebugEnabled] = useLocalStorage<boolean>(
    'strategy-debug-enabled', 
    false
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Bug className="h-4 w-4" />
          Debug Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="debug-mode"
              checked={isDebugEnabled}
              onCheckedChange={setIsDebugEnabled}
            />
            <Label htmlFor="debug-mode">Enable Debug Mode</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            When enabled, debug information will be collected and displayed for all AI agent interactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugSettings;
