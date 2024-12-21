import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { fetchModelInfo } from '@/lib/claude'
import {
  type AIModel,
  type ModelCategory,
  categoryNames,
  pricingModels,
  pricingTypes,
  commonModelTags,
} from '@/data/models'

const modelSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  description: z.string().min(10, 'תיאור חייב להכיל לפחות 10 תווים'),
  category: z.enum(['llm', 'image', 'video', 'music', 'narration', 'lipsync'] as const),
  url: z.string().url('כתובת URL לא תקינה').optional().or(z.literal('')),
  icon: z.string().url('כתובת URL לא תקינה').optional().or(z.literal('')),
  features: z.array(z.string()).min(1, 'יש להזין לפחות תכונה אחת'),
  tags: z.array(z.string()).min(1, 'יש לבחור לפחות תג אחד'),
  pricing_model: z.enum(['free', 'freemium', 'paid', 'enterprise'] as const),
  pricing_type: z.enum(['free', 'one-time', 'subscription', 'usage-based'] as const),
  api_available: z.boolean().default(false),
})

type ModelFormData = z.infer<typeof modelSchema>

interface AddModelFormProps {
  initialData?: Partial<AIModel>
  onSubmit: (data: ModelFormData) => Promise<void>
  onCancel: () => void
}

export default function AddModelForm({ initialData, onSubmit, onCancel }: AddModelFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>(
    initialData?.category || 'llm'
  )

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || 'llm',
      url: initialData?.url || '',
      icon: initialData?.icon || '',
      features: initialData?.features || [],
      tags: initialData?.tags || [],
      pricing_model: initialData?.pricing_model || 'free',
      pricing_type: initialData?.pricing_type || 'free',
      api_available: initialData?.api_available || false,
    },
  })

  const handleAutoPopulate = async () => {
    const name = form.getValues('name')
    const url = form.getValues('url')
    
    if (!name) {
      form.setError('name', { message: 'נדרש שם כדי לאכלס נתונים אוטומטית' })
      return
    }

    setIsLoading(true)
    try {
      const modelInfo = await fetchModelInfo(name, url)
      if (modelInfo.category) {
        setSelectedCategory(modelInfo.category)
      }
      form.reset({
        ...form.getValues(),
        ...modelInfo,
      })
    } catch (error) {
      console.error('Error auto-populating:', error)
      form.setError('root', { message: 'שגיאה באכלוס אוטומטי' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: ModelFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting:', error)
      form.setError('root', { message: 'שגיאה בשמירת המודל' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם המודל</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#1a1a1a]" />
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
                  value={field.value}
                  onValueChange={(value: ModelCategory) => {
                    field.onChange(value)
                    setSelectedCategory(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#1a1a1a]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a]">
                    {Object.entries(categoryNames).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-24 bg-[#1a1a1a]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כתובת אתר</FormLabel>
                <FormControl>
                  <Input {...field} type="url" className="bg-[#1a1a1a]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כתובת אייקון</FormLabel>
                <FormControl>
                  <Input {...field} type="url" className="bg-[#1a1a1a]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>תגיות</FormLabel>
          <div className="flex flex-wrap gap-2">
            {commonModelTags[selectedCategory].map((tag) => (
              <Badge
                key={tag}
                variant={form.watch('tags').includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  form.watch('tags').includes(tag)
                    ? "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                    : "border-[#2a2a2a] hover:border-purple-500/30 hover:text-purple-300"
                }`}
                onClick={() => {
                  const currentTags = form.watch('tags')
                  const newTags = currentTags.includes(tag)
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag]
                  form.setValue('tags', newTags, { shouldValidate: true })
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pricing_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מודל תמחור</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#1a1a1a]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a]">
                    {Object.entries(pricingModels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name="pricing_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שיטת תשלום</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#1a1a1a]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a]">
                    {Object.entries(pricingTypes).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="api_available"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-[#2a2a2a] data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-gray-300">
                זמין כ-API
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'עדכון' : 'הוספה'}
            </Button>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAutoPopulate}
            disabled={isLoading}
            className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            אכלוס אוטומטי
          </Button>
        </div>
      </form>
    </Form>
  )
} 