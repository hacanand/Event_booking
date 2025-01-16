import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import {dark, shadesOfPurple} from '@clerk/themes'
import Navbar from './components/navbar'
import { ToastProvider } from './contexts/toast-context'
 
 

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        baseTheme: shadesOfPurple,
        variables: { colorPrimary: "#00FF8C" },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

