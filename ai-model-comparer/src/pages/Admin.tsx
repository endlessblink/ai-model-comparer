import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getModels, addModel, updateModel, deleteModel, type AIModel, type ModelCategory, categoryNames, pricingModels, pricingTypes } from '@/data/models'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם המודל חייב להכיל לפחות 2 תווים",
  }),
  description: z.string().min(10, {
    message: "התיאור חייב להכיל לפחות 10 תווים",
  }),
  category: z.enum(['llm', 'image', 'video', 'music', 'narration', 'lipsync'] as const),
  features: z.array(z.string()),
  disadvantages: z.array(z.string()),
  usage_notes: z.string(),
  pricing: z.string(),
  pricing_model: z.enum(['free', 'freemium', 'paid', 'enterprise'] as const),
  pricing_type: z.enum(['one-time', 'subscription', 'usage-based'] as const),
  api_available: z.boolean().default(false),
  website_url: z.string().url().optional().or(z.literal('')),
  demo_url: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string())
})

type FormValues = z.infer<typeof formSchema>

export default function AdminPage() {
  const { toast } = useToast()
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('llm')
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const emptyModel: AIModel = {
    name: '',
    description: '',
    category: selectedCategory,
    features: [],
    disadvantages: [],
    usage_notes: '',
    pricing: '',
    api_available: false,
    last_updated: new Date().toISOString().split('T')[0],
    website_url: '',
    demo_url: ''
  }
  const [newModel, setNewModel] = useState<AIModel>(emptyModel)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: selectedCategory,
      features: [],
      disadvantages: [],
      usage_notes: "",
      pricing: "",
      pricing_model: "paid",
      pricing_type: "subscription",
      api_available: false,
      website_url: "",
      demo_url: "",
      tags: []
    },
  })

  useEffect(() => {
    fetchModels()
  }, [selectedCategory])

  const fetchModels = async () => {
    const data = await getModels(selectedCategory)
    setModels(data)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await addModel(values)
      form.reset()
      fetchModels()
      toast({
        title: "המודל נוסף בהצלחה",
        description: `המודל ${values.name} נוסף למאגר`,
      })
    } catch (error) {
      toast({
        title: "שגיאה בהוספת המודל",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      })
    }
  }

  const handleUpdateModel = async () => {
    if (!editingModel) return

    try {
      await updateModel(editingModel)
      setEditingModel(null)
      fetchModels()
      toast({
        title: "המודל עודכן בהצלחה",
        description: `המודל ${editingModel.name} עודכן במאגר`,
      })
    } catch (error) {
      toast({
        title: "שגיאה בעדכון המודל",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      })
    }
  }

  const handleDeleteModel = async (model: AIModel) => {
    if (!model.id) return

    try {
      await deleteModel(model.id)
      fetchModels()
      toast({
        title: "המודל נמחק בהצלחה",
        description: `המודל ${model.name} נמחק מהמאגר`,
      })
    } catch (error) {
      toast({
        title: "שגיאה במחיקת המודל",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">ניהול מודלים</h2>
        <p className="text-muted-foreground">
          הוספת מודל חדש למאגר
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>פרטי המודל</CardTitle>
                <CardDescription>
                  הזן את פרטי המודל החדש
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                            {(Object.keys(categoryNames) as ModelCategory[]).map((category) => (
                              <SelectItem key={category} value={category}>
                                {categoryNames[category]}
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
                      <FormLabel>תיאור המודל</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                            {(Object.keys(pricingModels) as Array<keyof typeof pricingModels>).map((model) => (
                              <SelectItem key={model} value={model}>
                                {pricingModels[model]}
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
                        <FormLabel>סוג תמחור</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר סוג תמחור" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(Object.keys(pricingTypes) as Array<keyof typeof pricingTypes>).map((type) => (
                              <SelectItem key={type} value={type}>
                                {pricingTypes[type]}
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
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>יתרונות (הפרד בפסיקים)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value.split(',').map(item => item.trim()).filter(Boolean));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disadvantages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>חסרונות (הפרד בפסיקים)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value.split(',').map(item => item.trim()).filter(Boolean));
                          }}
                        />
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
                      <FormLabel>תגיות (הפרד בפסיקים)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usage_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>הערות שימוש</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>קישור לאתר</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>קישור להדגמה</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit">הוסף מודל</Button>
          </form>
        </Form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {editingModel?.id === model.id ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateModel)} className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>עדכון מודל</CardTitle>
                        <CardDescription>
                          עדכן את פרטי המודל
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                    {(Object.keys(categoryNames) as ModelCategory[]).map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {categoryNames[category]}
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
                              <FormLabel>תיאור המודל</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
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
                                    {(Object.keys(pricingModels) as Array<keyof typeof pricingModels>).map((model) => (
                                      <SelectItem key={model} value={model}>
                                        {pricingModels[model]}
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
                                <FormLabel>סוג תמחור</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="בחר סוג תמחור" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {(Object.keys(pricingTypes) as Array<keyof typeof pricingTypes>).map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {pricingTypes[type]}
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
                          name="features"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>יתרונות (הפרד בפסיקים)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px]"
                                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    field.onChange(value.split(',').map(item => item.trim()).filter(Boolean));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="disadvantages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>חסרונות (הפרד בפסיקים)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px]"
                                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    field.onChange(value.split(',').map(item => item.trim()).filter(Boolean));
                                  }}
                                />
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
                              <FormLabel>תגיות (הפרד בפסיקים)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value?.join(', ') || ''}
                                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="usage_notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>הערות שימוש</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="website_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>קישור לאתר</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="demo_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>קישור להדגמה</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Button type="submit">עדכן מודל</Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>יתרונות</Label>
                    <ul className="list-disc list-inside">
                      {model.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>חסרונות</Label>
                    <ul className="list-disc list-inside">
                      {model.disadvantages.map((disadvantage, i) => (
                        <li key={i}>{disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      onClick={() => setEditingModel(model)}
                      className="flex-1"
                    >
                      ערוך
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteModel(model)}
                      className="flex-1"
                    >
                      מחק
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
