"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
 

export default function SalespersonOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user || user.role !== "salesperson") {
      router.push("/login")
    } else {
      router.push("/salesperson/onboarding/connect-calendly")
    }
  }, [user, router])

  return null
}

