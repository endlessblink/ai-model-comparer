const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-right">
            נבנה עם ❤️ עבור קהילת ה-AI הישראלית
          </p>
        </div>
        <nav className="flex items-center space-x-4 space-x-reverse">
          <a href="/about" className="text-sm underline underline-offset-4">
            אודות
          </a>
          <a href="/contact" className="text-sm underline underline-offset-4">
            צור קשר
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;