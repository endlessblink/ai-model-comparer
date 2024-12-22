import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Card, CardContent } from '@/components/ui/card';
import { ModelData, SECTION_HEADERS } from '@/types/modelTypes';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODEL_CATEGORIES } from '@/lib/constants';

interface FormData {
  name: string
  description: string
  category: string
  features: string
  pros: string
  cons: string
  tags: string[]
  pricing_model: string
  pricing_type: string
  api_available: boolean
  featured: boolean
}

export default function AddModel() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    features: '',
    pros: '',
    cons: '',
    tags: [],
    pricing_model: 'free',
    pricing_type: 'one-time',
    api_available: false,
    featured: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    // Split by comma, trim whitespace, and filter out empty strings
    const tags = value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const requiredFields = ['name', 'category', 'description', 'features', 'pros', 'cons'] as const;
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'שדה חובה';
      }
    });

    // Category validation
    if (!MODEL_CATEGORIES.includes(formData.category)) {
      newErrors.category = 'קטגוריה לא תקינה';
    }

    // Pricing model validation
    if (!['free', 'freemium', 'paid', 'enterprise'].includes(formData.pricing_model)) {
      newErrors.pricing_model = 'מודל תמחור לא תקין';
    }

    // Pricing type validation
    if (!['one-time', 'subscription', 'usage-based'].includes(formData.pricing_type)) {
      newErrors.pricing_type = 'סוג תמחור לא תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא למלא את כל שדות החובה"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Format the data according to the database schema
      const modelData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        features: formData.features.trim(),
        pros: formData.pros.trim(),
        cons: formData.cons.trim(),
        tags: Array.isArray(formData.tags) ? formData.tags : [], // Ensure it's an array
        pricing_model: formData.pricing_model,
        pricing_type: formData.pricing_type,
        api_available: formData.api_available,
        featured: formData.featured
      };

      console.log('Submitting model data:', modelData);

      // Insert the model data
      const { data, error } = await supabase
        .from('ai_models')
        .insert([modelData])
        .select('*');  // Return all columns of the inserted row

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully added model:', data);

      toast({
        title: "הצלחה",
        description: "המודל נוסף בהצלחה"
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: error instanceof Error ? error.message : "שגיאה בהוספת המודל"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <GradientHeading as="h1" className="text-4xl text-center mb-12">
        הוסף מודל חדש
      </GradientHeading>
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{SECTION_HEADERS.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="category">{SECTION_HEADERS.category}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="description">{SECTION_HEADERS.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="features">{SECTION_HEADERS.features}</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  className={errors.features ? 'border-red-500' : ''}
                  placeholder="הזן כל תכונה בשורה חדשה"
                />
                {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
              </div>

              <div>
                <Label htmlFor="pros">{SECTION_HEADERS.pros}</Label>
                <Textarea
                  id="pros"
                  value={formData.pros}
                  onChange={(e) => handleInputChange('pros', e.target.value)}
                  className={errors.pros ? 'border-red-500' : ''}
                  placeholder="הזן כל יתרון בשורה חדשה"
                />
                {errors.pros && <p className="text-red-500 text-sm">{errors.pros}</p>}
              </div>

              <div>
                <Label htmlFor="cons">{SECTION_HEADERS.cons}</Label>
                <Textarea
                  id="cons"
                  value={formData.cons}
                  onChange={(e) => handleInputChange('cons', e.target.value)}
                  className={errors.cons ? 'border-red-500' : ''}
                  placeholder="הזן כל חיסרון בשורה חדשה"
                />
                {errors.cons && <p className="text-red-500 text-sm">{errors.cons}</p>}
              </div>

              <div>
                <Label htmlFor="tags">{SECTION_HEADERS.tags}</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="הפרד תגיות בפסיקים"
                />
              </div>

              <div>
                <Label htmlFor="pricing_model">{SECTION_HEADERS.pricing_model}</Label>
                <Select
                  value={formData.pricing_model}
                  onValueChange={(value: 'free' | 'freemium' | 'paid' | 'enterprise') => handleSelectChange('pricing_model', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="free">חינמי</SelectItem>
                      <SelectItem value="freemium">פרימיום</SelectItem>
                      <SelectItem value="paid">בתשלום</SelectItem>
                      <SelectItem value="enterprise">ארגוני</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricing_type">{SECTION_HEADERS.pricing_type}</Label>
                <Select
                  value={formData.pricing_type}
                  onValueChange={(value: 'one-time' | 'subscription' | 'usage-based') => handleSelectChange('pricing_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="one-time">חד פעמי</SelectItem>
                      <SelectItem value="subscription">מנוי</SelectItem>
                      <SelectItem value="usage-based">לפי שימוש</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center px-[25px] py-6 mb-6 rounded-md">
                <Switch
                  checked={formData.api_available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, api_available: checked }))}
                />
                <label className="mr-2">API זמין</label>
              </div>

              <div className="flex items-center px-[25px] py-6 mb-6 rounded-md">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <label className="mr-2">מודל מוצג בדף הבית</label>
              </div>

              <div className="flex space-x-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  type="button"
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  type="button"
                >
                  {isLoading ? 'שומר...' : 'שמור'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
