import { useState, useEffect } from 'react'
import { type ModelCategory, categoryNames, pricingModels, commonModelTags, type AIModel } from '@/data/models'
import { supabase } from '@/lib/supabase'
import ComparisonTable from './ComparisonTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

export default function ModelComparison() {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('llm')
  const [selectedPricing, setSelectedPricing] = useState<string>('all')
  const [onlyWithAPI, setOnlyWithAPI] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAdmin] = useState(false)
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

      if (error) throw error

      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
      setModels([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => {
    // Category filter
    if (model.category !== selectedCategory) return false
    
    // Pricing filter
    if (selectedPricing !== 'all' && model.pricing_model !== selectedPricing) return false
    
    // API availability filter
    if (onlyWithAPI && !model.api_available) return false
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.tags.some(tag => tag.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }
    
    // Tags filter
    if (selectedTags.length > 0) {
      if (!selectedTags.every(tag => model.tags.includes(tag))) return false
    }
    
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        השוואת מודלים
      </h1>
      
      <div className="flex flex-col gap-4 mb-8">
        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-purple-500/20 rounded-lg px-4 py-1.5">
              <Switch
                checked={onlyWithAPI}
                onCheckedChange={setOnlyWithAPI}
                id="api-filter"
                className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-700"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right bg-[#0d0e1a] border-gray-800 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            
            <Select value={selectedPricing} onValueChange={setSelectedPricing}>
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
                    setSelectedCategory(key as ModelCategory)
                    setSelectedTags([])
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
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'border-gray-800 hover:border-purple-500/50'
                }`}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )
                }}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X 
                    className="h-3 w-3 mr-1 hover:text-purple-300" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTags(prev => prev.filter(t => t !== tag))
                    }} 
                  />
                )}
              </Badge>
            ))}
          </div>

          {/* Content */}
          {Object.keys(categoryNames).map((category) => (
            <TabsContent key={category} value={category}>
              <ComparisonTable
                models={filteredModels}
                onEdit={() => {}}
                onDelete={() => {}}
                isAdmin={isAdmin}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}