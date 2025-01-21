import { Inter } from 'next/font/google'
import './globals.css'
 
 
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/navbar'
import { AuthProvider } from '@/components/auth-context'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <AuthProvider>
            <Navbar />
            <AnimatePresence mode="wait">
              <main className="flex-grow">{children}</main>
            </AnimatePresence>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}

