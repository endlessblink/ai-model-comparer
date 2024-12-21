import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { AIModel } from '@/types/models'
import { ModelDialog } from '@/components/ModelDialog'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [models, setModels] = useState<AIModel[]>([])
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    checkAdmin()
    fetchModels()
  }, [])

  async function checkAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      if (error || !data?.is_admin) {
        navigate('/')
        return
      }

      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin status:', error)
      navigate('/')
    }
  }

  async function fetchModels() {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('name')
      
      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({ 
        title: 'שגיאה בטעינת המודלים',
        variant: 'destructive'
      })
    }
  }

  async function handleDelete(model: AIModel) {
    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', model.id)

      if (error) throw error

      toast({ title: 'המודל נמחק בהצלחה' })
      fetchModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      toast({ 
        title: 'שגיאה במחיקת המודל',
        variant: 'destructive'
      })
    } finally {
      setModelToDelete(null)
    }
  }

  if (!isAdmin) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
          ניהול מודלים
        </h1>
        <ModelDialog
          onSuccess={fetchModels}
          trigger={
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              הוסף מודל חדש
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="p-6 bg-gray-900/50 border-gray-800">
            <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
            <p className="text-gray-400 mb-4">{model.description}</p>
            <div className="flex gap-2">
              <ModelDialog
                model={model}
                onSuccess={fetchModels}
                trigger={
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    ערוך
                  </Button>
                }
              />
              <Button 
                variant="destructive" 
                onClick={() => setModelToDelete(model)}
              >
                מחק
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!modelToDelete} onOpenChange={() => setModelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את המודל לצמיתות ולא ניתן יהיה לשחזר אותו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => modelToDelete && handleDelete(modelToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 