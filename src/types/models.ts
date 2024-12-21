export type ModelCategory = 'llm' | 'image' | 'audio' | 'video' | 'multimodal'

export interface AIModel {
  id: string
  name: string
  description: string
  category: ModelCategory
  pricing_model: string
  api_available: boolean
  tags: string[]
  provider: string
  release_date?: string
  last_updated?: string
}

export type PricingModel = 'free' | 'paid' | 'subscription' | 'usage_based' | 'enterprise' 