import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'
import { Database } from '@/lib/database.types'

type CategoryFormData = {
  name: string
  description: string
  icon: string
  is_active: boolean
}

// ניתן להרחיב את רשימת האייקונים לפי הצורך
const availableIcons = [
  { id: 'video', name: '🎥 וידאו' },
  { id: 'image', name: '🖼️ תמונות' },
  { id: 'text', name: '📝 טקסט' },
  { id: 'lipsync', name: '👄 סנכרון שפתיים' },
  { id: 'narration', name: '🗣️ הקראה' },
  { id: 'music', name: '🎵 מוזיקה' },
  { id: 'code', name: '💻 קוד' },
]

export default function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'text',
    is_active: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchCategory = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Category not found')

        setFormData({
          name: data.name,
          description: data.description || '',
          icon: data.icon,
          is_active: data.is_active,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon,
        is_active: formData.is_active,
      }

      if (id) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData])

        if (error) throw error
      }

      navigate('/admin/categories')
    } catch (err) {
      console.error('Error saving category:', err)
      setError(err instanceof Error ? err.message : 'Failed to save category')
    }
  }

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Loading...</div></div>
  if (error) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Error: {error}</div></div>

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <GradientHeading as="h1" className="text-4xl text-center mb-12">
          {id ? 'עריכת קטגוריה' : 'יצירת קטגוריה חדשה'}
        </GradientHeading>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
          <div>
            <Label>שם הקטגוריה</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              dir="rtl"
            />
          </div>

          <div>
            <Label>תיאור</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              dir="rtl"
            />
          </div>

          <div>
            <Label>אייקון</Label>
            <Select 
              value={formData.icon}
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר אייקון" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((icon) => (
                  <SelectItem key={icon.id} value={icon.id}>
                    {icon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label>קטגוריה פעילה</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {id ? 'שמור שינויים' : 'צור קטגוריה'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>
              ביטול
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
