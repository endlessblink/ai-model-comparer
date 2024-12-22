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
          id: string
          name: string
          description: string
          pros: string | null
          cons: string | null
          favicon: string | null
          category_id: string | null
          show_in_home: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          pros?: string | null
          cons?: string | null
          favicon?: string | null
          category_id?: string | null
          show_in_home?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          pros?: string | null
          cons?: string | null
          favicon?: string | null
          category_id?: string | null
          show_in_home?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          is_active?: boolean
        }
      }
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
