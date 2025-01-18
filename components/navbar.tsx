'use client'

import Link from 'next/link'
// import { useAuth } from '../contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth, useClerk } from '@clerk/nextjs'

export default function Navbar() {
  const { user } = useClerk();
  
  return (
    <nav className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#14144B]">
            hiiTech
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user && (
                  <Link 
                    href={user.role === 'salesperson' ? "/dashboard" : "/customer-dashboard"} 
                    className="text-[#14144B] hover:text-[#00FF8C]"
                  >
                    Dashboard
                  </Link>
                )}
                {/* Removed Vendors and Buyers links */}
                <Link href="/about" className="text-[#14144B] hover:text-[#00FF8C]">
                  About Us
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-[#14144B]">{user.email}</span>
                   
                </div>
              </>
            ) : (
              <Button asChild className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

