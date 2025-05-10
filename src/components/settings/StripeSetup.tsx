
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function StripeSetup() {
  const [isConfiguring, setIsConfiguring] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Integration</CardTitle>
        <CardDescription>
          Configure Stripe to accept payments and manage subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Stripe Configuration Required</AlertTitle>
          <AlertDescription>
            To enable subscriptions and payments, you need to configure your Stripe API keys in the Supabase dashboard.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm">
            You need to add the following secrets to your Supabase Edge Functions:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>STRIPE_SECRET_KEY - Your Stripe secret key</li>
            <li>STRIPE_WEBHOOK_SECRET - Your Stripe webhook signing secret</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-2">
          <p className="text-sm">Follow these steps to configure Stripe:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Create a Stripe account if you don't have one</li>
            <li>Get your API keys from the Stripe Dashboard</li>
            <li>Set up a webhook endpoint for <code>https://[YOUR-PROJECT-REF].supabase.co/functions/v1/stripe-webhook</code></li>
            <li>Add the secrets to your Supabase project</li>
          </ol>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={() => setIsConfiguring(true)}
            variant="outline"
          >
            Configure Stripe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
