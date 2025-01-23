"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
 
import { motion } from "framer-motion"
 
import { Steps } from "@/components/steps"
import { getCalendlyAuthUrl } from "@/lib/calendly"
import CalendlyConnectionSuccess from "../calendly-connection-success/page"
 
 

export default function ConnectCalendlyPage() {
  const router = useRouter()
  const [calendlyConnected, setCalendlyConnected] = useState(false)
  const [loading, setLoading] = useState();

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ]

  const handleCalendlyConnection = () => {
      router.push(getCalendlyAuthUrl());
    }
  // const handleNextStep = () => {
  //   router.push("/salesperson/onboarding/check-connection")
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={1} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {!calendlyConnected ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#14144B]">Connect Your Calendly</h2>
                <p className="text-gray-500">Connect your Calendly account to manage your appointments</p>
                <Button
                  onClick={handleCalendlyConnection}
                  className="w-full bg-[#00a3fa] hover:bg-[#00a3fa]/90 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Connect with Calendly
                </Button>
              </div>
            ) : (
              <CalendlyConnectionSuccess />
            )}
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

