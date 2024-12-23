import { useState, useEffect, useMemo, useCallback } from 'react'
import { type ModelCategory, type AIModel } from '@/types/models'
import { categoryNames, pricingModels, commonModelTags } from '@/data/models'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useDebounce } from '@/hooks/useDebounce'

// Types for filter state
type FilterState = {
  category: ModelCategory
  pricing: string
  onlyWithAPI: boolean
  searchQuery: string
  tags: string[]
}

export default function ModelComparison() {
  // Combine filter states into a single object
  const [filters, setFilters] = useState<FilterState>({
    category: 'llm',
    pricing: 'all',
    onlyWithAPI: false,
    searchQuery: '',
    tags: []
  })
  
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300)

  const availableTags = useMemo(() => 
    commonModelTags[filters.category] || [], 
    [filters.category]
  )

  // Memoize filtered models to prevent unnecessary recalculations
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      // Pricing filter
      if (filters.pricing !== 'all' && model.pricing_model !== filters.pricing) return false
      
      // API availability filter
      if (filters.onlyWithAPI && !model.api_available) return false
      
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase()
        const matchesSearch = 
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.tags.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      
      // Tags filter
      if (filters.tags.length > 0) {
        if (!filters.tags.every(tag => model.tags.includes(tag))) return false
      }
      
      return true
    })
  }, [models, filters.pricing, filters.onlyWithAPI, debouncedSearchQuery, filters.tags])

  // Memoize fetch function to prevent unnecessary recreations
  const fetchModels = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('ai_models')
        .select('id, name, description, category, pricing_model, api_available, provider, tags')
        .eq('category', filters.category)
        .order('name')
      
      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
      setError('Failed to fetch models. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [filters.category])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please check your environment variables.')
      setIsLoading(false)
      return
    }
    fetchModels()
  }, [fetchModels])

  // Update filter handlers
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        השוואת מודלים
      </h1>
      
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {/* Search and Filters Row */}
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-purple-500/20 rounded-lg px-4 py-1.5">
                <input
                  type="checkbox"
                  checked={filters.onlyWithAPI}
                  onChange={(e) => updateFilter('onlyWithAPI', e.target.checked)}
                  id="api-filter"
                  className="rounded border-gray-700 bg-transparent"
                />
                <label htmlFor="api-filter" className="text-sm text-gray-400">
                  רק מודלים עם API
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-[280px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="חיפוש מודלים..."
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  className="pr-10 text-right bg-[#0d0e1a] border-gray-800 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              
              <Select value={filters.pricing} onValueChange={(value) => updateFilter('pricing', value)}>
                <SelectTrigger className="w-[180px] bg-[#0d0e1a] border-gray-800">
                  <SelectValue placeholder="סינון לפי תמחור" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0e1a] border-gray-800">
                  <SelectItem value="all">הכל</SelectItem>
                  {Object.entries(pricingModels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="llm" dir="rtl" className="w-full">
            <TabsList className="bg-[#0d0e1a] border-b border-gray-800 p-0 h-auto mb-6">
              <div className="flex overflow-x-auto">
                {Object.entries(categoryNames).map(([key, name]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    onClick={() => {
                      updateFilter('category', key as ModelCategory)
                      updateFilter('tags', [])
                    }}
                    className="px-4 py-2 text-sm data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400"
                  >
                    <span>{name}</span>
                    <Badge variant="secondary" className="mr-2 bg-gray-800/50 text-gray-400">
                      {models.filter(m => m.category === key).length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.tags.includes(tag)
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'border-gray-800 hover:border-purple-500/50'
                  }`}
                  onClick={() => {
                    updateFilter('tags', filters.tags.includes(tag)
                      ? filters.tags.filter(t => t !== tag)
                      : [...filters.tags, tag]
                    )
                  }}
                >
                  {tag}
                  {filters.tags.includes(tag) && (
                    <X 
                      className="h-3 w-3 mr-1 hover:text-purple-300" 
                      onClick={(e) => {
                        e.stopPropagation()
                        updateFilter('tags', filters.tags.filter(t => t !== tag))
                      }} 
                    />
                  )}
                </Badge>
              ))}
            </div>

            {/* Content */}
            {Object.keys(categoryNames).map((category) => (
              <TabsContent key={category} value={category}>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-400">טוען מודלים...</p>
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">לא נמצאו מודלים מתאימים</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        className="p-6 rounded-2xl bg-[#1a1a1a] border border-gray-800"
                      >
                        <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                        <p className="text-gray-400 mb-4">{model.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {model.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-gray-800 text-gray-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}