import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  const { session, signOut } = useAuth();

  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">AI Model Comparer</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/">השוואת מודלים</Link>
            {session && <Link to="/admin/update-models">ניהול מודלים</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <div className="flex gap-4">
              <Link to="/admin/add-model">
                <Button variant="outline">הוספת מודל חדש</Button>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>התנתק</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline">התחבר</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}