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
import { MODEL_CATEGORIES } from '@/lib/constants'

interface ModelFormData {
  name: string;
  category: string;
  description: string;
  features: string;
  pros: string;
  cons: string;
  tags: string[];
  pricing_model: string;
  pricing_type: string;
  api_available: boolean;
  featured: boolean;
}

export default function EditModel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    category: '',
    description: '',
    features: '',
    pros: '',
    cons: '',
    tags: [],
    pricing_model: 'free',
    pricing_type: 'one-time',
    api_available: false,
    featured: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_models')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Model not found')

        setFormData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch model')
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '')
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const modelData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        features: formData.features.trim(),
        pros: formData.pros.trim(),
        cons: formData.cons.trim(),
        tags: formData.tags || [],
        pricing_model: formData.pricing_model,
        pricing_type: formData.pricing_type,
        api_available: formData.api_available,
        featured: formData.featured,
      }

      const { error } = await supabase
        .from('ai_models')
        .update(modelData)
        .eq('id', id)

      if (error) throw error

      navigate('/admin/dashboard')
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
        <GradientHeading as="h1" className="text-4xl text-center mb-12">
          עדכן מודל
        </GradientHeading>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-2">שם:</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">קטגוריה:</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              dir="rtl"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">תיאור:</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">תכונות:</label>
            <Textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">יתרונות:</label>
            <Textarea
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">חסרונות:</label>
            <Textarea
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">תגיות (מופרדות בפסיקים):</label>
            <Input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              dir="rtl"
            />
          </div>

          <div>
            <label className="block mb-2">מודל תמחור:</label>
            <Select
              value={formData.pricing_model}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_model: value }))}
              dir="rtl"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">חינמי</SelectItem>
                <SelectItem value="freemium">חינמי עם הגבלות</SelectItem>
                <SelectItem value="paid">בתשלום</SelectItem>
                <SelectItem value="enterprise">ארגוני</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">סוג תמחור:</label>
            <Select
              value={formData.pricing_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_type: value }))}
              dir="rtl"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">חד פעמי</SelectItem>
                <SelectItem value="subscription">מנוי</SelectItem>
                <SelectItem value="usage-based">לפי שימוש</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-8">
            <div className="flex items-center px-[25px] py-6 mb-6 rounded-md">
              <Switch
                checked={formData.api_available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, api_available: checked }))}
              />
              <label className="mr-2">API זמין</label>
            </div>

            <div className="flex items-center px-[25px] py-6 mb-6 rounded-md">
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <label className="mr-2">מודל מוצג בדף הבית</label>
            </div>

            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')} className="px-4 py-2">
                ביטול
              </Button>
              <Button type="submit" className="px-4 py-2">
                עדכן מודל
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
