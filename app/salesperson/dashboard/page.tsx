"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/components/auth-context"
 
export default function SalespersonDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user || user.role !== "salesperson") {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#14144B] mb-8">Salesperson Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is your salesperson dashboard. More features coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}

