import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code2, Image, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] via-[#0d0e1a] to-[#0A0B14] text-white">
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-32 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 inline-block text-transparent bg-clip-text tracking-tight">
            גלה את עולם הבינה המלאכותית
          </h1>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            השוואה מקיפה של מודלים מובילים בתחום הבינה המלאכותית - מטקסט ועד תמונות, מקוד ועד מוזיקה
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/compare">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105">
                השוואת מודלים
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-gray-300 border-gray-700/50 hover:bg-gray-800/50 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                למד עוד
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Model Types Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 inline-block text-transparent bg-clip-text">סוגי מודלים</h2>
        <p className="text-gray-400 text-center mb-16 text-lg">גלה את המגוון הרחב של מודלי AI המתקדמים ביותר</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Code Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-400">
                  <Code2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת קוד</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים בכתיבת קוד, דיבוג ואופטימיזציה של הליכי פיתוח
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                  כתיבת קוד בשפות תכנות שונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                  המרת קוד בין שפות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                  תיקון באגים ואופטימיזציה
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                  יצירת טסטים אוטומטיים
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="GitHub Copilot" 
                      url="https://github.com/features/copilot" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">GitHub Copilot</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="CodeWhisperer" 
                      url="https://aws.amazon.com/codewhisperer/" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">CodeWhisperer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-400">
                  <Image className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת תמונות</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים ביצירה ועריכה של תמונות מתיאור טקסטואלי
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-purple-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                  יצירת תמונות מתיאור טקסטואלי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-purple-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                  שינוי סגנון אוטומטי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-purple-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                  עריכת תמונות קיימות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-purple-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                  הרכבת תמונות קיימות
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Midjourney" 
                      url="https://www.midjourney.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Midjourney</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="DALL·E" 
                      url="https://www.craiyon.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">DALL·E 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת טקסט</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים בתרגום, תיקון וניתוח שפה טבעית
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-cyan-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  יצירת תוכן אותנטי בשפות שונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-cyan-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  תרגום אוטומטי מתקדם
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-cyan-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  ניתוח רגשות וכוונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-cyan-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  סיכום טקסטים ארוכים
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="GPT-4" 
                      url="https://www.openai.com/product/gpt-4" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">GPT-4</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Claude" 
                      url="https://www.anthropic.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Claude 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v18M8 7v10M16 7v10M4 11v2M20 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת אודיו</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים ביצירת מוזיקה, הקלטות קול וסינתזה של דיבור
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-orange-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                  יצירת מוזיקה מקורית
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-orange-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                  המרת טקסט לדיבור טבעי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-orange-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                  שיפור איכות הקלטות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-orange-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                  סינתזה של קולות
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="ElevenLabs" 
                      url="https://elevenlabs.io" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">ElevenLabs</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Mubert" 
                      url="https://mubert.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Mubert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת וידאו</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים ביצירת וידאו, אנימציה ואפקטים מיוחדים
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-green-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                  יצירת סרטונים מטקסט
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-green-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                  אנימציה של תמונות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-green-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                  עריכת וידאו אוטומטית
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-green-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                  הוספת אפקטים מיוחדים
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Runway" 
                      url="https://runwayml.com" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Runway</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Synthesia" 
                      url="https://www.synthesia.io" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Synthesia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 text-yellow-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">מודלים ליצירת תלת מימד</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים ביצירת מודלים תלת מימדיים, טקסטורות וסביבות וירטואליות
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-yellow-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                  יצירת מודלים תלת מימדיים
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-yellow-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                  עיצוב טקסטורות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-yellow-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                  יצירת סביבות וירטואליות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-yellow-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                  אנימציה תלת מימדית
                </li>
              </ul>
              <div className="border-t border-gray-800 pt-8">
                <h4 className="text-sm font-medium text-gray-400 mb-4">מודלים מובילים</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Blender AI" 
                      url="https://www.blender.org" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Blender AI</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Point-E" 
                      url="https://github.com/openai/point-e" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Point-E</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demos Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 inline-block text-transparent bg-clip-text">הדגמות אינטראקטיביות</h2>
        <p className="text-gray-400 text-center mb-16 text-lg">נסה בעצמך את היכולות של מודלים שונים</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Generation Demo */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">הדגמת יצירת תמונות</h3>
            <p className="text-gray-400 text-lg mb-8">נסה ליצור תמונות בעזרת תיאור טקסטואלי</p>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#222] flex items-center justify-center group-hover:from-[#2d2d2d] group-hover:to-[#252525] transition-all duration-500">
              <p className="text-gray-500 text-lg">בקרוב...</p>
            </div>
          </div>

          {/* Text Generation Demo */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">הדגמת יצירת טקסט</h3>
            <p className="text-gray-400 text-lg mb-8">נסה ליצור טקסט בעזרת הנחיות פשוטות</p>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#222] flex items-center justify-center group-hover:from-[#2d2d2d] group-hover:to-[#252525] transition-all duration-500">
              <p className="text-gray-500 text-lg">בקרוב...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 inline-block text-transparent bg-clip-text">השוואת מודלים</h2>
        <p className="text-gray-400 text-center mb-16 text-lg">השווה בין המודלים המובילים בתחום הבינה המלאכותית</p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="חיפוש מודלים..."
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 opacity-0 blur transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-purple-500/10 group-hover:opacity-100" />
          </div>
        </div>
        <div className="mt-12 overflow-x-auto scrollbar-hide">
          <div className="inline-flex gap-4 px-4 pb-4">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white whitespace-nowrap shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300">
              מודלי שפה
            </button>
            {[
              "יצירת תמונות",
              "יצירת אודיו",
              "יצירת מוזיקה",
              "הקראת טקסט",
              "מרכזי שיחות"
            ].map((text) => (
              <button 
                key={text}
                className="px-6 py-3 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] text-gray-400 whitespace-nowrap hover:text-white hover:from-[#2a2a2a] hover:to-[#252525] transition-all duration-300"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}