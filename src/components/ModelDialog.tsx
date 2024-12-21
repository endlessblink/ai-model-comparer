import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Model } from '@/types/models'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface ModelDialogProps {
  model?: Model
  onSuccess: () => void
  trigger: React.ReactNode
}

export function ModelDialog({ model, onSuccess, trigger }: ModelDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Model>>(model || {
    name: '',
    description: '',
    api_available: false,
    pricing: '',
    features: [],
    category: '',
    provider: '',
    release_date: '',
    model_size: '',
    training_data: '',
    license: '',
    use_cases: [],
    limitations: [],
    performance_metrics: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (model?.id) {
        // Update existing model
        const { error } = await supabase
          .from('models')
          .update(formData)
          .eq('id', model.id)

        if (error) throw error
        toast({ title: 'המודל עודכן בהצלחה' })
      } else {
        // Create new model
        const { error } = await supabase
          .from('models')
          .insert([formData])

        if (error) throw error
        toast({ title: 'המודל נוצר בהצלחה' })
      }

      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Error saving model:', error)
      toast({ 
        title: 'שגיאה בשמירת המודל',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם המודל</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">ספק</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">קטגוריה</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricing">מחיר</Label>
            <Input
              id="pricing"
              value={formData.pricing}
              onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
              required
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? 'שומר...' : model ? 'עדכן' : 'צור'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 