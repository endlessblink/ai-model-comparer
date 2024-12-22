import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'
import { Database } from '@/lib/database.types'

type Model = Database['public']['Tables']['ai_models']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export default function Models() {
  const navigate = useNavigate()
  const [models, setModels] = useState<(Model & { category: Category | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name')

      if (error) throw error
      setModels(data || [])
    } catch (err) {
      console.error('Error fetching models:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch models')
    } finally {
      setLoading(false)
    }
  }

  const toggleModelVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_models')
        .update({ show_in_home: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchModels()
    } catch (err) {
      console.error('Error updating model:', err)
      setError(err instanceof Error ? err.message : 'Failed to update model')
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
            ניהול מודלים
          </GradientHeading>
          <Button onClick={() => navigate('/admin/models/new')}>
            מודל חדש
          </Button>
        </div>

        <div className="grid gap-6">
          {models.map((model) => (
            <div 
              key={model.id} 
              className="flex items-center gap-3 p-4 bg-card rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/model/${model.id}`)}
            >
              <div className="flex items-center gap-4">
                {model.favicon && (
                  <img 
                    src={model.favicon} 
                    alt={model.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{model.name}</h3>
                  <p className="text-muted-foreground">
                    קטגוריה: {model.category?.name || 'לא מוגדר'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={model.show_in_home}
                    onCheckedChange={() => toggleModelVisibility(model.id, model.show_in_home)}
                  />
                  <span>{model.show_in_home ? 'מוצג בדף הבית' : 'מוסתר'}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/models/${model.id}`)}
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
