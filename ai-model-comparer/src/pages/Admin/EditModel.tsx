import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header';
import { Database } from '@/lib/database.types';
import { generateModelContent } from '@/lib/anthropic';
import { getFavicon } from '@/lib/anthropic';

type ModelFormData = {
  name: string
  description: string
  category_id: string
  features: string
  pros: string
  cons: string
  favicon: string
  show_in_home: boolean
  url: string
  pricing_model: string
  pricing_type: string
  api_available: boolean
}

type Category = Database['public']['Tables']['categories']['Row']

export default function EditModel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    description: '',
    category_id: '',
    features: '',
    pros: '',
    cons: '',
    favicon: '',
    show_in_home: false,
    url: '',
    pricing_model: '',
    pricing_type: '',
    api_available: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        setCategories(data || [])

        // אם אין קטגוריה נבחרת ויש קטגוריות, נבחר את הראשונה כברירת מחדל
        if (!formData.category_id && data && data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchModel = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_models')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Model not found')

        setFormData({
          name: data.name,
          description: data.description,
          category_id: data.category_id || '',
          features: data.features ? data.features.join('\n') : '',
          pros: data.pros ? data.pros.join('\n') : '',
          cons: data.cons ? data.cons.join('\n') : '',
          favicon: data.favicon || '',
          show_in_home: data.show_in_home,
          url: data.url || '',
          pricing_model: data.pricing_model || '',
          pricing_type: data.pricing_type || '',
          api_available: data.api_available || false
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch model')
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const modelData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category_id,
        category_id: formData.category_id,
        features: formData.features.trim(),
        pros: formData.pros.trim(),
        cons: formData.cons.trim(),
        pricing_model: formData.pricing_model,
        pricing_type: formData.pricing_type,
        api_available: formData.api_available,
        show_in_home: formData.show_in_home,
        url: formData.url.trim(),
        favicon: formData.favicon
      }

      if (id) {
        const { error } = await supabase
          .from('ai_models')
          .update(modelData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('ai_models')
          .insert([modelData])

        if (error) throw error
      }

      toast({
        title: "הצלחה",
        description: id ? "המודל עודכן בהצלחה" : "המודל נוצר בהצלחה"
      })
      navigate('/admin/models')
    } catch (err) {
      console.error('Error saving model:', err)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת המודל"
      })
    } finally {
      setIsSaving(false)
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
        features: content.features.join('\n'),
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

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, url }));
    
    if (url) {
      try {
        const favicon = await getFavicon(url);
        if (favicon) {
          setFormData(prev => ({ ...prev, favicon }));
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      }
    }
  };

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Loading...</div></div>
  if (error) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Error: {error}</div></div>

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <GradientHeading as="h1" className="text-4xl text-center mb-12">
          {id ? 'עריכת מודל' : 'יצירת מודל חדש'}
        </GradientHeading>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
          <div>
            <Label>שם המודל</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              dir="rtl"
            />
          </div>

          <div>
            <Label>כתובת URL</Label>
            <Input
              value={formData.url}
              onChange={handleUrlChange}
              dir="ltr"
              placeholder="הזן את כתובת האתר של המודל"
            />
          </div>

          <div>
            <Label>פאביקון</Label>
            <Input
              value={formData.favicon}
              onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
              dir="ltr"
              placeholder="כתובת הפאביקון (יתמלא אוטומטית)"
              disabled
            />
            {formData.favicon && (
              <div className="mt-2">
                <img src={formData.favicon} alt="favicon" className="w-6 h-6" />
              </div>
            )}
          </div>

          <div>
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
                יוצר תיאור, יתרונות, חסרונות ותכונות באמצעות AI
              </div>
            </div>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="הזן תיאור של המודל"
              className="h-32"
            />
          </div>

          <div>
            <Label>תכונות</Label>
            <Textarea
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              dir="rtl"
              placeholder="הזן את התכונות של המודל"
            />
          </div>

          <div>
            <Label>יתרונות</Label>
            <Textarea
              value={formData.pros}
              onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
              dir="rtl"
              placeholder="הזן את היתרונות של המודל"
            />
          </div>

          <div>
            <Label>חסרונות</Label>
            <Textarea
              value={formData.cons}
              onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
              dir="rtl"
              placeholder="הזן את החסרונות של המודל"
            />
          </div>

          <div>
            <Label>מודל מחיר</Label>
            <Input
              value={formData.pricing_model}
              onChange={(e) => setFormData(prev => ({ ...prev, pricing_model: e.target.value }))}
              dir="rtl"
              placeholder="הזן את מודל המחיר"
            />
          </div>

          <div>
            <Label>סוג מחיר</Label>
            <Input
              value={formData.pricing_type}
              onChange={(e) => setFormData(prev => ({ ...prev, pricing_type: e.target.value }))}
              dir="rtl"
              placeholder="הזן את סוג המחיר"
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
              checked={formData.show_in_home}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_home: checked }))}
            />
            <Label>הצג בדף הבית</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {id ? 'שמור שינויים' : 'צור מודל'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/models')}>
              ביטול
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
