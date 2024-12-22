export const MODEL_CATEGORIES = [
  'מודל שפה',
  'יצירת תמונות',
  'יצירת וידאו',
  'יצירת מוזיקה',
  'הקראה',
  'סכרון שפתיים'
] as const;

export type ModelCategory = typeof MODEL_CATEGORIES[number];
