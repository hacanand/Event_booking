import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import {dark, shadesOfPurple} from '@clerk/themes'
import Navbar from './components/navbar'
 
 

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
          variables: { colorPrimary: '#805ad5', colorNeutral: '#f9fafb' },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

