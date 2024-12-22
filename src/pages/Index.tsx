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
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          השוואה מקיפה של מודלים מובילים בתחום הבינה המלאכותית - מטקסט ועד תמונות, מקוד ועד מוזיקה
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/compare">
            <button className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">התחל עכשיו</span>
            </button>
          </Link>
          <Link to="/about">
            <button className="group relative px-8 py-3 bg-gradient-to-b from-[#1a1a1a]/80 to-[#1f1f1f] text-gray-300 rounded-xl border border-gray-800/30 hover:border-gray-700/40 overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">למד עוד</span>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Text Models */}
          <div className="group relative rounded-xl bg-gradient-to-b from-[#1a1a1a]/90 to-[#1f1f1f] p-6 transition-all duration-300 hover:translate-y-[-2px] border border-gray-800/30 hover:border-gray-700/50 backdrop-blur-sm">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/5 to-indigo-500/5 text-blue-400 border border-blue-500/10">
                    <span className="text-lg">text</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                    טקסט
                  </h3>
                </div>
                <ModelFavicon 
                  name="ChatGPT" 
                  url="https://openai.com" 
                  size={24}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                מודלים ליצירת טקסטו
              </p>
              <div className="flex-grow space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">יתרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                      יכולת שפה מתקדמת
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                      אינטראקציה טבעית
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">חסרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      מחיר גבוה
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      עלות משאבים גבוהה
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800/50">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">שפה</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">מחקר</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">תכנות</span>
              </div>
            </div>
          </div>

          {/* Video Models */}
          <div className="group relative rounded-xl bg-gradient-to-b from-[#1a1a1a]/90 to-[#1f1f1f] p-6 transition-all duration-300 hover:translate-y-[-2px] border border-gray-800/30 hover:border-gray-700/50 backdrop-blur-sm">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5 text-purple-400 border border-purple-500/10">
                    <span className="text-lg">video</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                    וידאו
                  </h3>
                </div>
                <ModelFavicon 
                  name="Runway" 
                  url="https://runwayml.com" 
                  size={24}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                מודלים ליצירה ועריכת וידאו
              </p>
              <div className="flex-grow space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">יתרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      איכות גבוהה
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      שליטה מלאה
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">חסרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      זמן עיבוד ארוך
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      דרישות חומרה גבוהות
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800/50">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">וידאו</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">עריכה</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">אנימציה</span>
              </div>
            </div>
          </div>

          {/* Music Models */}
          <div className="group relative rounded-xl bg-gradient-to-b from-[#1a1a1a]/90 to-[#1f1f1f] p-6 transition-all duration-300 hover:translate-y-[-2px] border border-gray-800/30 hover:border-gray-700/50 backdrop-blur-sm">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/5 to-blue-500/5 text-cyan-400 border border-cyan-500/10">
                    <span className="text-lg">music</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                    מוזיקה
                  </h3>
                </div>
                <ModelFavicon 
                  name="Mubert" 
                  url="https://mubert.com" 
                  size={24}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                מודלים ליצירת מוזיקה
              </p>
              <div className="flex-grow space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">יתרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      מגוון סגנונות
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      התאמה אישית
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">חסרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      איכות לא עקבית
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      מגבלות זכויות יוצרים
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800/50">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">מוזיקה</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">אודיו</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">יצירה</span>
              </div>
            </div>
          </div>

          {/* Image Models */}
          <div className="group relative rounded-xl bg-gradient-to-b from-[#1a1a1a]/90 to-[#1f1f1f] p-6 transition-all duration-300 hover:translate-y-[-2px] border border-gray-800/30 hover:border-gray-700/50 backdrop-blur-sm">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5 text-purple-400 border border-purple-500/10">
                    <span className="text-lg">image</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                    הקראה
                  </h3>
                </div>
                <ModelFavicon 
                  name="Midjourney" 
                  url="https://midjourney.com" 
                  size={24}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                מודלים להקראת טקסט
              </p>
              <div className="flex-grow space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">יתרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      איכות קול טבעית
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      תמיכה בשפות רבות
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-300 mb-2">חסרונות</h4>
                  <ul className="space-y-1.5 text-gray-400 text-sm text-right">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      מגבלות אורך טקסט
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                      עלות גבוהה
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800/50">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">הקראה</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">קול</span>
                <span className="px-2 py-1 text-xs rounded-md bg-gray-800/40 text-gray-400 border border-gray-700/30">שפה</span>
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
        <p className="text-gray-400 text-center mb-16 leading-relaxed">
          נסה בעצמך את היכולות של מודלים שונים
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Generation Demo */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a]/80 to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px] border border-gray-800/20 hover:border-gray-700/30 backdrop-blur-xl">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                הדגמת יצירת תמונות
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                נסה ליצור תמונות בעזרת תיאור טקסטואלי
              </p>
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a]/80 to-[#222]/80 border border-gray-800/30 flex items-center justify-center">
                <p className="text-gray-500 text-lg">בקרוב...</p>
              </div>
            </div>
          </div>

          {/* Text Generation Demo */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-[#1a1a1a]/80 to-[#1f1f1f] p-8 transition-all duration-500 hover:translate-y-[-4px] border border-gray-800/20 hover:border-gray-700/30 backdrop-blur-xl">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-500 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                הדגמת יצירת טקסט
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                נסה ליצור טקסט בעזרת הנחיות פשוטות
              </p>
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2a2a2a]/80 to-[#222]/80 border border-gray-800/30 flex items-center justify-center">
                <p className="text-gray-500 text-lg">בקרוב...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          השוואת מודלים
        </h2>
        <p className="text-gray-400 text-center mb-16 leading-relaxed">
          השווה בין המודלים המובילים בתחום הבינה המלאכותית
        </p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="חיפוש מודלים..."
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-b from-[#1a1a1a]/80 to-[#1f1f1f] border border-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>
        <div className="mt-12 overflow-x-auto">
          <div className="inline-flex gap-4 px-4 pb-4">
            <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl whitespace-nowrap overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">מודלי שפה</span>
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
                className="group relative px-6 py-3 bg-gradient-to-b from-[#1a1a1a]/80 to-[#1f1f1f] text-gray-400 rounded-2xl whitespace-nowrap border border-gray-800/30 hover:border-gray-700/40 overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">{text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 