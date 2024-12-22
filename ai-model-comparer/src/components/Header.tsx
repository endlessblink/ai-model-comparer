import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { session, signOut } = useAuth()

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white dark:bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-foreground hover:text-foreground/90 transition-colors">
            AI Model Comparer
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
              השוואת מודלים
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              אודות
            </Link>
            {session && (
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                ניהול
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/admin/add">
                <Button variant="outline" size="sm" className="hover:bg-accent">הוספת מודל חדש</Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-accent"
                onClick={() => signOut()}
              >
                התנתק
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hover:bg-accent">התחבר</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}