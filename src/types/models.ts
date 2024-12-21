export type ModelCategory = 'llm' | 'image' | 'audio' | 'video' | 'multimodal'

export type PricingModel = 'free' | 'paid' | 'subscription' | 'usage_based' | 'enterprise'

export interface AIModel {
  id: string
  name: string
  description: string
  category: ModelCategory
  pricing_model: PricingModel
  api_available: boolean
  provider: string
  tags: string[]
  release_date?: string
  last_updated?: string
  model_size?: string
  training_data?: string
  license?: string
  use_cases?: string[]
  limitations?: string[]
  performance_metrics?: Record<string, any>
}