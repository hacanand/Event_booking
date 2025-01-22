"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
 
 

export default function SalespersonOnboardingPage() {
  const router = useRouter()
  const { user } = useClerk()

  useEffect(() => {
    if (!user || user.unsafeMetadata.role !== "salesperson") {
      router.push("/sign-in")
    } else {
      router.push("/salesperson/onboarding/connect-calendly")
    }
  }, [user, router])

  return null
}

