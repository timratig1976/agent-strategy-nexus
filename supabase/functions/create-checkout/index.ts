
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the user's JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Parse the request body
    const body = await req.json();
    const { organizationId, priceId } = body;

    if (!organizationId || !priceId) {
      throw new Error("Organization ID and Price ID are required");
    }

    // Check if the user is an admin or owner of the organization
    const { data: membership, error: membershipError } = await supabaseClient
      .from("org_memberships")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .single();

    if (membershipError || !membership) {
      throw new Error("User is not a member of this organization");
    }

    if (!["owner", "admin"].includes(membership.role)) {
      throw new Error("User does not have permission to modify subscriptions");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get organization info
    const { data: org, error: orgError } = await supabaseClient
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      throw new Error("Organization not found");
    }

    // Get subscription info
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", organizationId)
      .single();

    // Create or retrieve customer
    let customerId = subscription?.stripe_customer_id;
    
    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        name: org.name,
        email: user.email,
        metadata: {
          organization_id: organizationId,
        },
      });
      
      customerId = customer.id;
      
      // Update the subscription record with the customer ID
      await supabaseClient
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("organization_id", organizationId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/settings?tab=billing&success=true`,
      cancel_url: `${req.headers.get("origin")}/settings?tab=billing&canceled=true`,
      subscription_data: {
        metadata: {
          organization_id: organizationId,
        },
      },
      metadata: {
        organization_id: organizationId,
      },
    });

    // Return the checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
