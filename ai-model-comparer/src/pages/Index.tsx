import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Image, Video, Music, Mic, ScanFace, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { generateModelContent } from '@/lib/anthropic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
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
                  className="group relative"
                >
                  {/* Background gradient effect */}
                  <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-primary/5 group-hover:via-secondary/5 group-hover:to-primary/5 group-hover:opacity-100" />
                  
                  {/* Card content */}
                  <div className="relative rounded-2xl bg-[#1A1C1E]/90 backdrop-blur-sm p-6 transition-all duration-500 hover:translate-y-[-4px]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-xl bg-[#2A2C2E]">
                        {category.icon ? (
                          <span className="text-xl opacity-80">{category.icon}</span>
                        ) : (
                          <span className="opacity-80">{getCategoryIcon(category.name)}</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <GradientHeading as="h3" className="text-lg font-medium">
                          {category.name}
                        </GradientHeading>
                        <p className="text-sm text-muted-foreground">
                          {category.description || 'מודלים ליצירת ' + category.name}
                        </p>
                      </div>
                    </div>

                    {/* Featured Models Section */}
                    <div className="mt-6 space-y-2">
                      {category.models && category.models.length > 0 ? (
                        category.models.map((model) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-[#0D0F10] border border-white/[0.03] cursor-pointer hover:bg-[#1A1C1E] transition-colors"
                            onClick={() => navigate(`/model/${model.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <ModelFavicon name={model.name} url={model.url} size={20} className="opacity-80" />
                              <span className="text-sm text-muted-foreground">
                                {model.name}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl bg-[#0D0F10] border border-white/[0.03]">
                          <span className="text-sm text-muted-foreground">
                            מודלים מובילים יתווספו בקרוב
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}