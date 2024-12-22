import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AIModel, ModelCategory } from '@/data/models'
import { supabase } from '@/lib/supabase'
import { GradientHeading } from '@/components/ui/gradient-heading'

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        navigate('/');
        return;
      }

      fetchModels();
    };

    checkAuth();
  }, [navigate]);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Models from database:', data);
      
      // Remove duplicates based on name
      const uniqueModels = data?.reduce((acc: AIModel[], current: AIModel) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []) || [];

      console.log('Unique models:', uniqueModels);
      setModels(uniqueModels);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בטעינת המודלים"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModel = () => {
    navigate('/admin/add')
  }

  const handleEditModel = (model: AIModel) => {
    navigate(`/admin/edit/${model.id}`)
  }

  const handleDeleteModel = async (model: AIModel) => {
    if (!window.confirm(`האם אתה בטוח שברצון למחוק את ${model.name}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('ai_models')
        .delete()
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
    <div className="container mx-auto py-8 px-4">
      <GradientHeading as="h1" className="text-4xl text-center mb-12">
        ניהול מודלים
      </GradientHeading>
      <div className="flex justify-between items-center mb-6">
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
