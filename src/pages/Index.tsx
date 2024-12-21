import { Link } from 'react-router-dom';
import ModelFavicon from '../components/ModelFavicon';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          גלה את עולם הבינה המלאכותית
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          השוואה מקיפה של מודלים מובילים בתחום הבינה המלאכותית - מטקסט ועד תמונות, מקוד ועד מוזיקה
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/compare">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300">
              התחל עכשיו
            </button>
          </Link>
          <Link to="/about">
            <button className="px-8 py-3 bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] text-gray-300 rounded-xl border border-gray-800 hover:text-white hover:border-gray-700 transition-all duration-300">
              למד עוד
            </button>
          </Link>
        </div>
      </div>

      {/* Model Types Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          סוגי מודלים
        </h2>
        <p className="text-gray-400 text-center mb-16">
          גלה את המודלים המובילים בכל תחום של בינה מלאכותית
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Code Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  מודלים ליצירת קוד
                </h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים בכתיבת קוד, דיבוג ואוטומציה של תהליכי פיתוח
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                  כתיבת קוד מתיאור טבעי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                  תיקון באגים אוטומטי
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                  המרת קוד בין שפות
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
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

          {/* Text Models */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-500/20 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  מודלים ליצירת טקסט
                </h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                מודלים המתמחים בתרגום, תיקון וניתוח שפה טבעית
              </p>
              <ul className="space-y-4 text-gray-300 mb-8 text-right">
                <li className="flex items-center gap-3 transition-all duration-300 hover:text-cyan-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  יצירת תוכן אותנטי
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
                      url="https://openai.com/gpt-4" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">GPT-4</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-b from-[#222] to-[#1a1a1a] rounded-2xl p-3 flex-1">
                    <ModelFavicon 
                      name="Claude" 
                      url="https://anthropic.com/claude" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">Claude 2</span>
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
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  מודלים ליצירת תמונות
                </h3>
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
                      url="https://openai.com/dall-e-3" 
                      size={32}
                      className="rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-300">DALL·E 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demos Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          הדגמות אינטראקטיביות
        </h2>
        <p className="text-gray-400 text-center mb-16">
          נסה בעצמך את היכולות של מודלים שונים
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Generation Demo */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              הדגמת יצירת תמונות
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              נסה ליצור תמונות בעזרת תיאור טקסטואלי
            </p>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#222] flex items-center justify-center">
              <p className="text-gray-500 text-lg">בקרוב...</p>
            </div>
          </div>

          {/* Text Generation Demo */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              הדגמת יצירת טקסט
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              נסה ליצור טקסט בעזרת הנחיות פשוטות
            </p>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#222] flex items-center justify-center">
              <p className="text-gray-500 text-lg">בקרוב...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          השוואת מודלים
        </h2>
        <p className="text-gray-400 text-center mb-16">
          השווה בין המודלים המובילים בתחום הבינה המלאכותית
        </p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="חיפוש מודלים..."
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>
        <div className="mt-12 overflow-x-auto">
          <div className="inline-flex gap-4 px-4 pb-4">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white whitespace-nowrap">
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
                className="px-6 py-3 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] text-gray-400 whitespace-nowrap hover:text-white transition-all duration-300"
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