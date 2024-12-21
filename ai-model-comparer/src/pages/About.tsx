import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter text-center mb-8">
              אודות הפרויקט
            </h1>
            <div className="prose prose-lg mx-auto rtl">
              <p>
                פרויקט זה נוצר במטרה לעזור למשתמשים להשוות בין מודלים שונים של יצירת תמונות באמצעות בינה מלאכותית.
              </p>
              <p>
                אנחנו מאמינים שבעזרת השוואה מקיפה וברורה, כל אחד יכול למצוא את הכלי המתאים ביותר לצרכיו.
              </p>
              <h2>המטרה שלנו</h2>
              <p>
                להנגיש מידע מקיף ומדויק על כלי AI ליצירת תמונות, ולעזור למשתמשים לקבל החלטות מושכלות.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;