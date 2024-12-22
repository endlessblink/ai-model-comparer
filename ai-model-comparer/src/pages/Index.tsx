import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code2, Image, FileText } from "lucide-react";
import { ModelFavicon } from "@/components/ModelFavicon";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { supabase } from "@/lib/supabase";

interface Model {
  id: string;
  name: string;
  description: string;
  category: string;
  api_available: boolean;
  url: string;
  featured: boolean;
}

export default function Home() {
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  const [modelsByCategory, setModelsByCategory] = useState<Record<string, Model[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const { data: allModels, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter featured models
      const featured = allModels?.filter(model => model.featured) || [];
      setFeaturedModels(featured);

      // Group models by category
      const grouped = allModels?.reduce((acc, model) => {
        if (!acc[model.category]) {
          acc[model.category] = [];
        }
        acc[model.category].push(model);
        return acc;
      }, {} as Record<string, Model[]>);

      setModelsByCategory(grouped || {});
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'code':
        return <Code2 className="w-8 h-8" />;
      case 'image':
        return <Image className="w-8 h-8" />;
      case 'text':
        return <FileText className="w-8 h-8" />;
      case 'audio':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v18M8 7v10M16 7v10M4 11v2M20 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <Code2 className="w-8 h-8" />;
    }
  };

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
          <GradientHeading as="h1" className="text-6xl mb-8 tracking-tight">
            גלה את עולם הבינה המלאכותית
          </GradientHeading>
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

      {/* Featured Models Section */}
      {featuredModels.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <GradientHeading as="h2" className="text-4xl text-center mb-4">
            מודלים מובילים
          </GradientHeading>
          <p className="text-muted-foreground text-center mb-16 text-lg">
            המודלים המובילים והפופולריים ביותר
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <div key={model.id} className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                      {getCategoryIcon(model.category)}
                    </div>
                    <GradientHeading as="h3" className="text-2xl">
                      {model.name}
                    </GradientHeading>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {model.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-3 bg-card rounded-2xl p-3">
                      <ModelFavicon 
                        name={model.name}
                        url={model.url}
                        size={32}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Types Section */}
      <div className="container mx-auto px-4 py-32">
        <GradientHeading as="h2" className="text-4xl text-center mb-4">
          סוגי מודלים
        </GradientHeading>
        <p className="text-muted-foreground text-center mb-16 text-lg">
          גלה את המגוון הרחב של מודלי AI המתקדמים ביותר
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(modelsByCategory).map(([category, models]) => (
            <div key={category} className="group relative rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/0 via-secondary/0 to-primary/0 opacity-0 blur transition-all duration-500 group-hover:from-primary/20 group-hover:via-secondary/20 group-hover:to-primary/20 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                    {getCategoryIcon(category)}
                  </div>
                  <GradientHeading as="h3" className="text-2xl">
                    מודלים ל{category}
                  </GradientHeading>
                </div>
                <div className="border-t border-border pt-8">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">מודלים מובילים</h4>
                  <div className="flex flex-wrap gap-4">
                    {models.slice(0, 2).map((model) => (
                      <div key={model.id} className="flex items-center gap-3 bg-card rounded-2xl p-3 flex-1">
                        <ModelFavicon 
                          name={model.name}
                          url={model.url}
                          size={32}
                          className="rounded-lg"
                        />
                        <span className="text-sm font-medium text-foreground">{model.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demos Section */}
      <div className="container mx-auto px-4 py-32">
        <GradientHeading as="h2" className="text-4xl text-center mb-4">
          הדגמות אינטראקטיביות
        </GradientHeading>
        <p className="text-muted-foreground text-center mb-16 text-lg">
          נסה בעצמך את היכולות של מודלים שונים
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Generation Demo */}
          <div className="group rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <GradientHeading as="h3" className="text-2xl mb-4">
              הדגמת יצירת תמונות
            </GradientHeading>
            <p className="text-muted-foreground text-lg mb-8">
              נסה ליצור תמונות בעזרת תיאור טקסטואלי
            </p>
            <div className="aspect-video rounded-2xl bg-card flex items-center justify-center group-hover:bg-card/90 transition-all duration-500">
              <p className="text-muted-foreground text-lg">בקרוב...</p>
            </div>
          </div>

          {/* Text Generation Demo */}
          <div className="group rounded-3xl bg-card p-8 transition-all duration-500 hover:translate-y-[-4px] border border-black/10 dark:border-border">
            <GradientHeading as="h3" className="text-2xl mb-4">
              הדגמת יצירת טקסט
            </GradientHeading>
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
  );
}