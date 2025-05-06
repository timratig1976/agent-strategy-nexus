export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_creatives: {
        Row: {
          body: string | null
          campaign_id: string | null
          created_at: string
          cta: string | null
          headline: string | null
          id: string
          image_url: string | null
          platform: string
          project_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          body?: string | null
          campaign_id?: string | null
          created_at?: string
          cta?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          platform: string
          project_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          body?: string | null
          campaign_id?: string | null
          created_at?: string
          cta?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          platform?: string
          project_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_creatives_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_creatives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_data_sources: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          source_data: Json | null
          source_type: string
          source_url: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          source_data?: Json | null
          source_type: string
          source_url?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          source_data?: Json | null
          source_type?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_data_sources_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_prompts: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          system_prompt: string | null
          updated_at: string
          user_prompt: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          system_prompt?: string | null
          updated_at?: string
          user_prompt?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          system_prompt?: string | null
          updated_at?: string
          user_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_results: {
        Row: {
          agent_id: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          strategy_id: string | null
        }
        Insert: {
          agent_id?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          strategy_id?: string | null
        }
        Update: {
          agent_id?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          strategy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_results_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_results_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          strategy_id: string | null
          type: Database["public"]["Enums"]["agent_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          strategy_id?: string | null
          type: Database["public"]["Enums"]["agent_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          strategy_id?: string | null
          type?: Database["public"]["Enums"]["agent_type"]
        }
        Relationships: [
          {
            foreignKeyName: "agents_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_ideas: {
        Row: {
          created_at: string
          cta: string | null
          framework: string | null
          hook: string | null
          id: string
          is_selected: boolean | null
          persona_id: string | null
          project_id: string
          storyline: string | null
          updated_at: string
          usp_id: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          cta?: string | null
          framework?: string | null
          hook?: string | null
          id?: string
          is_selected?: boolean | null
          persona_id?: string | null
          project_id: string
          storyline?: string | null
          updated_at?: string
          usp_id?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          cta?: string | null
          framework?: string | null
          hook?: string | null
          id?: string
          is_selected?: boolean | null
          persona_id?: string | null
          project_id?: string
          storyline?: string | null
          updated_at?: string
          usp_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_ideas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_ideas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_ideas_usp_id_fkey"
            columns: ["usp_id"]
            isOneToOne: false
            referencedRelation: "usps"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_strategies: {
        Row: {
          channels: Json | null
          created_at: string
          id: string
          project_id: string
          total_budget: number | null
          updated_at: string
          version: number | null
        }
        Insert: {
          channels?: Json | null
          created_at?: string
          id?: string
          project_id: string
          total_budget?: number | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          channels?: Json | null
          created_at?: string
          id?: string
          project_id?: string
          total_budget?: number | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_strategies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          cluster_content: Json | null
          created_at: string
          id: string
          main_topic: string
          persona_id: string | null
          pillar_content: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          cluster_content?: Json | null
          created_at?: string
          id?: string
          main_topic: string
          persona_id?: string | null
          pillar_content?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          cluster_content?: Json | null
          created_at?: string
          id?: string
          main_topic?: string
          persona_id?: string | null
          pillar_content?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pillars_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_pillars_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          contact_id: string | null
          created_at: string
          currency: string | null
          expected_close_date: string | null
          id: string
          name: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          contact_id: string | null
          created_at: string
          date: string
          description: string
          id: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_magnets: {
        Row: {
          created_at: string
          description: string | null
          funnel_stage: Database["public"]["Enums"]["funnel_stage"] | null
          id: string
          is_selected: boolean | null
          magnet_type: string | null
          persona_id: string | null
          project_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_selected?: boolean | null
          magnet_type?: string | null
          persona_id?: string | null
          project_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_selected?: boolean | null
          magnet_type?: string | null
          persona_id?: string | null
          project_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_magnets_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_magnets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          behaviors: string | null
          created_at: string
          demographic: string | null
          gains: Json | null
          id: string
          industry: string | null
          is_active: boolean | null
          name: string
          pain_points: Json | null
          project_id: string
          triggers: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          behaviors?: string | null
          created_at?: string
          demographic?: string | null
          gains?: Json | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name: string
          pain_points?: Json | null
          project_id: string
          triggers?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          behaviors?: string | null
          created_at?: string
          demographic?: string | null
          gains?: Json | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name?: string
          pain_points?: Json | null
          project_id?: string
          triggers?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_name: string
          created_at: string
          current_module: Database["public"]["Enums"]["module_type"] | null
          description: string | null
          goals: string | null
          id: string
          is_completed: boolean | null
          name: string
          product_details: string | null
          status: string | null
          target_audience: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          current_module?: Database["public"]["Enums"]["module_type"] | null
          description?: string | null
          goals?: string | null
          id?: string
          is_completed?: boolean | null
          name: string
          product_details?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          current_module?: Database["public"]["Enums"]["module_type"] | null
          description?: string | null
          goals?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string
          product_details?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      roas_calculations: {
        Row: {
          breakeven_forecast: Json | null
          cac: number | null
          cost_targets: Json | null
          created_at: string
          ctr: number | null
          cvr: number | null
          deal_size: number | null
          id: string
          project_id: string
          roas: number | null
          updated_at: string
        }
        Insert: {
          breakeven_forecast?: Json | null
          cac?: number | null
          cost_targets?: Json | null
          created_at?: string
          ctr?: number | null
          cvr?: number | null
          deal_size?: number | null
          id?: string
          project_id: string
          roas?: number | null
          updated_at?: string
        }
        Update: {
          breakeven_forecast?: Json | null
          cac?: number | null
          cost_targets?: Json | null
          created_at?: string
          ctr?: number | null
          cvr?: number | null
          deal_size?: number | null
          id?: string
          project_id?: string
          roas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roas_calculations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          state: Database["public"]["Enums"]["strategy_state"]
          status: Database["public"]["Enums"]["strategy_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          state?: Database["public"]["Enums"]["strategy_state"]
          status?: Database["public"]["Enums"]["strategy_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          state?: Database["public"]["Enums"]["strategy_state"]
          status?: Database["public"]["Enums"]["strategy_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      strategy_contacts: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          strategy_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          strategy_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          strategy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategy_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_contacts_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          state: Database["public"]["Enums"]["strategy_state"]
          strategy_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          state: Database["public"]["Enums"]["strategy_state"]
          strategy_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          state?: Database["public"]["Enums"]["strategy_state"]
          strategy_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_tasks_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      usp_canvas: {
        Row: {
          created_at: string
          customer_jobs: Json | null
          differentiators: Json | null
          gains: Json | null
          id: string
          pain_points: Json | null
          project_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          customer_jobs?: Json | null
          differentiators?: Json | null
          gains?: Json | null
          id?: string
          pain_points?: Json | null
          project_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          customer_jobs?: Json | null
          differentiators?: Json | null
          gains?: Json | null
          id?: string
          pain_points?: Json | null
          project_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usp_canvas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      usps: {
        Row: {
          canvas_id: string | null
          created_at: string
          id: string
          is_selected: boolean | null
          project_id: string
          statement: string
          updated_at: string
          version: number | null
        }
        Insert: {
          canvas_id?: string | null
          created_at?: string
          id?: string
          is_selected?: boolean | null
          project_id: string
          statement: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          canvas_id?: string | null
          created_at?: string
          id?: string
          is_selected?: boolean | null
          project_id?: string
          statement?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usps_canvas_id_fkey"
            columns: ["canvas_id"]
            isOneToOne: false
            referencedRelation: "usp_canvas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      website_crawls: {
        Row: {
          created_at: string
          extracted_content: Json
          id: string
          project_id: string
          status: string | null
          url: string
        }
        Insert: {
          created_at?: string
          extracted_content: Json
          id?: string
          project_id: string
          status?: string | null
          url: string
        }
        Update: {
          created_at?: string
          extracted_content?: Json
          id?: string
          project_id?: string
          status?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_crawls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_type:
        | "audience"
        | "content"
        | "seo"
        | "social"
        | "email"
        | "analytics"
      funnel_stage: "awareness" | "consideration" | "decision"
      module_type:
        | "briefing"
        | "website_analysis"
        | "persona"
        | "usp_canvas"
        | "usp_generator"
        | "channel_strategy"
        | "roas_calculator"
        | "campaign_ideas"
        | "ad_creative"
        | "lead_magnets"
        | "content_strategy"
      strategy_state: "briefing" | "persona" | "pain_gains" | "funnel" | "ads"
      strategy_status: "draft" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: [
        "audience",
        "content",
        "seo",
        "social",
        "email",
        "analytics",
      ],
      funnel_stage: ["awareness", "consideration", "decision"],
      module_type: [
        "briefing",
        "website_analysis",
        "persona",
        "usp_canvas",
        "usp_generator",
        "channel_strategy",
        "roas_calculator",
        "campaign_ideas",
        "ad_creative",
        "lead_magnets",
        "content_strategy",
      ],
      strategy_state: ["briefing", "persona", "pain_gains", "funnel", "ads"],
      strategy_status: ["draft", "in_progress", "completed"],
    },
  },
} as const
