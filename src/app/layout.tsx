import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DocFlow AI',
  description: 'Configureaza orice flux de procesare documente cu AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-900 text-slate-200 font-mono antialiased">
        {children}
      </body>
    </html>
  )
}
