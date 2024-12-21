export interface ModelData {
  name: string;
  description: string;
  features: string[];
  pricing: {
    free_tier?: string;
    paid_tier?: string;
    enterprise?: string;
  };
  pros: string[];
  cons: string[];
  useCases: string[];
  alternatives: string[];
  sourceDate: string;
  category?: string;
  api_available?: boolean;
}

export const SECTION_HEADERS = {
  name: 'שם',
  category: 'קטגוריה',
  description: 'תיאור',
  features: 'תכונות עיקריות',
  pricing: 'תמחור',
  free_tier: 'חינמי',
  paid_tier: 'בתשלום',
  enterprise: 'ארגוני',
  pros: 'יתרונות',
  cons: 'חסרונות',
  useCases: 'שימושים נפוצים',
  alternatives: 'חלופות דומות'
} as const;
