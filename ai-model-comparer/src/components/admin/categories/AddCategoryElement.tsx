import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateModelContent } from '@/lib/anthropic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddCategoryElementProps {
  onSubmit: (name: string, description: string, icon: string) => void;
}

export default function AddCategoryElement({ onSubmit }: AddCategoryElementProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'טקסט',
    useAI: false
  });

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
      try {
        description = await generateModelContent(`כתוב תיאור מפורט (2-3 פסקאות) בעברית על קטגוריית ${formData.name} בהקשר של מודלים של בינה מלאכותית. התייחס ליכולות, שימושים ויתרונות של מודלים בתחום זה.`);
      } catch (error) {
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה ביצירת התוכן האוטומטי",
          variant: "destructive",
        });
        return;
      } finally {
        setIsGenerating(false);
      }
    }

    onSubmit(formData.name, description || formData.description, formData.icon);
    setFormData({ name: '', description: '', icon: 'טקסט', useAI: false });
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
    try {
      const content = await generateModelContent(`כתוב תיאור מפורט (2-3 פסקאות) בעברית על קטגוריית ${formData.name} בהקשר של מודלים של בינה מלאכותית. התייחס ליכולות, שימושים ויתרונות של מודלים בתחום זה.`);
      setFormData(prev => ({ ...prev, description: content }));
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת התוכן האוטומטי",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-right block">שם</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-[rgba(30,27,75,0.4)] border-white/[0.03] text-white/90"
            placeholder="הזן שם קטגוריה..."
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="description" className="text-right block">תיאור</Label>
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
            className="bg-[rgba(30,27,75,0.4)] border-white/[0.03] text-white/90 min-h-[120px]"
            placeholder="תאר את הקטגוריה..."
            disabled={isGenerating}
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="text-right block">איקון</Label>
          <Select
            value={formData.icon}
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
          >
            <SelectTrigger className="bg-[rgba(30,27,75,0.4)] border-white/[0.03] text-white/90 text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="טקסט">טקסט</SelectItem>
              <SelectItem value="תמונה">תמונה</SelectItem>
              <SelectItem value="וידאו">וידאו</SelectItem>
              <SelectItem value="קול">קול</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between py-2">
          <Switch
            id="useAI"
            checked={formData.useAI}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useAI: checked }))}
            disabled={isGenerating}
          />
          <Label htmlFor="useAI" className="text-right">פעיל</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ name: '', description: '', icon: 'טקסט', useAI: false })}
            className="bg-transparent border-white/10 text-white/90 hover:bg-white/[0.03]"
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
}
