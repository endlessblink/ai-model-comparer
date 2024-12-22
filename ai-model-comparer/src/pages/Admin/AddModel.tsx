import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateModelContent } from '@/lib/anthropic';

interface FormData {
  name: string;
  description: string;
  features: string;
  pros: string;
  cons: string;
  category: string;
  pricing_model: string;
  pricing_type: string;
  api_available: boolean;
  featured: boolean;
  url: string;
}

interface Category {
  id: string;
  name: string;
  is_active: boolean;
}

const SECTION_HEADERS = {
  name: 'שם',
  description: 'תיאור',
  features: 'תכונות',
  pros: 'יתרונות',
  cons: 'חסרונות',
  category: 'קטגוריה',
  url: 'כתובת האתר',
  pricing: {
    model: 'מודל תמחור',
    type: 'סוג תמחור'
  }
};

export default function AddModel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    features: '',
    pros: '',
    cons: '',
    category: '',
    pricing_model: 'free',
    pricing_type: 'one-time',
    api_available: false,
    featured: false,
    url: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הקטגוריות"
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'שם המודל הוא שדה חובה';
    }
    if (!formData.category) {
      newErrors.category = 'קטגוריה היא שדה חובה';
    }
    if (!formData.description) {
      newErrors.description = 'תיאור הוא שדה חובה';
    }
    if (!formData.url) {
      newErrors.url = 'כתובת האתר היא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateContent = async () => {
    if (!formData.name || !formData.url || !formData.category) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "יש למלא שם, כתובת וקטגוריה לפני יצירת תוכן"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const selectedCategory = categories.find(c => c.id === formData.category);
      if (!selectedCategory) {
        throw new Error('קטגוריה לא נמצאה');
      }

      const content = await generateModelContent({
        modelName: formData.name,
        modelUrl: formData.url,
        category: selectedCategory.name
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const modelData = {
        name: formData.name,
        description: formData.description,
        category_id: formData.category,
        pros: formData.pros.split('\n').filter(Boolean),
        cons: formData.cons.split('\n').filter(Boolean),
        show_in_home: formData.featured,
        url: formData.url
      };

      const { error } = await supabase
        .from('ai_models')
        .insert([modelData]);

      if (error) throw error;

      toast({
        title: "הצלחה",
        description: "המודל נוצר בהצלחה"
      });

      navigate('/admin/models');
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת המודל"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        הוספת מודל חדש
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label>{SECTION_HEADERS.name}</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="שם המודל"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.url}</Label>
          <Input
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="כתובת האתר של המודל"
            dir="ltr"
            className={errors.url ? 'border-red-500' : ''}
          />
          {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.category}</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.description}</Label>
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
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="הזן תיאור של המודל"
            className={`h-32 ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.features}</Label>
          <Textarea
            value={formData.features}
            onChange={(e) => handleInputChange('features', e.target.value)}
            placeholder="הזן את התכונות העיקריות של המודל (כל תכונה בשורה חדשה)"
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.pros}</Label>
          <Textarea
            value={formData.pros}
            onChange={(e) => handleInputChange('pros', e.target.value)}
            placeholder="הזן את היתרונות של המודל (כל יתרון בשורה חדשה)"
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <Label>{SECTION_HEADERS.cons}</Label>
          <Textarea
            value={formData.cons}
            onChange={(e) => handleInputChange('cons', e.target.value)}
            placeholder="הזן את החסרונות של המודל (כל חיסרון בשורה חדשה)"
            className="h-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={formData.api_available}
            onCheckedChange={(checked) => handleInputChange('api_available', checked)}
          />
          <Label>API זמין</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange('featured', checked)}
          />
          <Label>מוצג בדף הבית</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'שומר...' : 'שמור'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/models')}>
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
}
