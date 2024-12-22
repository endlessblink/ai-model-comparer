import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Image, Video, Music, Mic, ScanFace, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { supabase } from "@/lib/supabase";
import { Database } from '@/lib/database.types';

type Category = Database['public']['Tables']['categories']['Row']
type AIModel = Database['public']['Tables']['ai_models']['Row']

interface CategoryWithModels extends Category {
  models: AIModel[]
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryWithModels[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategoriesAndModels()
  }, [])

  const fetchCategoriesAndModels = async () => {
    try {
      // Fetch active categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (categoriesError) throw categoriesError

      // Fetch models that are marked to show in home
      const { data: modelsData, error: modelsError } = await supabase
        .from('ai_models')
        .select('*')
        .eq('show_in_home', true)

      if (modelsError) throw modelsError

      // Combine categories with their models
      const categoriesWithModels = categoriesData.map(category => ({
        ...category,
        models: modelsData.filter(model => model.category_id === category.id) || []
      }))

      setCategories(categoriesWithModels)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'video':
        return <Video size={24} />;
      case 'image':
        return <Image size={24} />;
      case 'text':
        return <FileText size={24} />;
      case 'music':
        return <Music size={24} />;
      case 'narration':
        return <Mic size={24} />;
      case 'lipsync':
        return <ScanFace size={24} />;
      case 'code':
        return <Code2 size={24} />;
      default:
        return <Code2 size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-32">
        <GradientHeading as="h2" className="text-4xl text-center mb-4">
          סוגי מודלים
        </GradientHeading>
        <p className="text-muted-foreground text-center mb-16 text-lg">
          גלה את המגוון הרחב של מודלי AI המתקדמים ביותר
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div>טוען...</div>
          ) : (
            categories.map((category) => (
              <div 
                key={category.id} 
                className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border"
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                      {category.icon ? (
                        <span className="text-2xl">{category.icon}</span>
                      ) : (
                        getCategoryIcon(category.name)
                      )}
                    </div>
                    <GradientHeading as="h3" className="text-2xl">
                      {category.name}
                    </GradientHeading>
                  </div>

                  <p className="text-muted-foreground mb-8 text-right">
                    {category.description}
                  </p>

                  <div className="border-t border-border pt-8">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                    <div className="flex flex-wrap gap-4">
                      {category.models.slice(0, 2).map((model) => (
                        <div key={model.id} className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                          {model.favicon ? (
                            <img 
                              src={model.favicon}
                              alt={model.name}
                              className="w-8 h-8 rounded-lg"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary/10" />
                          )}
                          <span className="text-sm font-medium text-foreground">{model.name}</span>
                        </div>
                      ))}
                      {category.models.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          מודלים מובילים יתווספו בקרוב
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}