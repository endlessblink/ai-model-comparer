import { ModelCategory, PricingModel } from '@/types/models'

export const categoryNames: Record<ModelCategory, string> = {
  llm: 'מודלי שפה',
  image: 'מודלי תמונה',
  audio: 'מודלי אודיו',
  video: 'מודלי וידאו',
  multimodal: 'מודלים רב-מודליים'
}

export const pricingModels: Record<PricingModel, string> = {
  free: 'חינמי',
  paid: 'בתשלום',
  subscription: 'מנוי',
  usage_based: 'לפי שימוש',
  enterprise: 'ארגוני'
}

export const commonModelTags: Record<ModelCategory, string[]> = {
  llm: ['חינמי', 'קוד פתוח', 'מקומי', 'ענן', 'צ׳אט', 'השלמת טקסט', 'RAG'],
  image: ['יצירת תמונות', 'עריכת תמונות', 'זיהוי אובייקטים', 'סגנון אומנותי'],
  audio: ['TTS', 'STT', 'זיהוי דיבור', 'סינתזה קולית', 'מוזיקה'],
  video: ['יצירת וידאו', 'עריכת וידאו', 'אנימציה', 'סינתזה'],
  multimodal: ['טקסט-לתמונה', 'תמונה-לטקסט', 'וידאו-לטקסט', 'רב-תכליתי']
} 