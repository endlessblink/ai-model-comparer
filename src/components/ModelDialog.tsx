import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { AIModel } from '@/types/models'
import { categoryNames } from '@/data/models'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

const modelSchema = z.object({
  name: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים'),
  description: z.string().min(10, 'התיאור חייב להכיל לפחות 10 תווים'),
  category: z.enum(['llm', 'image', 'audio', 'video', 'multimodal'] as const),
  pricing_model: z.enum(['free', 'paid', 'subscription', 'usage_based', 'enterprise'] as const),
  api_available: z.boolean(),
  provider: z.string().min(2, 'שם הספק חייב להכיל לפחות 2 תווים'),
  tags: z.array(z.string().min(1, 'תג לא יכול להיות ריק')).min(1, 'יש להזין לפחות תג אחד'),
  url: z.string().optional()
})

type ModelFormValues = z.infer<typeof modelSchema>

interface ModelDialogProps {
  model?: AIModel
  onSuccess?: () => void
  trigger: React.ReactNode
}

export function ModelDialog({ model, onSuccess, trigger }: ModelDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: model || {
      name: '',
      description: '',
      category: 'llm',
      pricing_model: 'free',
      api_available: false,
      provider: '',
      tags: [],
      url: ''
    },
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateContent = async () => {
    try {
      setIsGenerating(true)
      const formValues = form.getValues()
      console.log('Form values:', formValues)

      if (!formValues.name) {
        toast({
          title: 'שגיאה',
          description: 'יש להזין שם מודל לפני יצירת התוכן',
          variant: 'destructive',
        })
        return
      }

      const modelData = await generateModelContent({
        modelName: formValues.name,
        modelUrl: formValues.url || window.location.href,
        category: formValues.category
      }, {
        maxRetries: 3,
        backoffMS: 1000,
        timeout: 30000
      })
      
      console.log('Generated model data:', modelData)
      
      if (modelData && modelData.description) {
        form.setValue('description', modelData.description)
        toast({
          title: 'התוכן נוצר בהצלחה',
          variant: 'success',
        })
      } else {
        throw new Error('No description received from the API')
      }
    } catch (error: any) {
      console.error('Error generating content:', error)
      
      let errorMessage = 'אירעה שגיאה בעת יצירת התוכן. אנא נסה שוב.'
      
      if (error.status === 400) {
        errorMessage = 'נתונים לא תקינים - אנא בדוק את הקלט שלך'
      } else if (error.status === 401) {
        errorMessage = 'נדרשת הזדהות - אנא התחבר מחדש'
      } else if (error.status === 403) {
        errorMessage = 'אין לך הרשאה לבצע פעולה זו'
      } else if (error.status === 429) {
        errorMessage = 'יותר מדי בקשות - אנא נסה שוב מאוחר יותר'
      } else if (error.status >= 500) {
        errorMessage = 'שגיאת שרת - הצוות שלנו קיבל התראה'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: 'שגיאה',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  async function onSubmit(values: ModelFormValues) {
    try {
      if (!isSupabaseConfigured()) {
        toast({ 
          title: 'שגיאת תצורה',
          description: 'החיבור למסד הנתונים לא הוגדר כראוי',
          variant: 'destructive'
        })
        return
      }

      if (model) {
        const { error } = await supabase
          .from('ai_models')
          .update(values)
          .eq('id', model.id)
        
        if (error) throw error
        toast({ 
          title: 'המודל עודכן בהצלחה',
          variant: 'success'
        })
      } else {
        const { error } = await supabase
          .from('ai_models')
          .insert([values])
        
        if (error) throw error
        toast({ 
          title: 'המודל נוצר בהצלחה',
          variant: 'success'
        })
      }

      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving model:', error)
      toast({ 
        title: 'שגיאה בשמירת המודל',
        description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {model ? 'עריכת מודל' : 'הוספת מודל חדש'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם המודל</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קטגוריה</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(categoryNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricing_model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מודל תמחור</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מודל תמחור" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">חינמי</SelectItem>
                      <SelectItem value="paid">בתשלום</SelectItem>
                      <SelectItem value="subscription">מנוי</SelectItem>
                      <SelectItem value="usage_based">לפי שימוש</SelectItem>
                      <SelectItem value="enterprise">ארגוני</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="api_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>API זמין</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ספק</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>כתובת URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תגיות</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      <Input
                        placeholder="הוסף תגית ולחץ Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.currentTarget
                            const value = input.value.trim()
                            if (value && !field.value.includes(value)) {
                              field.onChange([...field.value, value])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      {field.value.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(field.value.filter((_, i) => i !== index))
                            }}
                            className="hover:text-purple-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                ביטול
              </Button>
              <Button type="submit">
                {model ? 'עדכון' : 'הוספה'}
              </Button>
              <Button
                type="button"
                onClick={generateContent}
                disabled={isGenerating}
              >
                {isGenerating ? 'מייצר...' : 'ייצר תוכן'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}