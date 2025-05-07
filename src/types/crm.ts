export interface Contact {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  contact_id: string;
  type: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  contact_id?: string;
  name: string;
  amount?: number;
  currency?: string;
  status: string;
  expected_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const CONTACT_STATUSES = ['lead', 'prospect', 'customer', 'churned'];
export const INTERACTION_TYPES = ['email', 'call', 'meeting', 'note'];
export const DEAL_STATUSES = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
