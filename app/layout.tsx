import type { Metadata } from 'next'
import './globals.css'
import { RegistrationProvider } from '@/context/RegistrationContext'

export const metadata: Metadata = {
  title: 'הרשמה לקייטנת חב"ד צור יצחק 2025',
  description: 'טופס הרשמה לקייטנת חב"ד צור יצחק קיץ 2025',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <RegistrationProvider>
          {children}
        </RegistrationProvider>
      </body>
    </html>
  )
}
