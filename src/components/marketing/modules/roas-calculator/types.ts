
export interface RoasFormData {
  adSpend: number | '';
  clicks: number | '';
  ctr: number | '';
  conversionRate: number | '';
  averageOrderValue: number | '';
  profitMargin: number | '';
  targetRoas: number | '';
}

export interface RoasResults {
  adSpend: number;
  clicks: number;
  ctr: number;
  conversionRate: number;
  averageOrderValue: number;
  profitMargin: number;
  targetRoas?: number;
  conversions: number;
  revenue: number;
  roas: number;
  cpc: number;
  cpa: number;
  profit: number;
  impressions?: number;
}
