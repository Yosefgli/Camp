# Big Picture

## Project Goal
מערכת הרשמה מקוונת לקייטנה — טופס דינמי מרובה שלבים לניהול תהליך הרישום מקצה לקצה.

**Core flows:**
1. איסוף פרטי משפחה וילדים
2. הצגת מידע והנחיות להורים
3. בחירת מסלולים + חישוב עלות אוטומטי
4. אימות נתונים + אישורים + חתימה דיגיטלית
5. מעבר לסליקה → קבלת תשובה → עדכון סטטוס רישום

**Goals:** ייעול תהליך הרישום, צמצום עבודה ידנית, מניעת טעויות, בסיס נתונים מסודר למשתתפים / תשלומים / תקשורת עם הורים.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database / CRM:** Airtable (via REST API)
- **Payments:** Israeli payment gateway (Tranzila / Cardcom — TBD)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** Vercel
