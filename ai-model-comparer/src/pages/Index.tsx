import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Image, Video, Music, Mic, ScanFace, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { supabase } from "@/lib/supabase";
import { Database } from '@/lib/database.types';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { generateModelContent } from '@/lib/anthropic';

type Category = Database['public']['Tables']['categories']['Row']
type AIModel = Database['public']['Tables']['ai_models']['Row']

interface CategoryWithModels extends Category {
  models: AIModel[]
}

export default function Home() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category_id: '',
    description: '',
    features: '',
    pros: '',
    cons: '',
    pricing: '',
    api_available: false,
    home_display: false
  })
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesWithModels, setCategoriesWithModels] = useState<CategoryWithModels[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoriesAndModels()
    fetchCategories()
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

      setCategoriesWithModels(categoriesWithModels)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הקטגוריות"
      })
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
            categoriesWithModels.map((category) => (
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
                        <div 
                          key={model.id} 
                          className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => navigate(`/model/${model.id}`)}
                        >
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

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          הוספת מודל חדש
        </h1>

        <form className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label>שם</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם המודל"
            />
          </div>

          <div className="space-y-2">
            <Label>כתובת URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="כתובת האתר של המודל"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>תכונות עיקריות (כל תכונה בשורה חדשה)</Label>
            <Textarea
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              placeholder="הזן את התכונות העיקריות של המודל"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>יתרונות (כל יתרון בשורה חדשה)</Label>
            <Textarea
              value={formData.pros}
              onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
              placeholder="הזן את היתרונות של המודל"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>חסרונות (כל חיסרון בשורה חדשה)</Label>
            <Textarea
              value={formData.cons}
              onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
              placeholder="הזן את החסרונות של המודל"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>תמחור</Label>
            <Textarea
              value={formData.pricing}
              onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
              placeholder="הכנס פרטי תמחור בפסקאות"
              className="h-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.api_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, api_available: checked }))}
            />
            <Label>API זמין</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.home_display}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, home_display: checked }))}
            />
            <Label>מוצג בדף הבית</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">שמור</Button>
            <Button type="button" variant="outline">ביטול</Button>
          </div>
        </form>
      </div>
    </div>
  );
}