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
      profiles: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ai_models: {
        Row: {
          id: number
          name: string
          description: string
          category: string
          features: string
          pros: string
          cons: string
          tags: string[]
          pricing_model: string
          pricing_type: string
          api_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          category: string
          features: string
          pros: string
          cons: string
          tags?: string[]
          pricing_model: string
          pricing_type: string
          api_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          category?: string
          features?: string
          pros?: string
          cons?: string
          tags?: string[]
          pricing_model?: string
          pricing_type?: string
          api_available?: boolean
          created_at?: string
          updated_at?: string
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
