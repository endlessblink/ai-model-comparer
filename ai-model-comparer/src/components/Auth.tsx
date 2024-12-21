import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        return
      }
      
      if (session?.user) {
        console.log('Active session found:', {
          id: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata.provider
        })
        await checkAdminStatus(session.user.id)
      } else {
        console.log('No active session')
      }
    }
    
    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, {
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata.provider
        } : null
      })

      if (event === 'SIGNED_IN' && session?.user) {
        await checkAdminStatus(session.user.id)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('Profile data:', profile)

      if (profile?.is_admin) {
        navigate('/admin')
      } else {
        toast({
          title: "אין גישה",
          description: "אין לך הרשאות מנהל",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      toast({
        title: "שגיאה",
        description: "שגיאה בבדיקת הרשאות",
        variant: "destructive"
      })
    }
  }

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true)
      console.log('Starting GitHub OAuth flow...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:5173',
          scopes: 'read:user user:email',
        }
      })

      if (error) {
        console.error('OAuth error:', error)
        throw error
      }

      console.log('OAuth initiated:', data)
      
      // The user will be redirected to GitHub here
      
    } catch (error) {
      console.error('Error initiating login:', error)
      toast({
        title: "שגיאה",
        description: "שגיאה בהתחברות עם GitHub",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: "שגיאה",
        description: "שגיאה בהתנתקות",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {supabase.auth.getSession() ? (
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⚪</span>
              מתנתק...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              התנתק
            </>
          )}
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⚪</span>
              מתחבר...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              התחבר עם GitHub
            </>
          )}
        </Button>
      )}
    </>
  )
}
