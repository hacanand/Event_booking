'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const role = user.publicMetadata.role as 'salesperson' | 'customer'
        if (role === 'salesperson') {
          router.push('/salesperson-dashboard')
        } else {
          router.push('/customer-dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, isLoaded, router])

  return <div>Redirecting...</div>
}

