import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GradientHeading } from "@/components/ui/gradient-heading"
import Header from '@/components/Header'

export default function Admin() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <GradientHeading as="h1" className="text-4xl text-center mb-12">
          ניהול האתר
        </GradientHeading>
        
        <div className="grid gap-6 max-w-xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">ניהול קטגוריות</h2>
            <p className="text-muted-foreground mb-4">
              יצירה, עריכה והפעלה/כיבוי של קטגוריות מודלים
            </p>
            <Button onClick={() => navigate('/admin/categories')}>
              נהל קטגוריות
            </Button>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">ניהול מודלים</h2>
            <p className="text-muted-foreground mb-4">
              הוספה ועריכה של מודלי AI
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/admin/models/new')}>
                הוסף מודל חדש
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/models')}>
                צפה במודלים
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
