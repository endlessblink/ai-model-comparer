export type ModelCategory = 'llm' | 'image' | 'video' | 'music' | 'narration' | 'lipsync'
export type PricingModel = 'free' | 'freemium' | 'paid' | 'enterprise'
export type PricingType = 'free' | 'one-time' | 'subscription' | 'usage-based'

export interface AIModel {
  id: string
  name: string
  description: string
  category: ModelCategory
  url?: string
  icon?: string
  features: string[]
  pros: string[]
  cons: string[]
  tags: string[]
  pricing_model: PricingModel
  pricing_type: PricingType
  api_available: boolean
  useCases?: string[]
  pricing?: {
    free_tier?: string
    paid_tier?: string
    enterprise?: string
  }
}

export const categoryNames: Record<ModelCategory, string> = {
  llm: 'מודל שפה',
  image: 'יצירת תמונות',
  video: 'יצירת וידאו',
  music: 'יצירת מוזיקה',
  narration: 'הקראה',
  lipsync: 'סנכרון שפתיים',
}

export const pricingModels: Record<PricingModel, string> = {
  free: 'חינמי',
  freemium: 'חינמי עם הגבלות',
  paid: 'בתשלום',
  enterprise: 'ארגוני',
}

export const pricingTypes: Record<PricingType, string> = {
  free: 'חינמי',
  'one-time': 'תשלום חד פעמי',
  subscription: 'מנוי',
  'usage-based': 'לפי שימוש',
}

export const commonModelTags: Record<ModelCategory, string[]> = {
  llm: [
    'שיחה',
    'כתיבה',
    'תכנות',
    'תרגום',
    'ניתוח טקסט',
    'סיכום',
    'שאלות ותשובות',
    'מחקר',
  ],
  image: [
    'איור',
    'עיצוב',
    'עריכת תמונות',
    'סגנונות אמנותיים',
    'פורטרטים',
    'נופים',
    'מציאותי',
    'מופשט',
  ],
  video: [
    'אנימציה',
    'עריכת וידאו',
    'אפקטים מיוחדים',
    'סרטונים קצרים',
    'סרטי תדמית',
    'הדרכה',
    'פרסום',
  ],
  music: [
    'הלחנה',
    'עיבוד',
    'מיקס',
    'מאסטרינג',
    'כלי נגינה',
    'קול',
    'אפקטים',
  ],
  narration: [
    'קריינות',
    'דיבוב',
    'הקראת טקסט',
    'פודקאסטים',
    'ספרים מוקלטים',
    'פרסומות',
  ],
  lipsync: [
    'סנכרון דיבור',
    'דיבוב',
    'תרגום וידאו',
    'אנימציה',
    'פרסומות',
    'סרטונים',
  ],
}

export async function getModels(category?: ModelCategory, filters?: {
  tags?: string[],
  pricingModel?: AIModel['pricing_model'],
  pricingType?: AIModel['pricing_type'],
  apiAvailable?: boolean
}): Promise<AIModel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return Promise.resolve([])
}

export async function addModel(model: AIModel) {
  // Mock implementation
  console.log('Adding model:', model)
  return Promise.resolve()
}

export async function updateModel(model: AIModel) {
  // Mock implementation
  console.log('Updating model:', model)
  return Promise.resolve()
}

export async function deleteModel(id: string) {
  // Mock implementation
  console.log('Deleting model:', id)
  return Promise.resolve()
}
