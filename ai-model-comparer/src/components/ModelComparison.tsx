import { useState, useEffect } from 'react'
import { type ModelCategory, categoryNames, pricingModels, commonModelTags, type AIModel } from '@/data/models'
import { supabase } from '@/lib/supabase'
import ComparisonTable from './ComparisonTable'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ModelComparison() {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('llm')
  const [selectedPricing, setSelectedPricing] = useState<string>('all')
  const [onlyWithAPI, setOnlyWithAPI] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAdmin] = useState(false)
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const availableTags = commonModelTags[selectedCategory] || []

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching models:', error)
        throw new Error(error.message)
      }

      // Transform the data to match our AIModel interface
      const transformedData = (data || []).map(model => ({
        ...model,
        // Parse string fields into arrays
        features: tryParseJSON(model.features) || [],
        pros: tryParseJSON(model.pros) || [],
        cons: tryParseJSON(model.cons) || [],
        tags: Array.isArray(model.tags) ? model.tags : [],
      }))

      setModels(transformedData)
    } catch (error) {
      console.error('Error fetching models:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching models')
      setModels([])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to safely parse JSON strings
  const tryParseJSON = (str: string | null | undefined): string[] | null => {
    if (!str) return null
    try {
      const parsed = JSON.parse(str)
      return Array.isArray(parsed) ? parsed : null
    } catch (e) {
      return null
    }
  }

  const filteredModels = models.filter(model => {
    // Category filter
    if (selectedCategory && model.category !== selectedCategory) return false

    // Pricing filter
    if (selectedPricing !== 'all' && model.pricing_model !== selectedPricing) return false

    // API filter
    if (onlyWithAPI && !model.api_available) return false

    // Tags filter
    if (selectedTags.length > 0 && !selectedTags.every(tag => model.tags.includes(tag))) return false

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-6xl font-bold text-center mb-12 bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">
        השוואת מודלים
      </h1>
      
      <div className="flex flex-col gap-6 mb-8">
        {/* Search and Filters Row */}
        <div className="flex flex-wrap gap-4">
          {/* Category Select */}
          <Select value={selectedCategory} onValueChange={(value: ModelCategory) => setSelectedCategory(value)}>
            <SelectTrigger className="w-[180px] bg-background border-border">
              <SelectValue placeholder="הכל" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryNames).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model Type Select */}
          <Select value={selectedPricing} onValueChange={setSelectedPricing}>
            <SelectTrigger className="w-[180px] bg-background border-border">
              <SelectValue placeholder="מודל שפה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              {Object.entries(pricingModels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש מודלים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 bg-background border-border"
            />
          </div>

          {/* API Switch */}
          <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-1.5 ml-auto">
            <Switch
              checked={onlyWithAPI}
              onCheckedChange={setOnlyWithAPI}
              id="api-filter"
            />
            <label htmlFor="api-filter" className="text-sm text-muted-foreground">
              רק מודלים עם API
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={cn(
                "cursor-pointer border-border",
                selectedTags.includes(tag)
                  ? "hover:bg-primary/80"
                  : "hover:bg-accent"
              )}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag))
                } else {
                  setSelectedTags([...selectedTags, tag])
                }
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">טוען...</div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : (
        <ComparisonTable 
          models={filteredModels} 
          isAdmin={isAdmin} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      )}
    </div>
  )
}