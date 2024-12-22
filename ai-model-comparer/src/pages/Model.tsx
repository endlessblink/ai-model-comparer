import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import Header from '@/components/Header'
import { GradientHeading } from '@/components/ui/gradient-heading'
import { Button } from '@/components/ui/button'
import { ExternalLink, ArrowLeft } from 'lucide-react'

type AIModel = Database['public']['Tables']['ai_models']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface ModelWithCategory extends AIModel {
  category: Category | null
}

export default function ModelPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [model, setModel] = useState<ModelWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModel()
  }, [id])

  const fetchModel = async () => {
    try {
      const { data: modelData, error: modelError } = await supabase
        .from('ai_models')
        .select(`
          *,
          category:categories (*)
        `)
        .eq('id', id)
        .single()

      if (modelError) throw modelError
      if (!modelData) throw new Error('Model not found')

      setModel(modelData as ModelWithCategory)
    } catch (err) {
      console.error('Error fetching model:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch model')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">טוען...</div>
    </div>
  )

  if (error || !model) return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">שגיאה</h1>
          <p className="text-muted-foreground mb-4">{error || 'המודל לא נמצא'}</p>
          <Button onClick={() => navigate('/')}>חזרה לדף הבית</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft size={20} />
          חזרה
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-[2rem] blur-xl opacity-50" />
            
            {/* Content */}
            <div className="relative bg-card border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-xl">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                <div className="relative group">
                  {model.favicon && (
                    <>
                      {/* Gradient Background for Icon */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img 
                        src={model.favicon} 
                        alt={model.name}
                        className="relative w-20 h-20 rounded-2xl object-contain bg-black/20 p-2 transition-transform group-hover:scale-105"
                      />
                    </>
                  )}
                </div>
                
                <div className="flex-1">
                  <GradientHeading as="h1" className="text-4xl md:text-5xl mb-4">
                    {model.name}
                  </GradientHeading>
                  {model.category && (
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      {model.category.icon && (
                        <span className="text-2xl">{model.category.icon}</span>
                      )}
                      <span>{model.category.name}</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button 
                  size="lg"
                  onClick={() => window.open(model.url, '_blank')}
                  className="gap-2 shadow-lg hover:shadow-primary/20 transition-shadow"
                >
                  נסה עכשיו
                  <ExternalLink size={20} />
                </Button>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-lg leading-relaxed">{model.description}</p>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pros */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-card border border-primary/20 rounded-2xl p-6 h-full">
                    <h2 className="text-2xl font-semibold mb-6 text-primary">יתרונות</h2>
                    <div className="space-y-4">
                      {model.pros?.split('\n').map((pro, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-primary text-lg">✓</span>
                          <span className="text-lg">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cons */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-card border border-secondary/20 rounded-2xl p-6 h-full">
                    <h2 className="text-2xl font-semibold mb-6 text-secondary">חסרונות</h2>
                    <div className="space-y-4">
                      {model.cons?.split('\n').map((con, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-secondary text-lg">✗</span>
                          <span className="text-lg">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
