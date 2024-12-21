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
    'אווטארים',
    'שידור חי',
  ],
}

export const defaultModels: AIModel[] = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'מודל שפה מתקדם מבית Anthropic, המתמחה בשיחות ארוכות ומורכבות.',
    category: 'llm',
    url: 'https://www.anthropic.com/claude',
    icon: '/icons/claude.svg',
    features: [
      'זיכרון שיחה ארוך',
      'הבנת הקשר מדויקת',
      'יכולות אנליטיות',
      'כתיבה מקצועית',
    ],
    pros: [
      'זיכרון שיחה ארוך במיוחד',
      'יכולות אנליטיות מתקדמות',
      'תמיכה בעברית',
      'מענה מדויק ומפורט',
    ],
    cons: [
      'מהירות עיבוד איטית יחסית',
      'מחיר גבוה יחסית',
      'זמינות מוגבלת',
      'לא תמיד עקבי בתשובות',
    ],
    tags: ['שיחה', 'ניתוח טקסט', 'מחקר', 'תכנות'],
    pricing_model: 'freemium',
    pricing_type: 'usage-based',
    api_available: true,
    pricing: {
      free_tier: '500K טוקנים בחינם',
      paid_tier: '$8 ל-1M טוקנים',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'מודל השפה המתקדם ביותר של OpenAI, בעל יכולות הבנה וייצור טקסט מתקדמות.',
    category: 'llm',
    url: 'https://openai.com/gpt-4',
    icon: '/icons/chatgpt.svg',
    features: [
      'הבנת הקשר מתקדמת',
      'יכולות תכנות',
      'כתיבה יצירתית',
      'ניתוח טקסט מעמיק',
    ],
    pros: [
      'יכולות שפה מתקדמות',
      'אינטגרציה קלה',
      'תמיכה נרחבת',
      'עדכונים תכופים',
    ],
    cons: [
      'מחיר גבוה',
      'הגבלות על מספר בקשות',
      'לעתים מייצר מידע שגוי',
      'תלות בחיבור לאינטרנט',
    ],
    tags: ['שיחה', 'כתיבה', 'תכנות', 'מחקר'],
    pricing_model: 'paid',
    pricing_type: 'usage-based',
    api_available: true,
    pricing: {
      paid_tier: '$0.03 ל-1K טוקנים',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'כלי ליצירת אמנות דיגיטלית באיכות גבוהה באמצעות תיאור טקסטואלי.',
    category: 'image',
    url: 'https://www.midjourney.com',
    icon: '/icons/midjourney.svg',
    features: [
      'איכות תמונה גבוהה',
      'סגנונות אמנותיים מגוונים',
      'שליטה מדויקת',
      'עיבוד מהיר',
    ],
    pros: [
      'איכות תמונה מעולה',
      'מגוון סגנונות אמנותיים',
      'קהילה פעילה',
      'ממשק ידידותי',
    ],
    cons: [
      'מחיר גבוה יחסית',
      'זמן עיבוד ארוך',
      'אין API רשמי',
      'מוגבל לדיסקורד',
    ],
    tags: ['איור', 'עיצוב', 'סגנונות אמנותיים', 'מציאותי'],
    pricing_model: 'paid',
    pricing_type: 'subscription',
    api_available: false,
    pricing: {
      paid_tier: '$10 לחודש בסיסי, $30 לחודש מתקדם',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'dalle3',
    name: 'DALL·E 3',
    description: 'מודל יצירת תמונות מתקדם של OpenAI, המייצר תמונות מציאותיות ומדויקות.',
    category: 'image',
    url: 'https://openai.com/dall-e-3',
    icon: '/icons/dalle.svg',
    features: [
      'דיוק גבוה בפרטים',
      'הבנת טקסט מתקדמת',
      'API זמין ונוח',
      'מענה מדויק ומפורט',
    ],
    pros: [
      'איכות תמונה מעולה',
      'אינטגרציה קלה',
      'תמיכה נרחבת',
      'עדכונים תכופים',
    ],
    cons: [
      'מחיר גבוה',
      'זמן עיבוד איטי',
      'לא תמיד מדויק',
      'תלות בחיבור לאינטרנט',
    ],
    tags: ['איור', 'עיצוב', 'מציאותי', 'אמנות'],
    pricing_model: 'paid',
    pricing_type: 'usage-based',
    api_available: true,
    pricing: {
      paid_tier: '$0.04 לתמונה רגילה, $0.08 לתמונה HD',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    description: 'מודל ליצירת תמונות המתמחה בסגנונות אמנותיים ואיורים.',
    category: 'image',
    url: 'https://ideogram.ai',
    icon: '/icons/ideogram.svg',
    features: [
      'יצירת תמונות מטקסט',
      'סגנונות אמנותיים מגוונים',
      'עריכת תמונות',
      'שליטה בפרטים',
    ],
    pros: [
      'איכות תמונה גבוהה',
      'מגוון סגנונות',
      'ממשק משתמש נוח',
      'מחיר תחרותי',
    ],
    cons: [
      'זמן עיבוד ארוך',
      'הגבלות על תוכן',
      'תוצאות לא עקביות',
      'אין תמיכה בעברית',
    ],
    tags: ['איור', 'עיצוב', 'אמנות', 'יצירתיות'],
    pricing_model: 'freemium',
    pricing_type: 'usage-based',
    api_available: true,
    pricing: {
      free_tier: '100K טוקנים בחינם',
      paid_tier: '$5 ל-1M טוקנים',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'מודל קוד פתוח ליצירת תמונות, המאפשר התאמה אישית והרצה מקומית.',
    category: 'image',
    url: 'https://stability.ai',
    icon: '/icons/stable-diffusion.svg',
    features: [
      'יצירת תמונות מטקסט',
      'עריכת תמונות',
      'הרצה מקומית',
      'התאמה אישית',
    ],
    pros: [
      'קוד פתוח וחינמי',
      'שליטה מלאה',
      'פרטיות מלאה',
      'קהילה פעילה',
    ],
    cons: [
      'דורש חומרה חזקה',
      'התקנה מורכבת',
      'תוצאות פחות טובות',
      'ידע טכני נדרש',
    ],
    tags: ['קוד פתוח', 'מקומי', 'התאמה אישית', 'חינמי'],
    pricing_model: 'free',
    pricing_type: 'free',
    api_available: true,
    pricing: {
      free_tier: 'חינם',
      paid_tier: 'לא זמין',
      enterprise: 'לא זמין'
    }
  },
  {
    id: 'runway-gen2',
    name: 'Runway Gen-2',
    description: 'מודל מתקדם ליצירת וידאו מטקסט או תמונות, עם יכולות עריכה מתקדמות.',
    category: 'video',
    url: 'https://runway.ml',
    icon: '/icons/runway.svg',
    features: [
      'יצירת וידאו מטקסט',
      'המרת תמונה לוידאו',
      'עריכת וידאו מתקדמת',
      'אפקטים מיוחדים'
    ],
    pros: [
      'איכות וידאו גבוהה',
      'כלי עריכה מתקדמים',
      'ממשק משתמש ידידותי',
      'API זמין'
    ],
    cons: [
      'מחיר גבוה',
      'זמן עיבוד ארוך',
      'הגבלות על אורך הוידאו',
      'דורש חיבור מהיר'
    ],
    tags: ['אנימציה', 'עריכת וידאו', 'אפקטים מיוחדים'],
    pricing_model: 'paid',
    pricing_type: 'subscription',
    api_available: true,
    pricing: {
      paid_tier: '$50 לחודש בסיסי, $100 לחודש מתקדם',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    description: 'פלטפורמה חדשנית ליצירת וידאו באמצעות בינה מלאכותית.',
    category: 'video',
    url: 'https://pika.art',
    icon: '/icons/pika.svg',
    features: [
      'יצירת וידאו מטקסט',
      'אנימציה מתקדמת',
      'המרת תמונות לוידאו',
      'סגנונות מרובים'
    ],
    pros: [
      'תוצאות מרשימות',
      'מהירות עיבוד טובה',
      'קהילה פעילה',
      'עדכונים תכופים'
    ],
    cons: [
      'זמינות מוגבלת',
      'תמיכה מוגבלת',
      'אין API רשמי',
      'מחיר גבוה'
    ],
    tags: ['אנימציה', 'סרטונים קצרים', 'פרסום'],
    pricing_model: 'freemium',
    pricing_type: 'usage-based',
    api_available: false,
    pricing: {
      free_tier: '100K טוקנים בחינם',
      paid_tier: '$10 ל-1M טוקנים',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'mubert',
    name: 'Mubert',
    description: 'פלטפורמה ליצירת מוזיקה מקורית באמצעות בינה מלאכותית.',
    category: 'music',
    url: 'https://mubert.com',
    icon: '/icons/mubert.svg',
    features: [
      'יצירת מוזיקה מטקסט',
      'התאמה לווידאו',
      'מגוון סגנונות',
      'ייצוא באיכות גבוהה'
    ],
    pros: [
      'איכות סאונד מעולה',
      'מגוון סגנונות רחב',
      'API זמין',
      'מחיר תחרותי'
    ],
    cons: [
      'שליטה מוגבלת',
      'אין עריכה מתקדמת',
      'תלות באינטרנט',
      'הגבלות על שימוש מסחרי'
    ],
    tags: ['הלחנה', 'מיקס', 'אפקטים'],
    pricing_model: 'freemium',
    pricing_type: 'subscription',
    api_available: true,
    pricing: {
      free_tier: '100K טוקנים בחינם',
      paid_tier: '$10 לחודש בסיסי, $20 לחודש מתקדם',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'מערכת מתקדמת להמרת טקסט לדיבור עם קולות טבעיים במיוחד.',
    category: 'narration',
    url: 'https://elevenlabs.io',
    icon: '/icons/elevenlabs.svg',
    features: [
      'המרת טקסט לדיבור',
      'קולות מותאמים אישית',
      'שליטה ברגשות',
      'תמיכה בשפות רבות'
    ],
    pros: [
      'איכות קול מעולה',
      'מגוון קולות רחב',
      'API יציב',
      'עדכונים תכופים'
    ],
    cons: [
      'מחיר גבוה',
      'הגבלות על אורך',
      'תמיכה מוגבלת בעברית',
      'זמן עיבוד ארוך'
    ],
    tags: ['קריינות', 'דיבוב', 'פודקאסטים'],
    pricing_model: 'freemium',
    pricing_type: 'usage-based',
    api_available: true,
    pricing: {
      free_tier: '100K טוקנים בחינם',
      paid_tier: '$5 ל-1M טוקנים',
      enterprise: 'תמחור מותאם'
    }
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'פלטפורמה ליצירת סרטוני וידאו עם אווטארים מדברים.',
    category: 'lipsync',
    url: 'https://synthesia.io',
    icon: '/icons/synthesia.svg',
    features: [
      'אווטארים מותאמים אישית',
      'סנכרון שפתיים מדויק',
      'תמיכה בשפות רבות',
      'תבניות מוכנות'
    ],
    pros: [
      'איכות סנכרון גבוהה',
      'קל לשימוש',
      'תוצאות מקצועיות',
      'תמיכה טכנית טובה'
    ],
    cons: [
      'מחיר גבוה מאוד',
      'הגבלות על שימוש',
      'אין גישה לקוד מקור',
      'תלות בשירות ענן'
    ],
    tags: ['סנכרון דיבור', 'אווטארים', 'שידור חי'],
    pricing_model: 'enterprise',
    pricing_type: 'subscription',
    api_available: true,
    pricing: {
      paid_tier: 'לא זמין',
      enterprise: 'תמחור מותאם'
    }
  }
]

export async function getModels(category?: ModelCategory, filters?: {
  tags?: string[],
  pricingModel?: AIModel['pricing_model'],
  pricingType?: AIModel['pricing_type'],
  apiAvailable?: boolean
}): Promise<AIModel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredModels = [...defaultModels]
  
  if (category) {
    filteredModels = filteredModels.filter(model => model.category === category)
  }

  if (filters) {
    if (filters.tags && filters.tags.length > 0) {
      filteredModels = filteredModels.filter(model => 
        filters.tags!.every(tag => model.tags.includes(tag))
      )
    }
    if (filters.pricingModel) {
      filteredModels = filteredModels.filter(model => 
        model.pricing_model === filters.pricingModel
      )
    }
    if (filters.pricingType) {
      filteredModels = filteredModels.filter(model => 
        model.pricing_type === filters.pricingType
      )
    }
  }
  
  return filteredModels
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
