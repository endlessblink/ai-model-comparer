import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Code2, Image, Video, Music, Mic, ScanFace, FileText, Loader2, Wand2 } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/components/ui/use-toast';
import { generateModelContent } from '@/lib/anthropic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function generateCategoryDescription(categoryName: string): Promise<string> {
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `כתוב תיאור קצר (עד 20 מילים) בעברית על קטגוריית ${categoryName} בהקשר של מודלים של בינה מלאכותית.`
        }],
        model: 'claude-3-haiku-20240307',
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating description:', error);
    return `מודלים ליצירת ${categoryName}`; // Default fallback
  }
}

type Category = Database['public']['Tables']['categories']['Row']
type AIModel = Database['public']['Tables']['ai_models']['Row']

interface CategoryWithModels extends Category {
  models: AIModel[]
}

interface NewCategoryForm {
  name: string;
  description: string;
  useAI: boolean;
}

async function generateCategoryContent(name: string): Promise<string> {
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `כתוב תיאור מפורט (2-3 פסקאות) בעברית על קטגוריית ${name} בהקשר של מודלים של בינה מלאכותית. התייחס ליכולות, שימושים ויתרונות של מודלים בתחום זה.`
        }],
        model: 'claude-3-haiku-20240307',
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating content:', error);
    return '';
  }
}

const AddCategoryForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    useAI: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להזין שם קטגוריה",
        variant: "destructive",
      });
      return;
    }

    let description = formData.description;
    if (formData.useAI) {
      setIsGenerating(true);
      description = await generateCategoryContent(formData.name);
      setIsGenerating(false);
    }

    // כאן תוסיף את הלוגיקה לשמירת הקטגוריה
    console.log('Saving category:', { ...formData, description });
  };

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להזין שם קטגוריה לפני יצירת תוכן אוטומטי",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const content = await generateCategoryContent(formData.name);
    setFormData(prev => ({ ...prev, description: content }));
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 bg-gradient-to-br from-[rgba(138,116,249,0.9)] via-[rgba(147,151,255,0.8)] to-[rgba(138,116,249,0.7)] bg-clip-text text-transparent">
        קטגוריה חדשה
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/90">שם</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-[rgba(30,27,75,0.4)] border-white/[0.03] text-white/90"
            placeholder="הזן שם קטגוריה..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="description" className="text-white/90">תיאור</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[rgba(138,116,249,0.9)] hover:text-[rgba(138,116,249,1)] hover:bg-white/[0.03]"
              onClick={generateDescription}
              disabled={isGenerating || !formData.name}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  יוצר תוכן...
                </>
              ) : (
                <>
                  צור תוכן אוטומטי
                  <Wand2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-[rgba(30,27,75,0.4)] border-white/[0.03] text-white/90 min-h-[100px]"
            placeholder="תאר את הקטגוריה..."
            disabled={isGenerating}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="useAI" className="text-white/90">צור תוכן אוטומטית בעת השמירה</Label>
          <Switch
            id="useAI"
            checked={formData.useAI}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useAI: checked }))}
            disabled={isGenerating}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="bg-transparent border-white/[0.03] text-white/90 hover:bg-white/[0.03]"
          >
            ביטול
          </Button>
          <Button
            type="submit"
            disabled={!formData.name || isGenerating}
            className="bg-[rgba(138,116,249,0.9)] hover:bg-[rgba(138,116,249,1)] text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                יוצר תוכן...
              </>
            ) : (
              'צור קטגוריה'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);

  useEffect(() => {
    fetchCategoriesAndModels()
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `יום ${dayName}, ${dayNumber} ${monthName} ${year} • ${hours}:${minutes}`;
  };

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

  const handleNewCategorySubmit = async () => {
    if (!showNewCategoryDialog) return;

    const categoryToAdd: CategoryWithModels = {
      id: String(Date.now()),
      name: 'New Category',
      description: 'New category description',
      models: []
    };

    setCategoriesWithModels(prev => [...prev, categoryToAdd]);
    setShowNewCategoryDialog(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0a14] pb-24">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-br from-[rgba(138,116,249,0.9)] via-[rgba(147,151,255,0.8)] to-[rgba(138,116,249,0.7)] bg-clip-text text-transparent mb-6">
            גלה את המודלים המובילים
            <br />
            בכל תחום של
            <br />
            בינה מלאכותית
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70">
            השוואה מקיפה בין מודלים מובילים בתחומי טקסט, תמונה, קול ווידאו
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Add Category Button */}
          <div className="mb-8 flex justify-end">
            <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[rgba(30,27,75,0.4)] border border-white/[0.03] hover:border-white/[0.06] text-white/90 hover:text-white transition-all duration-300"
                >
                  הוסף קטגוריה חדשה +
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#13112e] border-white/[0.03] text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold tracking-tight bg-gradient-to-br from-[rgba(138,116,249,0.9)] via-[rgba(147,151,255,0.8)] to-[rgba(138,116,249,0.7)] bg-clip-text text-transparent">
                    קטגוריה חדשה
                  </DialogTitle>
                </DialogHeader>
                <AddCategoryForm />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithModels.map((category) => (
              <div
                key={category.id}
                className="group relative rounded-xl bg-[rgba(20,18,40,0.4)] border border-white/[0.03] hover:border-white/[0.06] transition-all duration-300 hover:translate-y-[-2px] hover:bg-[rgba(25,23,48,0.4)]"
              >
                <div className="p-8 space-y-8">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-xl bg-[rgba(30,27,75,0.7)] border border-[rgba(138,116,249,0.2)]">
                      {category.name === 'מוזיקה' && <Music className="h-6 w-6 text-[rgba(138,116,249,0.9)] transition-all group-hover:text-[rgba(138,116,249,1)]" />}
                      {category.name === 'וידאו' && <Video className="h-6 w-6 text-[rgba(138,116,249,0.9)] transition-all group-hover:text-[rgba(138,116,249,1)]" />}
                      {category.name === 'טקסט' && <FileText className="h-6 w-6 text-[rgba(138,116,249,0.9)] transition-all group-hover:text-[rgba(138,116,249,1)]" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-1.5">{category.name}</h2>
                      <p className="text-[0.95rem] text-white/60 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Models */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      {category.models.map((model) => (
                        <Button
                          key={model.id}
                          variant="ghost"
                          className="flex items-center gap-2.5 justify-start h-10 px-3.5 bg-[rgba(30,27,75,0.4)] hover:bg-[rgba(30,27,75,0.6)] border border-white/[0.03] hover:border-white/[0.06] transition-all duration-300 group/btn"
                          onClick={() => navigate(`/model/${model.id}`)}
                        >
                          <ModelFavicon name={model.name} url={model.url} size={18} className="opacity-85 brightness-95 group-hover/btn:opacity-100 group-hover/btn:brightness-100 transition-all" />
                          <span className="truncate text-[0.95rem] text-white/70 group-hover/btn:text-white/90 transition-colors">
                            {model.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center text-sm border-t border-white/[0.03] pt-6 mt-8">
                    <Button
                      variant="link"
                      className="text-[rgba(138,116,249,0.85)] hover:text-[rgba(138,116,249,1)] p-0 h-auto font-normal text-[0.95rem] group/link flex items-center gap-2"
                      onClick={() => navigate('/compare')}
                    >
                      השווה מודלים
                      <span className="opacity-0 group-hover/link:opacity-100 transform translate-x-2 group-hover/link:translate-x-0 transition-all">
                        →
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}