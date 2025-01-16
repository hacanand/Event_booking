'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs"
import { SalespersonOnboarding } from './components/salesperson-onboarding'
import { CustomerOnboarding } from './components/customer-onboarding'
import { PageTransition } from '../components/page-transition'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [userRole, setUserRole] = useState<'salesperson' | 'customer' | null>(null)

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const role = user.publicMetadata.role as 'salesperson' | 'customer'
        setUserRole(role)
        if (role === 'customer') {
          router.push('/customer-dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, isLoaded, router])

  if (!isLoaded || !userRole) {
    return <div>Loading...</div>
  }

  return (
    <PageTransition>
      {userRole === 'salesperson' ? (
        <SalespersonOnboarding />
      ) : (
        <CustomerOnboarding />
      )}
    </PageTransition>
  )
}

