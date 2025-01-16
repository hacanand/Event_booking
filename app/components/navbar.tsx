'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()

  return (
    <nav className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="relative flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
              alt="hiipitch logo"
              width={120}
              height={40}
              priority
              className="object-contain"
              unoptimized
            />
          </Link>
          
          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link 
                  href={user.publicMetadata.role === 'salesperson' ? '/salesperson-dashboard' : '/customer-dashboard'}
                  className="text-[#14144B] hover:text-[#00FF8C]"
                >
                  Dashboard
                </Link>
                {user.publicMetadata.role === 'customer' && (
                  <Link 
                    href="/customer/book-slot"
                    className="text-[#14144B] hover:text-[#00FF8C]"
                  >
                    Book Meeting
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button asChild className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

