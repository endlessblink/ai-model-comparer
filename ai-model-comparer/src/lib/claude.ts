import { type AIModel } from '@/data/models'

const CLAUDE_SYSTEM_PROMPT = `You are an AI assistant that helps gather information about AI models and tools.
Your task is to extract relevant information about an AI model or tool from its name and optionally its website.
You should return the information in a structured format that matches the AIModel interface.
Focus on accuracy and be conservative with your assumptions.
If you're not sure about something, omit it rather than guess.
The response should be in Hebrew.`

const CLAUDE_USER_PROMPT = `Please provide information about the following AI model:
Name: {name}
Website: {url}

Return the information in this format:
{
  "description": "A concise description",
  "features": ["feature1", "feature2", "feature3", "feature4"],
  "pros": ["pro1", "pro2", "pro3", "pro4"],
  "cons": ["con1", "con2", "con3", "con4"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "category": "one of: llm, image, video, music, narration, lipsync",
  "pricing_model": "one of: free, freemium, paid, enterprise",
  "pricing_type": "one of: free, one-time, subscription, usage-based",
  "api_available": boolean,
  "url": "official website url"
}`

export async function fetchModelInfo(
  name: string,
  url?: string
): Promise<Partial<AIModel>> {
  // This is a mock implementation
  // In a real app, you would call Claude's API here
  console.log('Fetching model info for:', name, url)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data based on the model name
  const nameLower = name.toLowerCase()
  
  if (nameLower.includes('ideogram') || nameLower.includes('אידאוגרם')) {
    return {
      description: 'מודל ליצירת תמונות המתמחה בסגנונות אמנותיים ואיורים',
      category: 'image',
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
      url: 'https://ideogram.ai',
    }
  }

  if (nameLower.includes('stable diffusion') || nameLower.includes('סטייבל דיפיוז׳ן')) {
    return {
      description: 'מודל קוד פתוח ליצירת תמונות, המאפשר התאמה אישית והרצה מקומית',
      category: 'image',
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
      url: 'https://stability.ai',
    }
  }

  if (nameLower.includes('leonardo') || nameLower.includes('לאונרדו')) {
    return {
      description: 'פלטפורמה מקצועית ליצירת תמונות עם דגש על איכות ודיוק',
      category: 'image',
      features: [
        'יצירת תמונות מטקסט',
        'עריכת תמונות',
        'אימון מודלים מותאמים',
        'כלי עריכה מתקדמים',
      ],
      pros: [
        'איכות תמונה מעולה',
        'כלים מקצועיים',
        'תמיכה טכנית',
        'עדכונים תכופים',
      ],
      cons: [
        'מחיר גבוה',
        'עקומת למידה תלולה',
        'זמני עיבוד ארוכים',
        'הגבלות על תוכן',
      ],
      tags: ['מקצועי', 'איכותי', 'מותאם אישית', 'מתקדם'],
      pricing_model: 'paid',
      pricing_type: 'subscription',
      api_available: true,
      url: 'https://leonardo.ai',
    }
  }

  if (nameLower.includes('firefly') || nameLower.includes('פיירפליי')) {
    return {
      description: 'כלי ליצירת ועריכת תמונות מבית Adobe, משתלב עם מוצרי Creative Cloud',
      category: 'image',
      features: [
        'יצירת תמונות מטקסט',
        'עריכת תמונות',
        'אינטגרציה עם Adobe',
        'כלי עריכה מתקדמים',
      ],
      pros: [
        'ממשק מוכר',
        'אינטגרציה מעולה',
        'תמיכה מקצועית',
        'איכות גבוהה',
      ],
      cons: [
        'מחיר גבוה',
        'דורש מנוי Adobe',
        'הגבלות שימוש',
        'פחות גמיש',
      ],
      tags: ['adobe', 'עיצוב', 'מקצועי', 'עריכה'],
      pricing_model: 'paid',
      pricing_type: 'subscription',
      api_available: true,
      url: 'https://www.adobe.com/products/firefly',
    }
  }
  
  // Default response for unknown models
  return {
    description: 'מידע לא זמין',
    category: 'llm',
    features: [],
    pros: [],
    cons: [],
    tags: [],
    pricing_model: 'paid',
    pricing_type: 'usage-based',
    api_available: false,
  }
} 