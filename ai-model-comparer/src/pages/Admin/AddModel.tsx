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
    pricing: '',
    useCases: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        category: 'יצירת תמונות', // Default category for Midjourney
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features.join('\n') : '',
        pros: Array.isArray(data.pros) ? data.pros.join('\n') : '',
        cons: Array.isArray(data.cons) ? data.cons.join('\n') : '',
        pricing: data.pricing?.free_tier ? 'freemium' : 'paid',
        useCases: Array.isArray(data.useCases) ? data.useCases.join('\n') : '',
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
    try {
      const modelData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        features: formData.features.split('\n').filter(line => line.trim()),
        pros: formData.pros.split('\n').filter(line => line.trim()),
        cons: formData.cons.split('\n').filter(line => line.trim()),
        pricing: {
          free_tier: formData.pricing === 'free' ? 'Available' : undefined,
          paid_tier: formData.pricing === 'paid' ? 'Available' : undefined,
          enterprise: formData.pricing === 'enterprise' ? 'Available' : undefined,
        },
        use_cases: formData.useCases.split('\n').filter(line => line.trim()),
        last_updated: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        api_available: true
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
      // Validate required fields
      if (!formData.name || !formData.category || !formData.description) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields (name, category, and description)"
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
          free_tier: formData.pricing === 'free' ? 'Available' : undefined,
          paid_tier: formData.pricing === 'paid' ? 'Available' : undefined,
          enterprise: formData.pricing === 'enterprise' ? 'Available' : undefined,
        },
        useCases: formData.useCases.split('\n').filter(line => line.trim()),
        alternatives: [],
        sourceDate: new Date().toISOString(),
        api_available: true
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
        pricing: '',
        useCases: '',
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
    <div className="container mx-auto py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>שם המודל</Label>
            <div className="flex gap-4">
              <Input
                className="flex-1"
                placeholder="הכנס את שם המודל"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
              <Button
                onClick={handleGenerateData}
                disabled={isLoading}
              >
                {isLoading ? 'מייצר...' : 'יצירה אוטומטית'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>{SECTION_HEADERS.name}</Label>
              <Input
                placeholder="שם המודל"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{SECTION_HEADERS.category}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="מודלי שפה">מודלי שפה</SelectItem>
                    <SelectItem value="יצירת תמונות">יצירת תמונות</SelectItem>
                    <SelectItem value="יצירת קוד">יצירת קוד</SelectItem>
                    <SelectItem value="עיבוד קול">עיבוד קול</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{SECTION_HEADERS.description}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>{SECTION_HEADERS.features}</Label>
              <Textarea
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                placeholder="הזן תכונות, כל אחת בשורה חדשה"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{SECTION_HEADERS.pros}</Label>
                <Textarea
                  value={formData.pros}
                  onChange={(e) => handleInputChange('pros', e.target.value)}
                  placeholder="הזן יתרונות, כל אחד בשורה חדשה"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>{SECTION_HEADERS.cons}</Label>
                <Textarea
                  value={formData.cons}
                  onChange={(e) => handleInputChange('cons', e.target.value)}
                  placeholder="הזן חסרונות, כל אחד בשורה חדשה"
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricing">תמחור</Label>
                <Select
                  value={formData.pricing}
                  onValueChange={(value) => {
                    console.log('Updating pricing with selected value:', value);
                    setFormData(prev => ({ ...prev, pricing: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תמחור" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">חינמי</SelectItem>
                    <SelectItem value="freemium">פרימיום</SelectItem>
                    <SelectItem value="paid">בתשלום</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{SECTION_HEADERS.useCases}</Label>
                <Textarea
                  value={formData.useCases}
                  onChange={(e) => handleInputChange('useCases', e.target.value)}
                  placeholder="הזן שימושים, כל אחד בשורה חדשה"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'שומר...' : 'שמור'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showPreview && generatedData && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generated Data Preview</DialogTitle>
              <DialogDescription>
                Review the generated data before confirming
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium">{SECTION_HEADERS.name}</h3>
                <p>{generatedData.name}</p>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.description}</h3>
                <p>{generatedData.description}</p>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.features}</h3>
                <ul className="list-disc pl-5">
                  {generatedData.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.pricing}</h3>
                <div className="space-y-2">
                  {generatedData.pricing.free_tier && (
                    <p>{SECTION_HEADERS.free_tier}: {generatedData.pricing.free_tier}</p>
                  )}
                  {generatedData.pricing.paid_tier && (
                    <p>{SECTION_HEADERS.paid_tier}: {generatedData.pricing.paid_tier}</p>
                  )}
                  {generatedData.pricing.enterprise && (
                    <p>{SECTION_HEADERS.enterprise}: {generatedData.pricing.enterprise}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.pros}</h3>
                <ul className="list-disc pl-5">
                  {generatedData.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.cons}</h3>
                <ul className="list-disc pl-5">
                  {generatedData.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.useCases}</h3>
                <ul className="list-disc pl-5">
                  {generatedData.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium">{SECTION_HEADERS.alternatives}</h3>
                <ul className="list-disc pl-5">
                  {generatedData.alternatives.map((alternative, index) => (
                    <li key={index}>{alternative}</li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="min-w-[100px] hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ביטול
              </Button>
              <Button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await handleSaveToDatabase();
                    setShowPreview(false);
                  } catch (error) {
                    console.error('Error saving data:', error);
                    toast({
                      variant: "destructive",
                      title: "שגיאה",
                      description: "שגיאה בשמירת הנתונים"
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isLoading ? "שומר..." : "אישור ושמירה"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
