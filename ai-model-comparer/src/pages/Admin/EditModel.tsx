import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit AI Model</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name:</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Category:</label>
            <Input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description:</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Features:</label>
            <Textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Pros:</label>
            <Textarea
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Cons:</label>
            <Textarea
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Tags (comma-separated):</label>
            <Input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Pricing Model:</label>
            <Select
              value={formData.pricing_model}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_model: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Pricing Type:</label>
            <Select
              value={formData.pricing_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="usage-based">Usage-based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.api_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, api_available: checked }))}
            />
            <label>API Available</label>
          </div>

          <div className="space-x-4">
            <Button type="submit">Update Model</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
