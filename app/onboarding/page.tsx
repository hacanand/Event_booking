'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/auth-context'
import { SalespersonOnboarding } from './components/salesperson-onboarding'
import { CustomerOnboarding } from './components/customer-onboarding'
import { PageTransition } from '../components/page-transition'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<'salesperson' | 'customer' | null>(null)

  useEffect(() => {
    if (user) {
      setUserRole(user.role)
    } else {
      router.push('/login')
    }
  }, [user, router])

  if (!userRole) {
    return null // or a loading spinner
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

