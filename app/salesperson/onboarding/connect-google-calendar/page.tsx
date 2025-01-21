"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Steps } from "@/components/steps"

export default function ConnectGoogleCalendarPage() {
  const router = useRouter()
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ]

  const handleGoogleCalendarConnection = () => {
    setTimeout(() => {
      setGoogleCalendarConnected(true)
      handleNextStep()
    }, 1500)
  }

  const handleNextStep = () => {
    router.push("/salesperson/onboarding/share-link")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={3} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#14144B]">Connect Google Calendar</h2>
              <p className="text-gray-500">Connect your Google Calendar to sync with Calendly</p>
              <Button
                onClick={handleGoogleCalendarConnection}
                className="w-full bg-[#4285F4] hover:bg-[#4285F4]/90 text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Connect Google Calendar
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

