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
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-32">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4 tracking-tight">
          גלה את עולם הבינה המלאכותית
        </h1>
        <p className="text-muted-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
          השוואה מקיפה של מודלים מובילים בתחום הבינה המלאכותית - מטקסט ועד תמונות, מקוד ועד מוזיקה
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">התחל עכשיו</Button>
          <Button size="lg" variant="outline" className="px-8">למד עוד</Button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mb-4 tracking-tight">סוגי מודלים</h2>
        <p className="text-muted-foreground/80 mb-12 max-w-xl mx-auto">
          גלה את המודלים המובילים בכל תחום של בינה מלאכותית
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesWithModels.map((category) => (
          <div 
            key={category.id} 
            className="group bg-[#0D0F10]/80 backdrop-blur-sm rounded-xl border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-all duration-300 hover:bg-[#0D0F10]"
          >
            <div className="p-7 space-y-7">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  {category.name === 'מוזיקה' && <Music className="h-5 w-5 text-blue-500/90" />}
                  {category.name === 'וידאו' && <Video className="h-5 w-5 text-purple-500/90" />}
                  {category.name === 'טקסט' && <FileText className="h-5 w-5 text-green-500/90" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold tracking-tight">{category.name}</h2>
                    <span className="text-xs text-blue-500/80 font-medium">
                      {category.name === 'מוזיקה' ? 'music' : category.name === 'וידאו' ? 'video' : 'text'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground/70">
                    {`מודלים ליצירת ${category.name}`}
                  </p>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground/90 uppercase tracking-wider">יתרונות</h3>
                <ul className="space-y-2.5 pr-1">
                  {category.features?.split('\n').map((feature, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors">
                      <span className="h-1 w-1 rounded-full bg-blue-500/40" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Platforms */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground/90 uppercase tracking-wider">הסרטונות</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.models.map((model) => (
                    <Button
                      key={model.id}
                      variant="ghost"
                      className="flex items-center gap-2.5 justify-start h-9 px-3 hover:bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all group/btn"
                      onClick={() => navigate(`/model/${model.id}`)}
                    >
                      <ModelFavicon name={model.name} url={model.url} size={18} />
                      <span className="truncate text-sm text-muted-foreground/90 group-hover/btn:text-foreground transition-colors">
                        {model.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center text-sm border-t border-white/[0.08] pt-5 mt-8">
                <Button
                  variant="link"
                  className="text-blue-500/90 hover:text-blue-400 p-0 h-auto font-normal text-sm"
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  צפה בכל המודלים
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}