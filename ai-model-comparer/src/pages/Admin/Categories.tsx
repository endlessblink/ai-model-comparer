import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'
import { Database } from '@/lib/database.types'
import { Code2, Image, Video, Music, Mic, ScanFace, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toaster'
import AddCategoryElement from '@/components/admin/categories/AddCategoryElement'

type Category = Database['public']['Tables']['categories']['Row']

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'text':
      return <FileText className="w-5 h-5" />;
    case 'music':
      return <Music className="w-5 h-5" />;
    case 'narration':
      return <Mic className="w-5 h-5" />;
    case 'lipsync':
      return <ScanFace className="w-5 h-5" />;
    case 'code':
      return <Code2 className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    console.log('Categories component mounted')
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    console.log('Fetching categories...')
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      console.log('Categories response:', { data, error })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchCategories()
    } catch (err) {
      console.error('Error updating category:', err)
      setError(err instanceof Error ? err.message : 'Failed to update category')
    }
  }

  if (loading) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Loading...</div></div>
  if (error) return <div className="min-h-screen"><Header /><div className="container mx-auto p-4">Error: {error}</div></div>

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <GradientHeading as="h1" className="text-4xl">
            ניהול קטגוריות
          </GradientHeading>
          <Button onClick={() => setShowAddDialog(true)}>
            קטגוריה חדשה
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative rounded-3xl transition-all duration-500 hover:translate-y-[-4px] cursor-pointer bg-card hover:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
              onClick={() => navigate(`/admin/categories/${category.id}`)}
            >
              <div className="relative rounded-3xl p-8">
                <div className="relative">
                  {/* Header with Category Name and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-semibold">{category.name}</span>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/10 to-background dark:from-primary/10 dark:via-secondary/15 dark:to-background text-primary shadow-sm">
                      {category.icon ? (
                        <span className="text-2xl">{category.icon}</span>
                      ) : (
                        getCategoryIcon(category.name)
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6">
                    {category.description || 'מודלים ליצירת ' + category.name}
                  </p>

                  {/* Featured Models Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">מודלים מובילים</h4>
                    <p className="text-sm text-muted-foreground">
                      מודלים מובילים יתווספו בקרוב
                    </p>
                  </div>
                  
                  {/* Controls */}
                  <div className="border-t border-border pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_active}
                          onCheckedChange={() => toggleCategoryStatus(category.id, category.is_active)}
                        />
                        <Label className="text-sm">{category.is_active ? 'פעיל' : 'לא פעיל'}</Label>
                      </div>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/categories/${category.id}`);
                        }}
                      >
                        ערוך
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#0F0B1F] border-[#1E1B4B] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold bg-gradient-to-br from-[rgba(138,116,249,0.9)] via-[rgba(147,151,255,0.8)] to-[rgba(138,116,249,0.7)] bg-clip-text text-transparent text-center">
              קטגוריה חדשה
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground text-sm mb-4">
            הוסף קטגוריה חדשה למערכת
          </div>
          <AddCategoryElement onSubmit={async (name, description, icon) => {
            try {
              const { error } = await supabase
                .from('categories')
                .insert({
                  name,
                  description,
                  icon,
                  created_at: new Date().toISOString()
                });

              if (error) throw error;

              toast({
                title: "הצלחה",
                description: "הקטגוריה נוספה בהצלחה",
              });

              setShowAddDialog(false);
              fetchCategories();
            } catch (err) {
              console.error('Error adding category:', err);
              toast({
                variant: "destructive",
                title: "שגיאה",
                description: "אירעה שגיאה בהוספת הקטגוריה",
              });
            }
          }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
