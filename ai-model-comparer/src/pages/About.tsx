import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-8">אודות</h1>
          <div className="max-w-2xl mx-auto prose prose-invert">
            <p>
              AI Model Comparer הוא כלי שנועד לעזור למשתמשים להשוות בין מודלים שונים של בינה מלאכותית.
              הפלטפורמה שלנו מספקת מידע מקיף על מגוון רחב של מודלי AI, כולל יכולות, מחירים, ויתרונות וחסרונות.
            </p>
            <p>
              המטרה שלנו היא לעזור למפתחים, חוקרים ואנשי מקצוע לקבל החלטות מושכלות בבחירת מודל ה-AI 
              המתאים ביותר לצרכים שלהם.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;