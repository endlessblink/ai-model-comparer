import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code2, Image, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-32 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <h1 className="text-6xl font-bold text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#a78bfa] dark:via-[#818cf8] dark:to-[#a78bfa] tracking-tight mb-8">
            גלה את עולם הבינה המלאכותית
          </h1>
          <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            השוואה מקיפה של מודלים מובילים בתחום הבינה המלאכותית - מטקסט ועד תמונות, מקוד ועד מוזיקה
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/compare">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105">
                השוואת מודלים
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-foreground border-border hover:bg-accent px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                למד עוד
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Model Types Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#a78bfa] dark:via-[#818cf8] dark:to-[#a78bfa] mb-4">סוגי מודלים</h2>
        <p className="text-muted-foreground text-center mb-16 text-lg">גלה את המגוון הרחב של מודלי AI המתקדמים ביותר</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Code Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Code2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת קוד
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים בכתיבת קוד, דיבוג ואופטימיזציה של הליכי פיתוח
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  כתיבת קוד בשפות תכנות שונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  המרת קוד בין שפות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  תיקון באגים ואופטימיזציה
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת טסטים אוטומטיים
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="GitHub Copilot" 
                      url="https://github.com/features/copilot" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">GitHub Copilot</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="CodeWhisperer" 
                      url="https://aws.amazon.com/codewhisperer/" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">CodeWhisperer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Image className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת תמונות
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים ביצירה ועריכה של תמונות מתיאור טקסטואלי
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת תמונות מתיאור טקסטואלי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  שינוי סגנון אוטומטי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  עריכת תמונות קיימות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  הרכבת תמונות קיימות
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Midjourney" 
                      url="https://www.midjourney.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Midjourney</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="DALL·E" 
                      url="https://www.craiyon.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">DALL·E 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת טקסט
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים בתרגום, תיקון וניתוח שפה טבעית
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת תוכן אותנטי בשפות שונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  תרגום אוטומטי מתקדם
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  ניתוח רגשות וכוונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  סיכום טקסטים ארוכים
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="GPT-4" 
                      url="https://www.openai.com/product/gpt-4" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">GPT-4</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Claude" 
                      url="https://www.anthropic.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Claude 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v18M8 7v10M16 7v10M4 11v2M20 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת אודיו
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים ביצירת מוזיקה, הקלטות קול וסינתזה של דיבור
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת מוזיקה מקורית
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  המרת טקסט לדיבור טבעי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  שיפור איכות הקלטות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  סינתזה של קולות
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="ElevenLabs" 
                      url="https://elevenlabs.io" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">ElevenLabs</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Mubert" 
                      url="https://mubert.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Mubert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת וידאו
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים ביצירת וידאו, אנימציה ואפקטים מיוחדים
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת סרטונים מטקסט
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  אנימציה של תמונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  עריכת וידאו אוטומטית
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  הוספת אפקטים מיוחדים
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Runway" 
                      url="https://runwayml.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Runway</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Synthesia" 
                      url="https://www.synthesia.io" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Synthesia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Models */}
          <div className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text">
                  מודלים ליצירת תלת מימד
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                מודלים המתמחים ביצירת מודלים תלת מימדיים, טקסטורות וסביבות וירטואליות
              </p>
              <ul className="space-y-4 text-foreground/80 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת מודלים תלת מימדיים
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  עיצוב טקסטורות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  יצירת סביבות וירטואליות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                  אנימציה תלת מימדית
                </li>
              </ul>
              <div className="border-t border-border pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Blender AI" 
                      url="https://www.blender.org" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Blender AI</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Point-E" 
                      url="https://github.com/openai/point-e" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-foreground">Point-E</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demos Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#a78bfa] dark:via-[#818cf8] dark:to-[#a78bfa] mb-4">הדגמות אינטראקטיביות</h2>
        <p className="text-muted-foreground text-center mb-16 text-lg">
          נסה בעצמך את היכולות של מודלים שונים
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Generation Demo */}
          <div className="group rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text mb-4">הדגמת יצירת תמונות</h3>
            <p className="text-muted-foreground text-lg mb-8">
              נסה ליצור תמונות בעזרת תיאור טקסטואלי
            </p>
            <div className="aspect-video rounded-2xl bg-card flex items-center justify-center group-hover:bg-card/90 transition-all duration-500">
              <p className="text-muted-foreground text-lg">בקרוב...</p>
            </div>
          </div>

          {/* Text Generation Demo */}
          <div className="group rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <h3 className="text-2xl font-semibold text-black dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:text-transparent dark:bg-clip-text mb-4">הדגמת יצירת טקסט</h3>
            <p className="text-muted-foreground text-lg mb-8">
              נסה ליצור טקסט בעזרת הנחיות פשוטות
            </p>
            <div className="aspect-video rounded-2xl bg-card flex items-center justify-center group-hover:bg-card/90 transition-all duration-500">
              <p className="text-muted-foreground text-lg">בקרוב...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p> 2024 AI Model Comparer.  </p>
      </footer>
    </div>
  )
}