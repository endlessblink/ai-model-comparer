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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <div
              key={model.id}
              className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border"
            >
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                    {model.favicon ? (
                      <img 
                        src={model.favicon} 
                        alt={model.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">🤖</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{model.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      קטגוריה: {model.category?.name || 'לא מוגדר'}
                    </p>
                  </div>
                </div>

                {model.description && (
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {model.description}
                  </p>
                )}

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={model.show_in_home}
                        onCheckedChange={(e) => {
                          e.stopPropagation();
                          toggleModelVisibility(model.id, model.show_in_home);
                        }}
                      />
                      <span className="text-sm">{model.show_in_home ? 'מוצג בדף הבית' : 'מוסתר'}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/models/${model.id}`);
                      }}
                    >
                      ערוך
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
