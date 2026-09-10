import type { Metadata } from 'next'
import { Oswald } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Tu Voto Vale — Rey de la Cancha',
  description: 'Votá por tu club favorito del fútbol argentino. Cada voto cuenta.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${oswald.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#050b18] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
