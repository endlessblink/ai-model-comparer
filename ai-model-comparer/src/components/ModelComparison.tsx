import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ComparisonTable from './ComparisonTable'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { GradientHeading } from '@/components/ui/gradient-heading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MODEL_CATEGORIES } from '@/lib/constants'

interface AIModel {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  pros: string[]
  cons: string[]
  tags: string[]
  pricing_model: string
  pricing_type: string
  api_available: boolean
  created_at: string
}

export default function ModelComparison() {
  const [selectedCategory, setSelectedCategory] = useState<string>('מודל שפה')
  const [selectedPricing, setSelectedPricing] = useState<string>('all')
  const [onlyWithAPI, setOnlyWithAPI] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching models...');
      
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error fetching models:', error)
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        console.log('No models found in the database');
      } else {
        console.log('Found models:', data.length);
      }

      setModels(data || [])
    } catch (error) {
      console.error('Error in fetchModels:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching models')
      setModels([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => {
    // Category filter
    if (selectedCategory !== 'הכל' && model.category !== selectedCategory) return false

    // Pricing filter
    if (selectedPricing !== 'all' && model.pricing_model !== selectedPricing) return false

    // API filter
    if (onlyWithAPI && !model.api_available) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <GradientHeading as="h1" className="text-4xl text-center mb-12">
        השוואת מודלים
      </GradientHeading>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש מודלים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              dir="rtl"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="הכל" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="הכל">הכל</SelectItem>
              {MODEL_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Pricing Filter */}
          <Select value={selectedPricing} onValueChange={setSelectedPricing}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="מודל תמחור" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="free">חינמי</SelectItem>
              <SelectItem value="freemium">חינמי עם הגבלות</SelectItem>
              <SelectItem value="paid">בתשלום</SelectItem>
              <SelectItem value="enterprise">ארגוני</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* API Filter */}
        <div className="flex items-center gap-2">
          <Switch
            checked={onlyWithAPI}
            onCheckedChange={setOnlyWithAPI}
          />
          <span>רק מודלים עם API</span>
        </div>
      </div>

      {/* Models Display */}
      {isLoading ? (
        <div className="text-center py-8">טוען...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div key={model.id} className="border rounded-lg p-6 bg-card">
              <GradientHeading as="h3" className="text-xl mb-2">
                {model.name}
              </GradientHeading>
              <p className="text-muted-foreground mb-4">{model.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {model.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{model.category}</Badge>
                <Badge variant={model.api_available ? "default" : "secondary"}>
                  {model.api_available ? "API זמין" : "ללא API"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}