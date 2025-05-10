import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

// This function handles Stripe webhooks to keep subscription data in sync
serve(async (req) => {
  try {
    const stripeSignature = req.headers.get("stripe-signature");
    
    if (!stripeSignature) {
      return new Response("Webhook signature missing", { status: 400 });
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Process different webhook events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        if (session.mode === "subscription" && session.subscription) {
          const organizationId = session.metadata?.organization_id;
          if (!organizationId) {
            throw new Error("Organization ID not found in session metadata");
          }
          
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Determine tier from price
          const priceId = subscription.items.data[0].price.id;
          const { data: tier } = await supabase
            .from("subscription_tiers")
            .select("id")
            .eq("stripe_price_id", priceId)
            .single();
          
          if (!tier) {
            throw new Error(`No subscription tier found for price ID: ${priceId}`);
          }
          
          // Update subscription record
          await supabase
            .from("subscriptions")
            .update({
              tier_id: tier.id,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq("organization_id", organizationId);
          
          // Record payment
          await supabase
            .from("payment_history")
            .insert({
              organization_id: organizationId,
              subscription_id: (await supabase
                .from("subscriptions")
                .select("id")
                .eq("organization_id", organizationId)
                .single()).data?.id,
              stripe_invoice_id: session.invoice as string,
              amount_cents: subscription.items.data[0].price.unit_amount,
              status: "paid",
              payment_date: new Date().toISOString()
            });
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const organizationId = subscription.metadata?.organization_id;
        
        if (!organizationId) {
          // Try to find by customer ID
          const { data: subData } = await supabase
            .from("subscriptions")
            .select("organization_id")
            .eq("stripe_customer_id", subscription.customer)
            .single();
          
          if (!subData) {
            throw new Error(`No subscription found for customer: ${subscription.customer}`);
          }
        }
        
        // Update subscription record
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        
        // Set subscription to canceled
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
          
        // Downgrade to free tier
        const { data: freeTier } = await supabase
          .from("subscription_tiers")
          .select("id")
          .eq("name", "Free")
          .single();
        
        if (freeTier) {
          await supabase
            .from("subscriptions")
            .update({
              tier_id: freeTier.id,
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          // Get organization from subscription
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("id, organization_id")
            .eq("stripe_subscription_id", invoice.subscription)
            .single();
          
          if (subscription) {
            // Record payment
            await supabase
              .from("payment_history")
              .insert({
                organization_id: subscription.organization_id,
                subscription_id: subscription.id,
                stripe_invoice_id: invoice.id,
                amount_cents: invoice.amount_paid,
                status: "paid",
                payment_date: new Date().toISOString()
              });
          }
        }
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
