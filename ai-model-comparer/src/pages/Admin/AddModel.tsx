import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateModelData } from '@/utils/aiDataGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModelData } from '@/types/modelTypes';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SECTION_HEADERS } from '../../types/modelTypes';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddModel() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [modelName, setModelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedData, setGeneratedData] = useState<ModelData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    features: '',
    pros: '',
    cons: '',
    pricing: {
      free_tier: '',
      paid_tier: '',
      enterprise: ''
    },
    useCases: '',
    alternatives: '',
    api_available: false,
    sourceDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם המודל הוא שדה חובה';
    }
    if (!formData.category) {
      newErrors.category = 'קטגוריה היא שדה חובה';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'תיאור הוא שדה חובה';
    }
    if (!formData.features.trim()) {
      newErrors.features = 'תכונות הן שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateData = async () => {
    if (!modelName) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא להזין שם מודל"
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateModelData(modelName);
      console.log('Generated data:', data);
      setGeneratedData(data);

      // Populate form fields with generated data
      const newFormData = {
        name: data.name || '',
        category: data.category || 'יצירת תמונות',
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features.join('\n') : '',
        pros: Array.isArray(data.pros) ? data.pros.join('\n') : '',
        cons: Array.isArray(data.cons) ? data.cons.join('\n') : '',
        pricing: {
          free_tier: data.pricing?.free_tier || '',
          paid_tier: data.pricing?.paid_tier || '',
          enterprise: data.pricing?.enterprise || ''
        },
        useCases: Array.isArray(data.useCases) ? data.useCases.join('\n') : '',
        alternatives: Array.isArray(data.alternatives) ? data.alternatives.join('\n') : '',
        api_available: data.api_available || false,
        sourceDate: data.sourceDate || new Date().toISOString().split('T')[0]
      };

      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating data:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: error instanceof Error ? error.message : "שגיאה בלתי צפויה"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא למלא את כל שדות החובה"
      });
      return;
    }

    try {
      const modelData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        features: formData.features.split('\n').filter(line => line.trim()),
        pros: formData.pros.split('\n').filter(line => line.trim()),
        cons: formData.cons.split('\n').filter(line => line.trim()),
        pricing: {
          free_tier: formData.pricing.free_tier,
          paid_tier: formData.pricing.paid_tier,
          enterprise: formData.pricing.enterprise
        },
        useCases: formData.useCases.split('\n').filter(line => line.trim()),
        alternatives: formData.alternatives.split('\n').filter(line => line.trim()),
        api_available: formData.api_available,
        sourceDate: formData.sourceDate
      };

      const { error } = await supabase.from('ai_models').insert([modelData]);

      if (error) throw error;

      toast({
        title: 'הצלחה',
        description: 'המודל נשמר בהצלחה',
      });

      navigate('/compare');
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: error instanceof Error ? error.message : "שגיאה בשמירת הנתונים"
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "נא למלא את כל שדות החובה"
        });
        return;
      }

      const modelData: ModelData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        features: formData.features.split('\n').filter(line => line.trim()),
        pros: formData.pros.split('\n').filter(line => line.trim()),
        cons: formData.cons.split('\n').filter(line => line.trim()),
        pricing: {
          free_tier: formData.pricing.free_tier,
          paid_tier: formData.pricing.paid_tier,
          enterprise: formData.pricing.enterprise
        },
        useCases: formData.useCases.split('\n').filter(line => line.trim()),
        alternatives: formData.alternatives.split('\n').filter(line => line.trim()),
        api_available: formData.api_available,
        sourceDate: formData.sourceDate
      };

      const { error } = await supabase.from('ai_models').insert([modelData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Model has been added successfully',
      });

      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        features: '',
        pros: '',
        cons: '',
        pricing: {
          free_tier: '',
          paid_tier: '',
          enterprise: ''
        },
        useCases: '',
        alternatives: '',
        api_available: false,
        sourceDate: new Date().toISOString().split('T')[0]
      });
      setModelName('');
      setGeneratedData(null);
      
      // Navigate to models list
      navigate('/admin/models');
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add model',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">הוספת מודל AI חדש</h1>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
                    {SECTION_HEADERS.name} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="category" className={errors.category ? 'text-destructive' : ''}>
                    {SECTION_HEADERS.category} *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="יצירת תמונות">יצירת תמונות</SelectItem>
                        <SelectItem value="עיבוד טקסט">עיבוד טקסט</SelectItem>
                        <SelectItem value="עיבוד קול">עיבוד קול</SelectItem>
                        <SelectItem value="עיבוד וידאו">עיבוד וידאו</SelectItem>
                        <SelectItem value="אחר">אחר</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className={errors.description ? 'text-destructive' : ''}>
                    {SECTION_HEADERS.description} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div>
                  <Label>{SECTION_HEADERS.features}</Label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    placeholder="הזן תכונות, כל אחת בשורה חדשה"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="free_tier">{SECTION_HEADERS.free_tier}</Label>
                    <Input
                      id="free_tier"
                      value={formData.pricing.free_tier}
                      onChange={(e) => handleInputChange('pricing.free_tier', e.target.value)}
                      placeholder="חינמי"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paid_tier">{SECTION_HEADERS.paid_tier}</Label>
                    <Input
                      id="paid_tier"
                      value={formData.pricing.paid_tier}
                      onChange={(e) => handleInputChange('pricing.paid_tier', e.target.value)}
                      placeholder="בתשלום"
                    />
                  </div>
                  <div>
                    <Label htmlFor="enterprise">{SECTION_HEADERS.enterprise}</Label>
                    <Input
                      id="enterprise"
                      value={formData.pricing.enterprise}
                      onChange={(e) => handleInputChange('pricing.enterprise', e.target.value)}
                      placeholder="ארגוני"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="api_available">API זמין</Label>
                  <input
                    type="checkbox"
                    id="api_available"
                    checked={formData.api_available}
                    onChange={(e) => handleInputChange('api_available', e.target.checked.toString())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{SECTION_HEADERS.pros}</Label>
                    <Textarea
                      value={formData.pros}
                      onChange={(e) => handleInputChange('pros', e.target.value)}
                      placeholder="הזן יתרונות, כל אחד בשורה חדשה"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>{SECTION_HEADERS.cons}</Label>
                    <Textarea
                      value={formData.cons}
                      onChange={(e) => handleInputChange('cons', e.target.value)}
                      placeholder="הזן חסרונות, כל אחד בשורה חדשה"
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <Label>{SECTION_HEADERS.useCases}</Label>
                  <Textarea
                    value={formData.useCases}
                    onChange={(e) => handleInputChange('useCases', e.target.value)}
                    placeholder="הזן שימושים, כל אחד בשורה חדשה"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>{SECTION_HEADERS.alternatives}</Label>
                  <Textarea
                    value={formData.alternatives}
                    onChange={(e) => handleInputChange('alternatives', e.target.value)}
                    placeholder="הזן חלופות, כל אחד בשורה חדשה"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'שומר...' : 'שמור'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {showPreview && (
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>תצוגה מקדימה</DialogTitle>
                <DialogDescription>
                  אנא בדוק את הנתונים לפני השמירה
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{SECTION_HEADERS.name}</h3>
                  <p>{generatedData?.name}</p>
                </div>

                <div>
                  <h3 className="font-medium">{SECTION_HEADERS.description}</h3>
                  <p>{generatedData?.description}</p>
                </div>

                {generatedData?.features?.length > 0 && (
                  <div>
                    <h3 className="font-medium">{SECTION_HEADERS.features}</h3>
                    <ul className="list-disc pl-5">
                      {generatedData.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-medium">{SECTION_HEADERS.pricing}</h3>
                  <div className="space-y-2">
                    {generatedData?.pricing?.free_tier && (
                      <p>{SECTION_HEADERS.free_tier}: {generatedData.pricing.free_tier}</p>
                    )}
                    {generatedData?.pricing?.paid_tier && (
                      <p>{SECTION_HEADERS.paid_tier}: {generatedData.pricing.paid_tier}</p>
                    )}
                    {generatedData?.pricing?.enterprise && (
                      <p>{SECTION_HEADERS.enterprise}: {generatedData.pricing.enterprise}</p>
                    )}
                  </div>
                </div>

                {generatedData?.pros?.length > 0 && (
                  <div>
                    <h3 className="font-medium">{SECTION_HEADERS.pros}</h3>
                    <ul className="list-disc pl-5">
                      {generatedData.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedData?.cons?.length > 0 && (
                  <div>
                    <h3 className="font-medium">{SECTION_HEADERS.cons}</h3>
                    <ul className="list-disc pl-5">
                      {generatedData.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedData?.useCases?.length > 0 && (
                  <div>
                    <h3 className="font-medium">{SECTION_HEADERS.useCases}</h3>
                    <ul className="list-disc pl-5">
                      {generatedData.useCases.map((useCase, index) => (
                        <li key={index}>{useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedData?.alternatives?.length > 0 && (
                  <div>
                    <h3 className="font-medium">{SECTION_HEADERS.alternatives}</h3>
                    <ul className="list-disc pl-5">
                      {generatedData.alternatives.map((alternative, index) => (
                        <li key={index}>{alternative}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSaveToDatabase}
                  disabled={isLoading}
                >
                  {isLoading ? "שומר..." : "אישור ושמירה"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
