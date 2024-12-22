import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'
import { Database } from '@/lib/database.types'
import { useToast } from '@/components/ui/use-toast'

type CategoryElement = Database['public']['Tables']['category_elements']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export default function AddCategoryElement() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    url: ''
  })

  useEffect(() => {
    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (error) throw error
      setCategory(data)
    } catch (err) {
      console.error('Error fetching category:', err)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הקטגוריה"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('category_elements')
        .insert({
          category_id: categoryId,
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon || null,
          url: formData.url || null,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "הצלחה",
        description: "האלמנט נוסף בהצלחה"
      })
      
      navigate(`/admin/categories`)
    } catch (err) {
      console.error('Error adding element:', err)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בהוספת האלמנט"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <GradientHeading as="h1" className="text-4xl mb-8">
            הוספת אלמנט ל{category?.name || 'קטגוריה'}
          </GradientHeading>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">שם האלמנט</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">אייקון (אימוג'י)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🤖"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">כתובת URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'שומר...' : 'שמור אלמנט'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categories')}
              >
                ביטול
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
