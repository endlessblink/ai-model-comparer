import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

export default function AdminSetup() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/admin/setup'
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בהתחברות"
      })
    }
  }

  const makeAdmin = async () => {
    if (!user) return

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', user.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              is_admin: true
            }
          ])

        if (error) throw error
      }

      toast({
        title: "הצלחה",
        description: "הוגדרת בהצלחה כמנהל"
      })

      // Redirect to admin dashboard
      navigate('/admin')
    } catch (error) {
      console.error('Error making admin:', error)
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בהגדרת הרשאות מנהל"
      })
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">טוען...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>הגדרת מנהל מערכת</CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              <p>יש להתחבר תחילה כדי להגדיר הרשאות מנהל</p>
              <Button onClick={handleLogin}>
                התחבר עם GitHub
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>מחובר כ: {user.email}</p>
              <Button onClick={makeAdmin}>
                הגדר כמנהל מערכת
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
