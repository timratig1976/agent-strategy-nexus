
export interface CustomerJob {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CustomerPain {
  id: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CustomerGain {
  id: string;
  content: string;
  importance: 'low' | 'medium' | 'high';
}

export interface PainReliever {
  id: string;
  content: string;
  relatedPainIds: string[];
}

export interface GainCreator {
  id: string;
  content: string;
  relatedGainIds: string[];
}

export interface ProductService {
  id: string;
  content: string;
  relatedJobIds: string[];
}

export interface UspCanvas {
  customerJobs: CustomerJob[];
  customerPains: CustomerPain[];
  customerGains: CustomerGain[];
  productServices: ProductService[];
  painRelievers: PainReliever[];
  gainCreators: GainCreator[];
}
