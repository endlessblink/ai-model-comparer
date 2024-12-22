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
import { generateModelContent, getFavicon } from '@/lib/anthropic'
import { useToast } from '@/components/ui/use-toast'

type ModelFormData = {
  name: string
  description: string
  category_id: string
  pros: string
  cons: string
  favicon: string
  show_in_home: boolean
  url: string
}

type Category = Database['public']['Tables']['categories']['Row']

export default function EditModel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    description: '',
    category_id: '',
    pros: '',
    cons: '',
    favicon: '',
    show_in_home: false,
    url: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        setCategories(data || [])

        // אם אין קטגוריה נבחרת ויש קטגוריות, נבחר את הראשונה כברירת מחדל
        if (!formData.category_id && data && data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchModel = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_models')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Model not found')

        setFormData({
          name: data.name,
          description: data.description,
          category_id: data.category_id || '',
          pros: data.pros || '',
          cons: data.cons || '',
          favicon: data.favicon || '',
          show_in_home: data.show_in_home,
          url: data.url || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch model')
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const modelData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id,
        pros: formData.pros.trim() || null,
        cons: formData.cons.trim() || null,
        favicon: formData.favicon.trim() || null,
        show_in_home: formData.show_in_home,
        url: formData.url.trim() || null
      }

      if (!modelData.favicon) {
        try {
          const faviconUrl = await getFavicon(modelData.url)
          modelData.favicon = faviconUrl
        } catch (error) {
          console.error('Error getting favicon:', error)
        }
      }

      if (id) {
        const { error } = await supabase
          .from('ai_models')
          .update(modelData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('ai_models')
          .insert([modelData])

        if (error) throw error
      }

      toast({
        title: "הצלחה",
        description: id ? "המודל עודכן בהצלחה" : "המודל נוצר בהצלחה"
      })
      navigate('/admin/models')
    } catch (err) {
      console.error('Error saving model:', err)
      setError(err instanceof Error ? err.message : 'Failed to save model')
    }
  }

  const generateContent = async () => {
    if (!formData.name || !formData.url || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "יש למלא שם, כתובת וקטגוריה לפני יצירת תוכן"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const category = categories.find(c => c.id === formData.category_id);
      const content = await generateModelContent({
        modelName: formData.name,
        modelUrl: formData.url,
        category: category?.name || ''
      });

      setFormData(prev => ({
        ...prev,
        description: content.description,
        pros: content.pros.join('\n'),
        cons: content.cons.join('\n')
      }));

      toast({
        title: "הצלחה",
        description: "התוכן נוצר בהצלחה"
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת התוכן"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Loading...</div></div>
  if (error) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Error: {error}</div></div>

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <GradientHeading as="h1" className="text-4xl text-center mb-12">
          {id ? 'עריכת מודל' : 'יצירת מודל חדש'}
        </GradientHeading>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
          <div>
            <Label>שם המודל</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              dir="rtl"
            />
          </div>

          <div>
            <Label>כתובת URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
              dir="ltr"
            />
          </div>

          <div>
            <Label>קטגוריה</Label>
            <Select 
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>תיאור</Label>
            <div className="flex gap-2 mb-2">
              <Button 
                type="button" 
                variant="secondary"
                onClick={generateContent}
                disabled={isGenerating}
              >
                {isGenerating ? 'יוצר תוכן...' : 'צור תוכן אוטומטית'}
              </Button>
              <div className="text-sm text-muted-foreground mt-2">
                יוצר תיאור, יתרונות וחסרונות באמצעות AI
              </div>
            </div>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="הזן תיאור של המודל"
              className="h-32"
            />
          </div>

          <div>
            <Label>יתרונות</Label>
            <Textarea
              value={formData.pros}
              onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
              dir="rtl"
              placeholder="הזן את היתרונות של המודל"
            />
          </div>

          <div>
            <Label>חסרונות</Label>
            <Textarea
              value={formData.cons}
              onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
              dir="rtl"
              placeholder="הזן את החסרונות של המודל"
            />
          </div>

          <div>
            <Label>Favicon URL</Label>
            <Input
              type="url"
              value={formData.favicon}
              onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
              dir="ltr"
              placeholder="הכנס כתובת URL של האייקון"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.show_in_home}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_home: checked }))}
            />
            <Label>הצג בדף הבית</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {id ? 'שמור שינויים' : 'צור מודל'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/models')}>
              ביטול
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
