export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_models: {
        Row: {
          id: number
          name: string
          description: string
          features: string[]
          pricing: Json
          pros: string[]
          cons: string[]
          usage_notes: string
          last_updated: string
          created_at: string
          category: string
          api_available: boolean
        }
        Insert: {
          id?: number
          name: string
          description: string
          features?: string[]
          pricing?: Json
          pros?: string[]
          cons?: string[]
          usage_notes?: string
          last_updated?: string
          created_at?: string
          category?: string
          api_available?: boolean
        }
        Update: {
          id?: number
          name?: string
          description?: string
          features?: string[]
          pricing?: Json
          pros?: string[]
          cons?: string[]
          usage_notes?: string
          last_updated?: string
          created_at?: string
          category?: string
          api_available?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
