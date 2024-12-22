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
import { Code2, Image, Video, Music, Mic, ScanFace, FileText } from "lucide-react"

type CategoryFormData = {
  name: string
  description: string
  icon: string
  is_active: boolean
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'text':
      return <FileText className="w-5 h-5" />;
    case 'music':
      return <Music className="w-5 h-5" />;
    case 'narration':
      return <Mic className="w-5 h-5" />;
    case 'lipsync':
      return <ScanFace className="w-5 h-5" />;
    case 'code':
      return <Code2 className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

// ניתן להרחיב את רשימת האייקונים לפי הצורך
const availableIcons = [
  { id: 'text', name: 'טקסט', icon: '📝' },
  { id: 'video', name: 'וידאו', icon: '🎥' },
  { id: 'image', name: 'תמונות', icon: '🖼️' },
  { id: 'narration', name: 'הקראה', icon: '🗣️' },
  { id: 'lipsync', name: 'סנכרון שפתיים', icon: '👄' },
  { id: 'music', name: 'מוזיקה', icon: '🎵' },
  { id: 'code', name: 'קוד', icon: '💻' },
  { id: 'assistant', name: 'עוזר אישי', icon: '🤖' },
  { id: 'translation', name: 'תרגום', icon: '🌐' },
  { id: 'analysis', name: 'ניתוח נתונים', icon: '📊' },
  { id: 'research', name: 'מחקר', icon: '🔍' },
  { id: 'writing', name: 'כתיבה', icon: '✍️' },
  { id: 'art', name: 'אומנות', icon: '🎨' },
  { id: '3d', name: 'תלת מימד', icon: '🎮' },
  { id: 'voice', name: 'קול', icon: '🎤' },
  { id: 'education', name: 'חינוך', icon: '📚' },
  { id: 'medical', name: 'רפואה', icon: '🏥' },
  { id: 'gaming', name: 'משחקים', icon: '🎲' },
  { id: 'robotics', name: 'רובוטיקה', icon: '🦾' },
  { id: 'security', name: 'אבטחה', icon: '🔒' }
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
        if (data) {
          setFormData({
            name: data.name,
            description: data.description || '',
            icon: data.icon || 'text',
            is_active: data.is_active,
          })
        }
      } catch (err) {
        console.error('Error fetching category:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch category')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: availableIcons.find(icon => icon.id === formData.icon)?.icon || '📝',
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
        <GradientHeading as="h1" className="text-4xl mb-8">
          {id ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}
        </GradientHeading>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">שם</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label>אייקון</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="bg-transparent border-0">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {availableIcons.find(icon => icon.id === formData.icon)?.icon || '📝'}
                      </span>
                      <span>{availableIcons.find(icon => icon.id === formData.icon)?.name || 'בחר אייקון'}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-transparent">
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.id} value={icon.id} className="bg-transparent">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon.icon}</span>
                        <span>{icon.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">פעיל</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {id ? 'עדכן' : 'צור'} קטגוריה
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
