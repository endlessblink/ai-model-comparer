export interface ModelData {
  name: string;
  description: string;
  category: string;
  features: string;
  pros: string;
  cons: string;
  tags: string[];
  pricing_model: 'free' | 'freemium' | 'paid' | 'enterprise';
  pricing_type: 'one-time' | 'subscription' | 'usage-based';
  api_available: boolean;
}

export const SECTION_HEADERS = {
  name: 'שם',
  category: 'קטגוריה',
  description: 'תיאור',
  features: 'תכונות עיקריות',
  pros: 'יתרונות',
  cons: 'חסרונות',
  tags: 'תגיות',
  pricing_model: 'מודל תמחור',
  pricing_type: 'סוג תמחור',
  api_available: 'API זמין'
} as const;
