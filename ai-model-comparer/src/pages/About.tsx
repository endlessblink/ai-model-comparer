import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text mb-4">
                אודות הפרויקט
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                פלטפורמה מקיפה להשוואת מודלים של בינה מלאכותית, המסייעת לכם לבחור את הכלי המתאים ביותר לצרכיכם
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert mx-auto rtl">
              <h2 className="text-3xl font-bold mb-4">המטרה שלנו</h2>
              <p>
                בעולם המתפתח במהירות של הבינה המלאכותית, קשה לעקוב אחר כל החידושים והכלים החדשים. המטרה שלנו היא להנגיש מידע מקיף ומדויק על מודלים שונים של בינה מלאכותית, ולעזור למשתמשים לקבל החלטות מושכלות בבחירת הכלי המתאים להם.
              </p>

              <h2 className="text-3xl font-bold mb-4">מה אנחנו מציעים</h2>
              <ul>
                <li>השוואה מקיפה בין מודלים שונים של בינה מלאכותית</li>
                <li>מידע מפורט על יכולות, מחירים וזמינות API</li>
                <li>עדכונים שוטפים על חידושים ושיפורים במודלים קיימים</li>
                <li>סינון וחיפוש מתקדם למציאת המודל המתאים ביותר</li>
                <li>חוויית משתמש נוחה ואינטואיטיבית</li>
              </ul>

              <h2 className="text-3xl font-bold mb-4">למי זה מתאים?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">מפתחים</h3>
                  <p className="text-muted-foreground">
                    מידע על זמינות API, תיעוד טכני, ודוגמאות קוד לשילוב מודלים בפרויקטים
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">עסקים</h3>
                  <p className="text-muted-foreground">
                    השוואת מחירים, רישיונות שימוש, ומידע על תמיכה עסקית
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">חוקרים</h3>
                  <p className="text-muted-foreground">
                    מידע טכני מעמיק, השוואת ביצועים, ונתונים על מודלי אימון
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">משתמשים כלליים</h3>
                  <p className="text-muted-foreground">
                    סקירות פשוטות להבנה, השוואת מחירים, והמלצות מותאמות אישית
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">העתיד</h2>
              <p>
                אנחנו מחויבים לשמור על המידע באתר מעודכן ורלוונטי. בקרוב נוסיף תכונות חדשות כמו:
              </p>
              <ul>
                <li>השוואה ויזואלית של תוצאות בין מודלים שונים</li>
                <li>ביקורות ודירוגים מהקהילה</li>
                <li>מדריכים מפורטים לשימוש במודלים</li>
                <li>אינטגרציה עם כלים פופולריים</li>
              </ul>

              <div className="bg-accent/20 border border-border rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold mb-2">הצטרפו אלינו</h2>
                <p className="mb-0">
                  אנחנו מזמינים אתכם להיות חלק מהקהילה שלנו. שתפו את הניסיון שלכם, הציעו שיפורים, ועזרו לנו להפוך את עולם הבינה המלאכותית לנגיש יותר עבור כולם.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;