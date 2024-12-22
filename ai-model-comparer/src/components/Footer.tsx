import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            דף הבית
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            אודות
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            צור קשר
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().getFullYear()} AI Model Comparer. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}