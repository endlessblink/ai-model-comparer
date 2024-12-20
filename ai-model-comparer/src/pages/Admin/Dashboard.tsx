import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AIModel, ModelCategory } from '@/data/models'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בטעינת המודלים"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddModel = () => {
    navigate('/admin/add')
  }

  const handleEditModel = (model: AIModel) => {
    navigate(`/admin/edit/${model.id}`)
  }

  const handleDeleteModel = async (model: AIModel) => {
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את ${model.name}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('ai_models')
        .update({ is_deleted: true })
        .eq('id', model.id)

      if (error) throw error

      toast({
        title: "הצלחה",
        description: "המודל נמחק בהצלחה"
      })

      // Refresh the models list
      fetchModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה במחיקת המודל"
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול מודלים</h1>
        <Button onClick={handleAddModel}>
          הוסף מודל חדש
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">טוען...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Card key={model.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{model.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditModel(model)}
                    >
                      ערוך
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteModel(model)}
                    >
                      מחק
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {model.category}
                    </span>
                    {model.api_available && (
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                        API זמין
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
