import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'
import { Database } from '@/lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchCategories()
    } catch (err) {
      console.error('Error updating category:', err)
      setError(err instanceof Error ? err.message : 'Failed to update category')
    }
  }

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Loading...</div></div>
  if (error) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Error: {error}</div></div>

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <GradientHeading as="h1" className="text-4xl">
            ניהול קטגוריות
          </GradientHeading>
          <Button onClick={() => navigate('/admin/categories/new')}>
            קטגוריה חדשה
          </Button>
        </div>

        <div className="grid gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-card p-6 rounded-lg shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {category.icon} {/* נצטרך להחליף את זה באייקון אמיתי */}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.is_active}
                    onCheckedChange={() => toggleCategoryStatus(category.id, category.is_active)}
                  />
                  <Label>{category.is_active ? 'פעיל' : 'לא פעיל'}</Label>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/categories/${category.id}`)}
                >
                  ערוך
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
