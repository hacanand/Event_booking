'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
 
import { useUser } from '@clerk/nextjs'
import { PageTransition } from '@/components/page-transition'
import { SalespersonOnboarding } from '@/components/salesperson-onboarding'
import { CustomerOnboarding } from '@/components/customer-onboarding'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [userRole, setUserRole] = useState<'salesperson' | 'customer' | null>(null)

  useEffect(() => {
    if (user) {
      setUserRole(user.unsafeMetadata.role as 'salesperson' | 'customer')
    } else {
      router.push("/sign-in");
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

