import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AIModel } from '@/types/models'
import { categoryNames } from '@/data/models'

const modelSchema = z.object({
  name: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים'),
  description: z.string().min(10, 'התיאור חייב להכיל לפחות 10 תווים'),
  category: z.enum(['llm', 'image', 'audio', 'video', 'multimodal'] as const),
  pricing_model: z.enum(['free', 'paid', 'subscription', 'usage_based', 'enterprise'] as const),
  api_available: z.boolean(),
  provider: z.string().min(2, 'שם הספק חייב להכיל לפחות 2 תווים'),
  tags: z.array(z.string()),
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
    },
  })

  async function onSubmit(values: ModelFormValues) {
    try {
      if (model) {
        const { error } = await supabase
          .from('models')
          .update(values)
          .eq('id', model.id)
        
        if (error) throw error
        toast({ title: 'המודל עודכן בהצלחה' })
      } else {
        const { error } = await supabase
          .from('models')
          .insert([values])
        
        if (error) throw error
        toast({ title: 'המודל נוצר בהצלחה' })
      }

      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving model:', error)
      toast({ 
        title: 'שגיאה בשמירת המודל',
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
                <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
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
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                ביטול
              </Button>
              <Button type="submit">
                {model ? 'שמור שינויים' : 'צור מודל'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 